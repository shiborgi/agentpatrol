import { assert, digest, ids, MAX_OUTPUT_BYTES, object, PROTOCOL_VERSION } from './core.mjs';
import { loadCatalog } from './catalog.mjs';

export function validateRequest(request) {
  object(request, ['protocolVersion', 'persona', 'profiles'], 'resolve request');
  assert(request.protocolVersion === PROTOCOL_VERSION, `protocolVersion must be ${PROTOCOL_VERSION}`);
  ids([request.persona], 'persona');
  ids(request.profiles, 'profiles', { unique: false });
}

export function compose(catalog, request) {
  validateRequest(request);
  const persona = catalog.personas.find(({ id }) => id === request.persona);
  assert(persona, `Unknown persona: ${request.persona}`);
  const profiles = [...new Set(request.profiles)].sort().map((id) => {
    const profile = catalog.profiles.find((item) => item.id === id);
    assert(profile, `Unknown profile: ${id}`);
    return profile;
  });
  const skillIds = [...new Set([persona, ...profiles].flatMap((item) => item.skills))];
  const skills = skillIds.map((id) => ({ id, instructions: catalog.skills.get(id).instructions }));
  const instructions = [
    `# Persona: ${persona.id}\n\n${persona.instructions.trim()}`,
    ...profiles.map((profile) => `# Profile: ${profile.id}\n\n${profile.instructions.trim()}`),
    ...skills.map((skill) => `# Skill: ${skill.id}\n\n${skill.instructions}`),
  ].join('\n\n');
  const payload = {
    protocolVersion: PROTOCOL_VERSION, catalogVersion: catalog.catalogVersion, catalogDigest: catalog.contentDigest,
    persona: persona.id, profiles: profiles.map(({ id }) => id), skills, instructions,
  };
  const result = { ...payload, digest: digest(payload) };
  assert(Buffer.byteLength(JSON.stringify(result)) <= MAX_OUTPUT_BYTES, 'Resolved output exceeds 1 MiB');
  return result;
}

export async function resolve(request, options = {}) {
  validateRequest(request);
  return compose(await loadCatalog(options), request);
}
