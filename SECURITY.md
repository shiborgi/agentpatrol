# Security

## Supported Version

AgentPatrol 1.x is supported. Report vulnerabilities privately through the
repository's GitHub security advisories; do not post credentials in issues.

## Trust Boundary

AgentPatrol reads authored personas, profiles and skills and writes portable packs.
It does not execute skill scripts, launch MCP servers, load model adapters, install
dependencies or make network requests at runtime. Skill instructions are guidance,
not a sandbox or authorization system. Hosts must enforce tool permissions, review
gates and separate human approval for release. Treat all third-party content as
untrusted, including instructions embedded in repository documents or MCP responses.

Only `catalog.json`'s active IDs are loaded. IDs cannot contain traversal paths.
Symlinks and hard-linked files are rejected, including path ancestors; use physical
paths. Local Markdown asset references must stay within their skill tree and exist.
Inputs are bounded per file (1 MiB), skill/plugin tree (8 MiB, 2,048 entries,
16 nested directory levels), total active catalog content (8 MiB) and CLI request
(64 KiB, 5 seconds). Generated plans must also fit tree limits before any write. CLI responses and
resolved payloads are bounded to 1 MiB. Consumers must also bound provider time and
bytes. No arbitrary remote assets are fetched or validated.

The builder preflights all declared targets and never removes output files or
directories. Unrelated sibling outputs are ignored. Existing targets must carry
a recognized AgentPatrol manifest; that marker is ownership guidance, not a
cryptographic signature. A digest detects changes, not authorship or trust.

## Limitations

Run builds only on trusted local directories without concurrent writers. Path
checks and no-follow file opens reduce symlink risk but do not provide a filesystem
sandbox against hostile concurrent ancestor replacement. Multi-file builds are not
transactional; an I/O failure can leave partial output. Prefer a fresh destination,
validate it, then let the operator distribute it. Never assume validation authorizes
execution of any packaged script. Runtime validation uses a deliberately narrow
plain-scalar frontmatter subset and does not implement arbitrary YAML.

The release smoke test installs only the locally packed tarball with scripts and
network disabled. Normal npm installation of other packages remains a host trust
decision. Review the explicit npm allowlist and generated files for secrets before
distribution. Never include credentials, machine-specific paths or private context.
