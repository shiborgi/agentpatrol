import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { appendFile, mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { canonicalJSON, digest, getCatalog, resolve, VERSION, PROTOCOL_VERSION } from '../src/index.mjs';
import { changeJSON, fixture, ROOT } from './helpers.mjs';
import { loadCatalog } from '../src/catalog.mjs';
import { compose } from '../src/resolve.mjs';

const request = { protocolVersion: '1.0', persona: 'developer', profiles: ['react'] };

test('catalog has the exact protocol envelope, required personas, stages and profiles', async () => {
  assert.equal(VERSION, '1.0.0');
  assert.equal(PROTOCOL_VERSION, '1.0');
  const catalog = await getCatalog();
  assert.deepEqual(Object.keys(catalog).sort(), ['catalogVersion', 'contentDigest', 'personas', 'profiles', 'protocolVersion']);
  assert.match(catalog.contentDigest, /^[a-f0-9]{64}$/);
  assert.deepEqual(catalog.personas.map(({ id }) => id), ['architect', 'developer', 'qa', 'release']);
  assert.deepEqual(Object.fromEntries(catalog.personas.map(({ id, stages }) => [id, stages])), {
    architect: ['spec', 'plan'], developer: ['build'], qa: ['spec-review', 'plan-review', 'build-review'], release: ['ship'],
  });
  assert.deepEqual(catalog.profiles.map(({ id }) => id), ['general', 'mcp', 'nextjs', 'python', 'react', 'service']);
  for (const persona of catalog.personas) assert.deepEqual(Object.keys(persona).sort(), ['description', 'id', 'skills', 'stages']);
  for (const profile of catalog.profiles) assert.deepEqual(Object.keys(profile).sort(), ['description', 'id', 'signals', 'skills']);
});

test('resolution normalizes profiles and deduplicates skills in first-reference order', async () => {
  const first = await resolve({ ...request, profiles: ['react', 'general', 'nextjs', 'react'] });
  const second = await resolve({ ...request, profiles: ['nextjs', 'react', 'general'] });
  assert.deepEqual(first, second);
  assert.deepEqual(Object.keys(first).sort(), ['catalogDigest', 'catalogVersion', 'digest', 'instructions', 'persona', 'profiles', 'protocolVersion', 'skills']);
  assert.equal(first.catalogDigest, (await getCatalog()).contentDigest);
  assert.deepEqual(first.profiles, ['general', 'nextjs', 'react']);
  assert.deepEqual(first.skills.map(({ id }) => id), ['implement-change', 'verify-evidence', 'react-development', 'nextjs-app-router']);
  assert.ok(first.instructions.startsWith('# Persona: developer\n'));
  const sections = ['# Persona: developer', '# Profile: general', '# Profile: nextjs', '# Profile: react', '# Skill: implement-change', '# Skill: verify-evidence', '# Skill: react-development', '# Skill: nextjs-app-router'];
  for (let index = 1; index < sections.length; index++) assert.ok(first.instructions.indexOf(sections[index - 1]) < first.instructions.indexOf(sections[index]));
  for (const skill of first.skills) {
    assert.deepEqual(Object.keys(skill).sort(), ['id', 'instructions']);
    assert.equal(skill.instructions, (await readFile(path.join(ROOT, 'skills', skill.id, 'SKILL.md'), 'utf8')).trim());
  }
  assert.ok(!first.instructions.includes(ROOT));
});

test('digest uses recursively sorted complete payload, not a prefixed or partial hash', async () => {
  assert.equal(canonicalJSON({ z: { b: 2, a: 1 }, a: [{ d: 4, c: 3 }] }), '{"a":[{"c":3,"d":4}],"z":{"a":1,"b":2}}');
  assert.equal(canonicalJSON({ 2: 'two', 10: 'ten' }), '{"10":"ten","2":"two"}');
  assert.throws(() => canonicalJSON(undefined), /not JSON/);
  assert.throws(() => canonicalJSON(NaN), /not finite/);
  const { digest: actual, ...payload } = await resolve(request);
  const sort = (value) => Array.isArray(value) ? value.map(sort) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, sort(value[key])])) : value;
  assert.match(actual, /^[a-f0-9]{64}$/);
  assert.equal(actual, createHash('sha256').update(JSON.stringify(sort(payload)), 'utf8').digest('hex'));
  for (const key of Object.keys(payload)) {
    const changed = structuredClone(payload);
    changed[key] = `${JSON.stringify(changed[key])} changed`;
    assert.notEqual(actual, digest(changed), key);
  }
});

