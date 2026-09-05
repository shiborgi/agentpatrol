import { mkdir, open } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { assert, canonicalJSON, contained, DEFAULT_ROOT, digest, json, MAX_OUTPUT_BYTES, PROTOCOL_VERSION, readTree, safePath, VERSION } from './core.mjs';
import { loadCatalog } from './catalog.mjs';
import { compose } from './resolve.mjs';
import { loadSkill } from './skills.mjs';

const SCHEMA = 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json';
const EXTENSION = 'io.shiborgi.agentpatrol';

export function validateManifest(manifest) {
  assert(manifest !== null && typeof manifest === 'object' && !Array.isArray(manifest), 'Manifest must be an object');
  const allowed = ['$schema', 'name', 'version', 'description', 'author', 'homepage', 'repository', 'license', 'keywords', 'extensions'];
  assert(Object.keys(manifest).every((key) => allowed.includes(key)), 'Unknown manifest field');
  assert(manifest.$schema === SCHEMA, 'Invalid manifest $schema');
  assert(typeof manifest.name === 'string' && manifest.name.length <= 64 && /^(?!.*(?:--|\.\.))[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/.test(manifest.name), 'Invalid manifest name');
  for (const key of ['version', 'description', 'homepage', 'repository', 'license']) {
    if (Object.hasOwn(manifest, key)) assert(typeof manifest[key] === 'string', `Invalid manifest ${key}`);
  }
  if (Object.hasOwn(manifest, 'keywords')) assert(Array.isArray(manifest.keywords) && manifest.keywords.every((item) => typeof item === 'string'), 'Invalid manifest keywords');
  for (const key of ['author', 'extensions']) {
    if (!Object.hasOwn(manifest, key)) continue;
    const value = manifest[key];
    assert(value !== null && typeof value === 'object' && !Array.isArray(value), `Invalid manifest ${key}`);
    if (key === 'author') assert(Object.entries(value).every(([field, item]) => ['name', 'email', 'url'].includes(field) && typeof item === 'string'), 'Invalid manifest author');
    else assert(Object.values(value).every((item) => item !== null && typeof item === 'object' && !Array.isArray(item)), 'Invalid manifest extension');
  }
  return true;
}

async function materialize(options) {
  const catalog = await loadCatalog(options);
  const artifacts = new Map();
  for (const kind of ['personas', 'profiles']) {
    for (const descriptor of catalog[kind]) {
      const name = kind === 'personas' ? descriptor.id : `profile-${descriptor.id}`;
      assert(!artifacts.has(name), `Plugin name collision: ${name}`);
      let metadata;
      if (kind === 'personas') {
        metadata = compose(catalog, { protocolVersion: PROTOCOL_VERSION, persona: descriptor.id, profiles: ['general'] });
      } else {
        const skills = descriptor.skills.map((id) => ({ id, instructions: catalog.skills.get(id).instructions }));
        const payload = {
          protocolVersion: PROTOCOL_VERSION, catalogVersion: catalog.catalogVersion, catalogDigest: catalog.contentDigest, profile: descriptor.id, skills,
          instructions: [`# Profile: ${descriptor.id}\n\n${descriptor.instructions.trim()}`, ...skills.map((skill) => `# Skill: ${skill.id}\n\n${skill.instructions}`)].join('\n\n'),
        };
        metadata = { ...payload, digest: digest(payload) };
      }
      const manifest = {
        $schema: SCHEMA, name, version: VERSION, description: descriptor.description, license: 'Apache-2.0',
        extensions: { [EXTENSION]: {
          kind: kind === 'personas' ? 'persona' : 'profile', id: descriptor.id,
          metadata: `${EXTENSION}/metadata.json`, instructions: `${EXTENSION}/instructions.md`,
        } },
      };
      validateManifest(manifest);
      const files = new Map([
        ['plugin.json', Buffer.from(json(manifest))],
        [`${EXTENSION}/metadata.json`, Buffer.from(json(metadata))],
        [`${EXTENSION}/instructions.md`, Buffer.from(`${metadata.instructions}\n`)],
      ]);
      for (const { id } of metadata.skills) {
        for (const [file, bytes] of catalog.skills.get(id).files) files.set(`skills/${id}/${file}`, bytes);
      }
      let total = 0;
      const entries = new Set();
      for (const [file, bytes] of files) {
        assert(bytes.length <= MAX_OUTPUT_BYTES, `Generated file exceeds 1 MiB: ${name}/${file}`);
        total += bytes.length;
        const parts = file.split('/');
        assert(parts.length <= 17, `Generated tree is too deep: ${name}`);
        for (let count = 1; count <= parts.length; count++) entries.add(parts.slice(0, count).join('/'));
      }
      assert(total <= 8 * MAX_OUTPUT_BYTES && entries.size <= 2048, `Generated plugin exceeds tree limits: ${name}`);
      artifacts.set(name, files);
    }
  }
  return artifacts;
}

function output(options) {
  const root = path.resolve(options.root ?? DEFAULT_ROOT);
  const out = path.resolve(options.out ?? path.join(root, 'plugins'));
  // Never permit the output root to contain the authored inputs or runtime.
  for (const source of ['', 'agents', 'profiles', 'skills', 'src', 'bin', 'schemas']) {
    const location = path.join(root, source);
    assert(out !== location && !location.startsWith(`${out}${path.sep}`), 'Output would overlap source inputs');
    if (source) assert(!out.startsWith(`${location}${path.sep}`), 'Output must not be inside source inputs');
  }
  return out;
}

async function existing(directory) {
  try { return await readTree(directory); } catch (error) {
    if (error.code === 'ENOENT') return new Map();
    throw error;
  }
}

export async function build(options = {}) {
  const out = output(options);
  const artifacts = await materialize(options);
  await safePath(out, { missing: true });
  // Preflight every destination before writing. Never remove files or directories.
  for (const [name, expected] of artifacts) {
    const directory = contained(out, name);
    const actual = await existing(directory);
    for (const file of actual.keys()) assert(expected.has(file), `Refusing to remove unexpected file: ${name}/${file}; use a fresh --out directory`);
    if (actual.size) {
      assert(actual.has('plugin.json'), `Refusing to overwrite an unowned directory: ${name}`);
      const manifest = JSON.parse(actual.get('plugin.json').toString('utf8'));
      validateManifest(manifest);
      assert(manifest.name === name && manifest.extensions?.[EXTENSION]?.id === JSON.parse(expected.get('plugin.json')).extensions[EXTENSION].id, `Refusing to overwrite an unowned plugin: ${name}`);
    }
  }
  for (const [name, files] of artifacts) {
    for (const [relative, bytes] of files) {
      const file = contained(out, `${name}/${relative}`);
      await safePath(file, { missing: true });
      await mkdir(path.dirname(file), { recursive: true });
      await safePath(file, { missing: true });
      const handle = await open(file, constants.O_WRONLY | constants.O_CREAT | constants.O_NOFOLLOW, 0o644);
      try {
        const stat = await handle.stat();
        assert(stat.isFile() && stat.nlink === 1, `Unsafe output file: ${file}`);
        await handle.truncate(0);
        await handle.writeFile(bytes);
      } finally { await handle.close(); }
    }
  }
  return { protocolVersion: PROTOCOL_VERSION, catalogVersion: VERSION, plugins: [...artifacts.keys()], out };
}

async function inspect(options, drift) {
  const out = output(options);
  const artifacts = await materialize(options);
  for (const [name, expected] of artifacts) {
    const directory = contained(out, name);
    const actual = await readTree(directory);
    assert(canonicalJSON([...actual.keys()].sort()) === canonicalJSON([...expected.keys()].sort()), `Plugin file drift: ${name}`);
    const manifest = JSON.parse(actual.get('plugin.json').toString('utf8'));
    validateManifest(manifest);
    assert(canonicalJSON(manifest) === canonicalJSON(JSON.parse(expected.get('plugin.json'))), `Plugin manifest drift: ${name}`);
    const { digest: recorded, ...metadata } = JSON.parse(actual.get(`${EXTENSION}/metadata.json`).toString('utf8'));
    assert(recorded === digest(metadata), `Invalid metadata digest: ${name}`);
    assert(actual.get(`${EXTENSION}/instructions.md`).toString('utf8') === `${metadata.instructions}\n`, `Instructions mismatch: ${name}`);
    const expectedMetadata = JSON.parse(expected.get(`${EXTENSION}/metadata.json`));
    assert(canonicalJSON(Object.keys(metadata).sort()) === canonicalJSON(Object.keys(expectedMetadata).filter((key) => key !== 'digest').sort()), `Invalid metadata fields: ${name}`);
    assert(metadata.catalogDigest === expectedMetadata.catalogDigest, `Plugin content drift: ${name} (catalogDigest)`);
    for (const key of ['protocolVersion', 'catalogVersion', 'persona', 'profiles', 'profile']) {
      if (Object.hasOwn(expectedMetadata, key)) assert(canonicalJSON(metadata[key]) === canonicalJSON(expectedMetadata[key]), `Invalid metadata ${key}: ${name}`);
    }
    assert(Array.isArray(metadata.skills) && canonicalJSON(metadata.skills.map(({ id }) => id)) === canonicalJSON(expectedMetadata.skills.map(({ id }) => id)), `Invalid skill list: ${name}`);
    for (const skill of metadata.skills) {
      assert(canonicalJSON(Object.keys(skill).sort()) === canonicalJSON(['id', 'instructions']), `Invalid skill fields: ${name}`);
      const packaged = await loadSkill(directory, skill.id);
      assert(packaged.instructions === skill.instructions && metadata.instructions.includes(`# Skill: ${skill.id}\n\n${skill.instructions}`), `Packaged skill mismatch: ${name}/${skill.id}`);
    }
    if (drift) for (const [file, bytes] of expected) assert(bytes.equals(actual.get(file)), `Plugin content drift: ${name}/${file}`);
  }
  return { protocolVersion: PROTOCOL_VERSION, catalogVersion: VERSION, valid: true, plugins: [...artifacts.keys()] };
}

export async function check(options = {}) { return inspect(options, true); }
export async function validate(options = {}) { return inspect(options, false); }
