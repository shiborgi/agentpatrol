# Contributing

Use Node.js 22+ and npm. There are no third-party runtime dependencies. Read
[repository guidance](AGENTS.md), [architecture](docs/architecture.md) and the
[protocol](docs/protocol.md) before changing a contract.

## Authoring

`catalog.json` is the explicit active catalog. Personas represent lifecycle duties;
profiles represent stack expertise. Do not create a persona for each stack or add
undeclared contract aliases. Add IDs explicitly and keep stages and signal tags
meaningful.

Author role instructions in `agents/<id>/instructions.md` and profile instructions
in `profiles/<id>/instructions.md`. Descriptors contain only ID, description,
stages/signals and ordered skill IDs. Skills have one shared source in
`skills/<id>/SKILL.md`, with plain-scalar `name`, `description` and optional `license`
frontmatter, followed by nonempty Inputs, Procedure, Output, Verification and
Safety sections. Local Markdown references must resolve within the skill tree.
Do not depend on another skill implicitly; select it explicitly or make the skill
self-contained. Implementation techniques must respect the active persona's stage.

Catalog `contentDigest` fingerprints the complete active content, including all
skill asset bytes. Resolution reuses it as `catalogDigest` from the same loaded
snapshot; never calculate identity through a separate filesystem load. Tests must
prove instruction and asset edits invalidate identity without a version or ID change.

Retained, unselected shared skills are authoring material, not part of the active
distribution. Normalize and validate their contract before selecting them. The
`nextjs-engineer` and `service-engineer` authoring and plugin directories express
specialist intent but are intentionally excluded from the active catalog; do not
edit them as part of catalog work.

## Generated Artifacts

Run `npm run build` after intentional source changes. Only the builder writes
`plugins/`. Review generated diffs along with source changes. It never deletes
output files; if a removed skill leaves stale files, use a fresh `--out` directory
and explicitly review any tracked file removals. Never delete untracked output.
Builds are preflighted but not a transactional multi-file update; do not run
concurrent writers. Run `check` after an interrupted build.

Update `package.json`'s explicit allowlist for active skills, personas and plugin
packs. Profiles, runtime and catalog are included. Regenerate the lockfile with
`npm install --package-lock-only --ignore-scripts`. Do not hand-edit generated
lockfiles or add an implicit prepack build that could hide drift.

## Verification

```sh
npm ci
npm run verify
npm run release-check
```

`verify` checks generated drift, validates sources/artifacts, then runs tests.
Build and mutation tests use isolated temporary copies, never repository outputs.
`release-check` first checks drift, then packs, installs offline into a temporary
consumer and exercises the installed CLI, library and builder. Keep this order.

Include focused tests for protocol rejection, composition/digest behavior,
containment and symlink defenses, packaging and failure exits. Report limitations
honestly. This repository never implicitly commits, publishes or deploys.