test('every persona composes every profile, and empty profiles have no implicit general', async () => {
  const catalog = await getCatalog();
  for (const persona of catalog.personas) {
    const all = await resolve({ ...request, persona: persona.id, profiles: catalog.profiles.map(({ id }) => id) });
    assert.equal(all.persona, persona.id);
    assert.equal(new Set(all.skills.map(({ id }) => id)).size, all.skills.length);
    const bare = await resolve({ ...request, persona: persona.id, profiles: [] });
    assert.deepEqual(bare.profiles, []);
    assert.ok(!bare.instructions.includes('# Profile:'));
  }
});

test('rejects wrong versions, unknown fields, missing fields, bad IDs and unknown profiles', async () => {
  for (const invalid of [
    null, [], {}, { ...request, protocolVersion: '9.9' }, { ...request, extra: true },
    { protocolVersion: '1.0', persona: 'developer' }, { ...request, profiles: 'react' },
    { ...request, persona: '../developer' }, { ...request, persona: 'tech-lead' },
    { ...request, profiles: ['unknown'] }, { ...request, profiles: [42] },
    { ...request, profiles: Array(129).fill('react') },
    { protocolVersion: '1.0', role: 'developer', profiles: [] },
  ]) await assert.rejects(resolve(invalid));
});

test('unlisted authoring is not read or discovered', async (t) => {
  const { root } = await fixture(t);
  await mkdir(path.join(root, 'agents/nextjs-engineer'), { recursive: true });
  await writeFile(path.join(root, 'agents/nextjs-engineer/agent.json'), 'not json');
  await mkdir(path.join(root, 'profiles/unknown'), { recursive: true });
  await writeFile(path.join(root, 'profiles/unknown/profile.json'), 'not json');
  assert.deepEqual(await getCatalog({ root }), await getCatalog());
  await assert.rejects(resolve({ ...request, profiles: ['unknown'] }, { root }), /Unknown profile/);
});

test('authored catalog and descriptors reject duplicate, unknown, missing and mismatched references', async (t) => {
  for (const [relative, mutate, message] of [
    ['catalog.json', (value) => value.personas.push('developer'), /duplicate/],
    ['catalog.json', (value) => value.profiles.splice(value.profiles.indexOf('mcp'), 1), /Missing required profile/],
    ['catalog.json', (value) => value.personas.splice(value.personas.indexOf('qa'), 1), /Missing required persona/],
    ['catalog.json', (value) => value.personas.push('../escape'), /invalid ID/],
    ['catalog.json', (value) => value.catalogVersion = '9.9.9', /catalogVersion/],
    ['agents/developer/persona.json', (value) => value.extra = true, /unknown fields/],
    ['agents/developer/persona.json', (value) => value.id = 'qa', /ID mismatch/],
    ['agents/developer/persona.json', (value) => value.stages = ['ship'], /Missing stage build/],
    ['agents/developer/persona.json', (value) => value.stages = ['execute'], /Invalid stages/],
    ['profiles/react/profile.json', (value) => value.skills.push('react-development'), /duplicate/],
    ['profiles/react/profile.json', (value) => value.skills.push('missing-skill'), /ENOENT/],
  ]) {
    await t.test(relative + String(message), async (t) => {
      const { root } = await fixture(t);
      await changeJSON(path.join(root, relative), mutate);
      await assert.rejects(getCatalog({ root }), message);
    });
  }
});

test('persona, profile and skill body changes invalidate catalog identity without changing IDs or version', async (t) => {
  for (const relative of ['agents/developer/instructions.md', 'profiles/react/instructions.md', 'skills/react-development/SKILL.md']) {
    const { root } = await fixture(t);
    const catalogBefore = await getCatalog({ root });
    const before = await resolve(request, { root });
    await appendFile(path.join(root, relative), '\nAdditional evidence requirement.\n');
    const after = await resolve(request, { root });
    const catalogAfter = await getCatalog({ root });
    const { contentDigest: oldDigest, ...oldCatalog } = catalogBefore;
    const { contentDigest: newDigest, ...newCatalog } = catalogAfter;
    assert.deepEqual(oldCatalog, newCatalog);
    assert.notEqual(oldDigest, newDigest);
    assert.equal(before.catalogDigest, oldDigest);
    assert.equal(after.catalogDigest, newDigest);
    assert.notEqual(before.digest, after.digest);
    assert.ok(!JSON.stringify(after).includes(root));
  }
});

