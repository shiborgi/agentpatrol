# Repository Guidance

- AgentPatrol owns personas, profiles, reusable skills and portable plugins.
  It does not own task state, context collection, model execution or release gates.
- Use dependency-free JavaScript ESM and Node.js 22+. Runtime lives in `src/`;
  the CLI entry point is `bin/agentpatrol.js`.
- `catalog.json` explicitly lists active persona and profile IDs. Never discover
  authoring by scanning all of `agents/` or silently load undeclared directories.
- Author personas in `agents/<id>/{persona.json,instructions.md}`, profiles in
  `profiles/<id>/{profile.json,instructions.md}`, and shared skills in `skills/`.
- Follow `docs/protocol.md` exactly. Patrol protocol 1.0 is the public contract.
- Only the builder creates portable artifacts in `plugins/`. External manifests
  conform to the separate Agent Plugins 1.0.0 specification. Persona/profile
  metadata and instructions belong in `io.shiborgi.agentpatrol`, not portable
  agents or extra manifest fields.
- Never remove unknown output files or overwrite unrelated authoring. In particular,
  preserve preexisting `nextjs-engineer` and `service-engineer` directories under
  both `agents/` and `plugins/`; they are not active catalog entries.
- Use temporary fixtures for all writing tests. Drift checks run before tests;
  never make tests repair the repository's generated artifacts.
- Keep npm's explicit package allowlist aligned with the active catalog. Update
  lockfiles with npm. Do not add OpenCode configuration or an MCP launcher.
- Run `npm run verify` and `npm run release-check` before distribution. Do not
  commit, push, publish or deploy without explicit operator authorization.
