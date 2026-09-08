# Architecture

## Ownership

AgentPatrol owns authoring, composition and portable skill packaging. ContextPatrol
owns read-only context snapshots. CodePatrol owns routing, execution, durable state,
review gates, telemetry and release authorization. Communication uses Patrol 1.0
JSON messages via explicit argv providers, never sibling source imports.

## Modules

| Module | Responsibility |
| --- | --- |
| `src/core.mjs` | Version constants, canonical JSON, digest, bounded and contained filesystem reads |
| `src/catalog.mjs` | Explicit catalog loading, descriptor/stage/skill validation and complete content fingerprint |
| `src/skills.mjs` | Shared skill contract, asset tree and local reference validation |
| `src/resolve.mjs` | Closed requests, deterministic composition and response digest |
| `src/plugins.mjs` | Pure materialization followed by build, drift check or integrity validation |
| `src/cli.mjs` | Strict options, bounded JSON transport and command dispatch |
| `src/index.mjs` | Supported library exports |

There are no runtime dependencies or dynamically executed plugins. Catalog loading
does not scan `agents/` or `profiles/`; only explicit IDs are read. The npm allowlist
also excludes unselected personas and specialist outputs outside the catalog. Each
skill is loaded once per invocation and shared by reference during composition.

## Determinism

Persona descriptors and profiles are presented in ID order in the catalog. A
resolution uses the selected persona, sorted unique profile IDs, then skill IDs in
first-reference order across those descriptors. Duplicate selected profiles are
normalized; duplicate references inside authored descriptors fail. Unknown profiles
fail. No profile is implicit in a resolution.

Instructions use stable persona/profile/skill headings and trimmed UTF-8 source
text. A response includes all composed instructions and each selected skill's
instructions. The digest is SHA-256 of every response field except `digest`, including
the required `catalogDigest`, using
recursively key-sorted compact JSON. Arrays preserve order. No filesystem paths,
timestamps, platform-specific separators or execution evidence enter the payload.
Skill auxiliary assets are copied byte-for-byte into plugins. Their bytes are not
embedded in protocol responses, but are covered by `catalogDigest` and therefore
by the resolved response digest. `check` covers the entire generated tree.

`loadCatalog` computes `contentDigest` once with a single content fingerprint helper
over its in-memory snapshot. The canonical representation contains `catalogVersion`,
ID-sorted persona/profile arrays with parsed descriptors and complete untrimmed
instruction text, and a skill-ID-keyed object of relative file paths to base64 raw
bytes. All object keys, including file keys, are recursively sorted. All active
skills and assets participate, not only those selected for a particular resolution.
Descriptor JSON formatting and catalog ID-list ordering are normalized; source
instruction text and skill file bytes are not trimmed for fingerprinting.

`getCatalog` exposes that value as required `contentDigest`; `compose` reuses the
same loaded value as required `catalogDigest`, without another filesystem read.
This makes same-version instruction or asset changes invalidate host learning.
Loading multiple files is not a filesystem transaction, and separate invocations
can observe different snapshots. Consumers compare returned catalog identities;
operators must not mutate source files concurrently with a load or build.

## Packaging

The builder materializes four persona packs with the general profile, and six
orthogonal `profile-<id>` packs. These are not all persona/profile combinations:
arbitrary composition is the resolver's job. Every pack contains its selected
skills and their assets; no source-checkout symlinks or cross-plugin dependencies.

The external Agent Plugins 1.0.0 manifest is closed. Portable skills live at fixed
`skills/<id>/SKILL.md` paths. The manifest's `extensions.io.shiborgi.agentpatrol`
points to matching extension-directory metadata and composed instructions.
Persona metadata is the exact resolved response. Profile metadata uses `profile`
instead of `persona`/`profiles` and is a local extension format, not a protocol
resolve response. Both include `catalogDigest` and complete metadata digests.
Validation requires their catalog identity to match the loaded source snapshot.
Other clients can ignore
these extensions; AgentPatrol makes no portable-agent or MCP-execution claim.

Builds preflight every target, reject unknown files inside managed targets and
never remove files. They update recognized expected files, leaving unrelated sibling
directories alone. No tracking scan or Git state is used at runtime. Multi-file
writes are not atomic; use separate fresh destinations for distribution and do not
run concurrent writers. Artifacts outside the selected catalog require explicit,
reviewed removal.

`validate` checks authored contracts and generated manifest/extension/skill integrity.
`check` additionally compares every expected file's bytes, catching formatting and
source drift. Unknown sibling packs are outside the active catalog. No test or npm
packing hook regenerates the working tree. `verify` checks drift before tests;
`release-check` checks drift before packing and smoke-tests an offline installation.
