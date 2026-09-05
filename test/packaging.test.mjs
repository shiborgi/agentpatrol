import test from 'node:test';
import assert from 'node:assert/strict';
import { appendFile, link, mkdir, readFile, rename, symlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { build, check, getCatalog, validate, validateManifest } from '../src/index.mjs';
import { contained, readTree } from '../src/core.mjs';
import { changeJSON, fixture } from './helpers.mjs';

const schema = 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json';
const extension = 'io.shiborgi.agentpatrol';

test('portable manifest follows the closed upstream schema, not a portable agents claim', () => {
  assert.equal(validateManifest({ $schema: schema, name: 'minimal' }), true);
  assert.equal(validateManifest({ $schema: schema, name: 'complete', version: '1.0.0', author: { name: 'Author' }, keywords: ['skills'], extensions: { [extension]: {} } }), true);
  for (const bad of [
    {}, { name: 'missing-schema' }, { $schema: schema, name: 'bad--name' },
    { $schema: schema, name: 'bad..name' }, { $schema: schema, name: 'x'.repeat(65) },
    { $schema: schema, name: 'x', agents: [] }, { $schema: schema, name: 'x', skills: './skills' },
    { $schema: schema, name: 'x', version: 2 }, { $schema: schema, name: 'x', author: { extra: '' } },
    { $schema: schema, name: 'x', extensions: { [extension]: [] } },
    { $schema: schema, name: 'x', keywords: [4] },
  ]) assert.throws(() => validateManifest(bad));
});

test('build is self-contained and deterministic, and ignores unrelated sibling output', async (t) => {
  const { root, out } = await fixture(t);
  for (const id of ['nextjs-engineer', 'service-engineer']) {
    await mkdir(path.join(out, id), { recursive: true });
    await writeFile(path.join(out, id, 'plugin.json'), 'user-owned output\n');
  }
  const result = await build({ root, out });
  const catalog = await getCatalog({ root });
  assert.equal(result.plugins.length, 10);
  const before = await readTree(out);
  await build({ root, out });
  assert.deepEqual(await readTree(out), before);
  assert.equal((await check({ root, out })).valid, true);
  assert.equal((await validate({ root, out })).valid, true);
  for (const id of ['nextjs-engineer', 'service-engineer']) assert.equal(await readFile(path.join(out, id, 'plugin.json'), 'utf8'), 'user-owned output\n');
  for (const name of result.plugins) {
    const files = await readTree(path.join(out, name));
    const manifest = JSON.parse(files.get('plugin.json'));
    assert.equal(manifest.$schema, schema);
    assert.equal(manifest.version, '1.0.0');
    assert.deepEqual(Object.keys(manifest.extensions), [extension]);
    assert.ok(files.has(`${extension}/metadata.json`));
    assert.ok(files.has(`${extension}/instructions.md`));
    assert.ok(!files.has('mcp.json'));
    assert.ok(!files.has('agentcontext/instructions.md'));
    assert.ok(!JSON.stringify(manifest).includes(root));
    const metadata = JSON.parse(files.get(`${extension}/metadata.json`));
    assert.equal(metadata.catalogDigest, catalog.contentDigest);
    for (const { id } of metadata.skills) assert.deepEqual(files.get(`skills/${id}/SKILL.md`), await readFile(path.join(root, 'skills', id, 'SKILL.md')));
  }
});

test('check finds drift before anything can rebuild it; validate permits JSON formatting only', async (t) => {
  const options = await fixture(t);
  await build(options);
  const manifest = path.join(options.out, 'developer/plugin.json');
  await changeJSON(manifest, () => {});
  const bytes = await readFile(manifest);
  await assert.rejects(check(options), /content drift/);
  assert.equal((await validate(options)).valid, true);
  assert.deepEqual(await readFile(manifest), bytes);
  await build(options);
  await appendFile(path.join(options.root, 'agents/developer/instructions.md'), '\nChanged source.\n');
  await assert.rejects(check(options), /content drift/);
  await build(options);
  assert.equal((await check(options)).valid, true);
});

test('invalid manifests, metadata digests and packaged skills fail validation', async (t) => {
  for (const [relative, mutate, message] of [
    ['developer/plugin.json', (value) => value.agents = [], /Unknown manifest field/],
    [`developer/${extension}/metadata.json`, (value) => value.instructions += 'tamper', /Invalid metadata digest/],
  ]) {
    const options = await fixture(t);
    await build(options);
    await changeJSON(path.join(options.out, relative), mutate);
    await assert.rejects(validate(options), message);
  }
  const options = await fixture(t);
  await build(options);
  await appendFile(path.join(options.out, 'developer/skills/implement-change/SKILL.md'), '\nTampered skill.\n');
  await assert.rejects(validate(options), /Packaged skill mismatch/);
});

test('build refuses unexpected files and foreign targets without deleting or partially updating', async (t) => {
  const options = await fixture(t);
  await build(options);
  const sentinel = path.join(options.out, 'release/untracked.txt');
  await writeFile(sentinel, 'do not delete');
  const before = await readTree(options.out);
  await appendFile(path.join(options.root, 'agents/architect/instructions.md'), '\nChanged source.\n');
  await assert.rejects(build(options), /Refusing to remove unexpected file/);
  assert.deepEqual(await readTree(options.out), before);
  const other = await fixture(t);
  await mkdir(path.join(other.out, 'developer'), { recursive: true });
  await writeFile(path.join(other.out, 'developer/plugin.json'), JSON.stringify({ $schema: schema, name: 'developer' }));
  await assert.rejects(build(other), /unowned plugin/);
  assert.deepEqual([...await readTree(other.out)].map(([file]) => file), ['developer/plugin.json']);
});

test('skill assets are copied and all local references must exist within the skill', async (t) => {
  const options = await fixture(t);
  const skill = path.join(options.root, 'skills/react-development');
  await mkdir(path.join(skill, 'references'));
  await writeFile(path.join(skill, 'references/example.md'), '# Local example\n');
  await appendFile(path.join(skill, 'SKILL.md'), '\n[Example](references/example.md)\n');
  await build(options);
  assert.equal(await readFile(path.join(options.out, 'profile-react/skills/react-development/references/example.md'), 'utf8'), '# Local example\n');
  await appendFile(path.join(skill, 'SKILL.md'), '\n[Missing](references/missing.md)\n');
  await assert.rejects(getCatalog(options), /Missing or escaping skill reference/);
  const escape = await fixture(t);
  await appendFile(path.join(escape.root, 'skills/react-development/SKILL.md'), '\n[Escape](../verify-evidence/SKILL.md)\n');
  await assert.rejects(getCatalog(escape), /Missing or escaping skill reference/);
});

test('skills require matching frontmatter and complete behavioral sections', async (t) => {
  for (const edit of [
    (text) => text.replace('name: react-development', 'name: wrong-name'),
    (text) => text.replace('## Safety', '## Missing'),
    (text) => text.replace('## Verification', '## Missing'),
    (text) => text.replace('description:', 'unsupported:'),
    (text) => text.replace(/## Inputs[\s\S]*?(?=## Procedure)/, '## Inputs\n\n'),
    (text) => `${text}\n## Safety\nDuplicate section.\n`,
    (text) => text.replace(/^description: .+$/m, 'description: invalid: YAML mapping'),
  ]) {
    const { root } = await fixture(t);
    const file = path.join(root, 'skills/react-development/SKILL.md');
    await writeFile(file, edit(await readFile(file, 'utf8')));
    await assert.rejects(getCatalog({ root }));
  }
});

test('reference-style and angle-bracket skill links cannot escape or name missing assets', async (t) => {
  for (const reference of ['[Example](<../verify-evidence/SKILL.md>)', '[Example][external]\n\n[external]: ../../secret.txt', '[Missing](<references/missing file.md>)']) {
    const options = await fixture(t);
    await appendFile(path.join(options.root, 'skills/react-development/SKILL.md'), `\n${reference}\n`);
    await assert.rejects(getCatalog(options), /Missing or escaping skill reference/);
  }
});

test('aggregate catalog and generated tree bounds fail before any build writes', async (t) => {
  const options = await fixture(t);
  for (const id of ['react-development', 'python-development']) {
    for (let index = 0; index < 5; index++) await writeFile(path.join(options.root, 'skills', id, `asset-${index}.bin`), Buffer.alloc(900000));
  }
  await assert.rejects(build(options), /Active catalog content exceeds/);
  await assert.rejects(readFile(path.join(options.out, 'architect/plugin.json')), /ENOENT/);
  const deep = await fixture(t);
  const nested = path.join(deep.root, 'skills/react-development', ...Array(16).fill('nested'));
  await mkdir(nested, { recursive: true });
  await writeFile(path.join(nested, 'asset.txt'), 'asset');
  await assert.rejects(build(deep), /Generated tree is too deep/);
  await assert.rejects(readFile(path.join(deep.out, 'architect/plugin.json')), /ENOENT/);
});

test('containment rejects traversal and source/output overlap', async (t) => {
  for (const bad of ['../escape', '/absolute', 'a/../../escape', 'a\\b', './x', 'a//b']) assert.throws(() => contained('/root', bad));
  const { root } = await fixture(t);
  for (const out of [root, path.dirname(root), path.join(root, 'agents'), path.join(root, 'skills/nested')]) await assert.rejects(build({ root, out }), /overlap|inside source/);
});

test('rejects file, directory, root and output symlinks, including internal targets', async (t) => {
  for (const relative of ['agents/developer/instructions.md', 'profiles/react', 'skills/react-development']) {
    const options = await fixture(t);
    const file = path.join(options.root, relative);
    await rename(file, `${file}-actual`);
    await symlink(`${file}-actual`, file);
    await assert.rejects(getCatalog(options), /Symlink/);
  }
  const options = await fixture(t);
  const linked = path.join(options.temp, 'linked-root');
  await symlink(options.root, linked);
  await assert.rejects(getCatalog({ root: linked }), /Symlink/);
  await mkdir(options.out);
  const linkedOut = path.join(options.temp, 'linked-out');
  await symlink(options.out, linkedOut);
  await assert.rejects(build({ root: options.root, out: path.join(linkedOut, 'nested') }), /Symlink/);
  await build(options);
  const file = path.join(options.out, 'developer/plugin.json');
  await rename(file, `${file}-actual`);
  await symlink(`${file}-actual`, file);
  await assert.rejects(check(options), /Symlink/);
  await assert.rejects(build(options), /Symlink/);
});

test('rejects hard-linked and oversized source files', async (t) => {
  const options = await fixture(t);
  await link(path.join(options.root, 'agents/developer/instructions.md'), path.join(options.temp, 'alias'));
  await assert.rejects(getCatalog(options), /Hard-linked/);
  const other = await fixture(t);
  await writeFile(path.join(other.root, 'skills/react-development/SKILL.md'), Buffer.alloc(1024 * 1024 + 1));
  await assert.rejects(getCatalog(other), /oversized/i);
});
