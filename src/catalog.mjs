import path from 'node:path';
import { assert, DEFAULT_ROOT, digest, ids, MAX_OUTPUT_BYTES, object, PROTOCOL_VERSION, readJSON, readText, text, VERSION } from './core.mjs';
import { loadSkill } from './skills.mjs';

const REQUIRED_STAGES = {
  architect: ['spec', 'plan'], developer: ['build'],
  qa: ['spec-review', 'plan-review', 'build-review'], release: ['ship'],
};

function contentFingerprint({ catalogVersion, personas, profiles, skills }) {
  // Hash the loaded snapshot only; canonical JSON sorts skill IDs and file keys.
  return digest({
    catalogVersion, personas, profiles,
    skills: Object.fromEntries([...skills].map(([id, { files }]) => [
      id, Object.fromEntries([...files].map(([file, bytes]) => [file, bytes.toString('base64')])),
    ])),
  });
}

export async function loadCatalog({ root = DEFAULT_ROOT } = {}) {
  root = path.resolve(root);
  const index = await readJSON(path.join(root, 'catalog.json'));
  object(index, ['catalogVersion', 'personas', 'profiles'], 'catalog');
  assert(index.catalogVersion === VERSION, `catalogVersion must be ${VERSION}`);
  ids(index.personas, 'catalog.personas');
  ids(index.profiles, 'catalog.profiles');
  for (const id of Object.keys(REQUIRED_STAGES)) assert(index.personas.includes(id), `Missing required persona: ${id}`);
  for (const id of ['general', 'react', 'python', 'mcp']) assert(index.profiles.includes(id), `Missing required profile: ${id}`);
  const catalog = { catalogVersion: index.catalogVersion, personas: [], profiles: [], skills: new Map() };
  let bytes = 0;
  for (const kind of ['personas', 'profiles']) {
    for (const id of [...index[kind]].sort()) {
      const directory = path.join(root, kind === 'personas' ? 'agents' : 'profiles', id);
      const descriptor = await readJSON(path.join(directory, `${kind === 'personas' ? 'persona' : 'profile'}.json`));
      const tags = kind === 'personas' ? 'stages' : 'signals';
      object(descriptor, ['id', 'description', tags, 'skills'], `${kind}/${id}`);
      assert(descriptor.id === id, `Descriptor ID mismatch: ${id}`);
      text(descriptor.description, `${id}.description`);
      ids(descriptor[tags], `${id}.${tags}`);
      ids(descriptor.skills, `${id}.skills`);
      assert(descriptor.skills.length > 0, `${id} must reference skills`);
      if (kind === 'personas') {
        const stages = Object.values(REQUIRED_STAGES).flat();
        assert(descriptor.stages.length && descriptor.stages.every((stage) => stages.includes(stage)), `Invalid stages: ${id}`);
        for (const stage of REQUIRED_STAGES[id] ?? []) assert(descriptor.stages.includes(stage), `Missing stage ${stage}: ${id}`);
      }
      const instructions = await readText(path.join(directory, 'instructions.md'));
      text(instructions, `${id}.instructions`);
      bytes += Buffer.byteLength(JSON.stringify(descriptor)) + Buffer.byteLength(instructions);
      catalog[kind].push({ ...descriptor, instructions });
      for (const skill of descriptor.skills) {
        if (!catalog.skills.has(skill)) {
          const loaded = await loadSkill(root, skill);
          bytes += [...loaded.files.values()].reduce((sum, content) => sum + content.length, 0);
          catalog.skills.set(skill, loaded);
        }
        assert(bytes <= 8 * MAX_OUTPUT_BYTES, 'Active catalog content exceeds 8 MiB');
      }
    }
  }
  catalog.contentDigest = contentFingerprint(catalog);
  return catalog;
}

export async function getCatalog(options = {}) {
  const catalog = await loadCatalog(options);
  const describe = ({ instructions, ...descriptor }) => descriptor;
  const response = {
    protocolVersion: PROTOCOL_VERSION, catalogVersion: catalog.catalogVersion, contentDigest: catalog.contentDigest,
    personas: catalog.personas.map(describe), profiles: catalog.profiles.map(describe),
  };
  assert(Buffer.byteLength(JSON.stringify(response)) <= MAX_OUTPUT_BYTES, 'Catalog output exceeds 1 MiB');
  return response;
}