test('catalog fingerprint covers reference assets and raw binary bytes, even for unselected skills', async (t) => {
  const options = await fixture(t);
  const skill = path.join(options.root, 'skills/python-development');
  await mkdir(path.join(skill, 'references'));
  await writeFile(path.join(skill, 'references/example.md'), '# Example\n');
  await writeFile(path.join(skill, 'asset.bin'), Buffer.from([0xff, 0x00, 0x80]));
  await appendFile(path.join(skill, 'SKILL.md'), '\n[Example](references/example.md)\n');
  let before = await resolve(request, options);
  for (const [relative, content] of [
    ['references/example.md', '# Revised example\n'],
    ['asset.bin', Buffer.from([0xfe, 0x00, 0x80])],
  ]) {
    await writeFile(path.join(skill, relative), content);
    const after = await resolve(request, options);
    const catalog = await getCatalog(options);
    assert.equal(catalog.catalogVersion, '1.0.0');
    assert.equal(after.catalogDigest, catalog.contentDigest);
    assert.notEqual(after.catalogDigest, before.catalogDigest);
    assert.notEqual(after.digest, before.digest);
    assert.equal(after.instructions, before.instructions);
    assert.deepEqual(after.skills, before.skills);
    before = after;
  }
  await rename(path.join(skill, 'asset.bin'), path.join(skill, 'renamed.bin'));
  assert.notEqual((await getCatalog(options)).contentDigest, before.catalogDigest);
});

test('fingerprint canonicalizes descriptors and includes complete instruction text', async (t) => {
  const options = await fixture(t);
  const snapshot = await loadCatalog(options);
  const expected = {
    catalogVersion: snapshot.catalogVersion,
    personas: snapshot.personas,
    profiles: snapshot.profiles,
    skills: Object.fromEntries([...snapshot.skills].reverse().map(([id, { files }]) => [
      id, Object.fromEntries([...files].reverse().map(([file, bytes]) => [file, bytes.toString('base64')])),
    ])),
  };
  assert.equal(snapshot.contentDigest, createHash('sha256').update(canonicalJSON(expected), 'utf8').digest('hex'));
  const descriptor = path.join(options.root, 'agents/developer/persona.json');
  const data = JSON.parse(await readFile(descriptor, 'utf8'));
  await writeFile(descriptor, JSON.stringify(Object.fromEntries(Object.entries(data).reverse()), null, 4));
  await changeJSON(path.join(options.root, 'catalog.json'), (value) => {
    value.personas.reverse();
    value.profiles.reverse();
  });
  assert.equal((await getCatalog(options)).contentDigest, snapshot.contentDigest);
  await appendFile(path.join(options.root, 'agents/developer/instructions.md'), '\n');
  const after = await resolve(request, options);
  assert.notEqual(after.catalogDigest, snapshot.contentDigest);
  assert.equal(after.instructions, compose(snapshot, request).instructions);
  await changeJSON(descriptor, (value) => value.description += ' revised');
  assert.notEqual((await getCatalog(options)).contentDigest, after.catalogDigest);
  const beforeProfile = await getCatalog(options);
  await changeJSON(path.join(options.root, 'profiles/react/profile.json'), (value) => value.signals.push('frontend'));
  assert.notEqual((await getCatalog(options)).contentDigest, beforeProfile.contentDigest);
});

test('resolution uses the already-loaded catalog fingerprint without rereading changed sources', async (t) => {
  const options = await fixture(t);
  const snapshot = await loadCatalog(options);
  const before = compose(snapshot, request);
  await appendFile(path.join(options.root, 'skills/react-development/SKILL.md'), '\nNew skill content.\n');
  assert.deepEqual(compose(snapshot, request), before);
  assert.equal(before.catalogDigest, snapshot.contentDigest);
  assert.notEqual((await resolve(request, options)).catalogDigest, snapshot.contentDigest);
});

test('library responses enforce the complete serialized output bound', async (t) => {
  const options = await fixture(t);
  await appendFile(path.join(options.root, 'skills/react-development/SKILL.md'), 'x'.repeat(530000));
  await assert.rejects(resolve(request, options), /Resolved output exceeds 1 MiB/);
  const other = await fixture(t);
  for (const id of ['architect', 'developer', 'qa', 'release']) {
    await changeJSON(path.join(other.root, 'agents', id, 'persona.json'), (value) => value.description = 'x'.repeat(270000));
  }
  await assert.rejects(getCatalog(other), /Catalog output exceeds 1 MiB/);
});
