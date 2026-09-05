# Patrol Protocol 1.0: Agent Provider

This document defines AgentPatrol's contract for Patrol protocol 1.0. Packages are
independently distributable Node.js 22+ tools. Providers are explicit argv arrays
executed without a shell. One invocation reads one JSON object from stdin and writes
one JSON object to stdout; diagnostics use stderr and failures exit nonzero.
Consumers reject protocol versions other than `1.0` and bound time and bytes.

## Catalog

Command: `agentpatrol catalog`. Exact request:

```json
{"protocolVersion":"1.0"}
```

Response shape (abbreviated catalog, illustrative `contentDigest`):

```json
{
  "protocolVersion": "1.0",
  "catalogVersion": "1.0.0",
  "contentDigest": "0000000000000000000000000000000000000000000000000000000000000000",
  "personas": [{
    "id": "developer",
    "description": "Implement and verify changes",
    "stages": ["build"],
    "skills": ["implement-change", "verify-evidence"]
  }],
  "profiles": [{
    "id": "react",
    "description": "React applications, accessible interactions and rendering boundaries",
    "signals": ["react", "tsx", "jsx"],
    "skills": ["react-development", "verify-evidence"]
  }]
}
```

The complete catalog includes architect (`spec`, `plan`), developer (`build`), qa
(`spec-review`, `plan-review`, `build-review`) and release (`ship`). Required profiles
are general, react, python and mcp; nextjs and service are also shipped. IDs and
skill references are unique within their catalogs/descriptors and validated.
Profiles are orthogonal to personas and can be combined. Catalog responses require
`contentDigest`, a lowercase SHA-256 hex fingerprint of the complete active catalog,
not merely the public descriptor lists. They expose no instruction text or local
paths. The real fingerprint is computed from the full catalog, not this abbreviated
example.

The fingerprint is `digest({catalogVersion, personas, profiles, skills})` using
recursively key-sorted compact JSON encoded as UTF-8. Persona and profile arrays
are sorted by ID; each entry contains its parsed descriptor fields plus its complete
untrimmed UTF-8 `instructions` text. `skills` is an object keyed by each referenced
skill ID; its value is an object mapping every relative file path in that skill
tree to its raw bytes encoded as base64. Recursive sorting orders all skill and
file keys; descriptor arrays retain their declared order. This includes `SKILL.md`,
references, scripts and binary assets, even for active skills not selected by a
particular resolution. Unlisted authoring and generated outputs are excluded.
JSON descriptor formatting and catalog ID-list order are not content changes.

Compute the fingerprint once from the validated, loaded catalog snapshot. Do not
reread sources separately to compute resolution identity. Consumers can partition
learning by `contentDigest` so instruction and asset changes invalidate observations
even when `catalogVersion`, persona IDs and profile IDs remain unchanged.

## Resolve

Command: `agentpatrol resolve`. Exact request:

```json
{"protocolVersion":"1.0","persona":"developer","profiles":["react"]}
```

All three fields are required. `profiles: []` is valid. Repeated profiles are
normalized. Unknown fields, personas, profiles and wrong versions fail nonzero.

Response fields are exactly:

- `protocolVersion`: `1.0`.
- `catalogVersion`: `1.0.0`.
- `catalogDigest`: the loaded catalog snapshot's `contentDigest`, lowercase SHA-256 hex.
- `persona`: selected persona ID.
- `profiles`: sorted unique selected profile IDs.
- `skills`: ordered objects containing exactly `id` and `instructions`.
- `instructions`: composed text.
- `digest`: lowercase SHA-256 hex, without a prefix.

Composition is persona, sorted unique profiles, then deduplicated skills. Skills
retain first-reference order from persona then profiles. Digest covers the entire
resolved payload, including `catalogDigest`, except the digest field, using
recursively key-sorted JSON, UTF-8 and no whitespace. Arrays retain order; no clocks,
paths or environment state are included. `canonicalJSON` and `digest` expose the
same algorithm to consumers. Separate catalog and resolve invocations may observe
different source states if authoring changes between them; consumers must compare
these identities rather than assume a stable version string implies unchanged
content.

## Portable Format

Portable artifacts conform to the separate Agent Plugins **1.0.0** specification:
root `plugin.json`, `skills/*/SKILL.md`, and optional `mcp.json` in that external
format. AgentPatrol does not generate MCP configuration. Persona/profile metadata
belongs under `extensions.io.shiborgi.agentpatrol` and its matching extension
directory, never extra manifest fields. This is a skills publisher and resolver,
not an MCP execution client. A skill about MCP development does not launch a server
or grant permissions. The AgentPatrol package and generated plugin version is
`1.0.0`; the Agent Plugins specification version is an independent version domain.

## Provider Configuration

```json
{
  "protocolVersion": "1.0",
  "providers": {
    "agents": {
      "catalog": ["agentpatrol", "catalog"],
      "resolve": ["agentpatrol", "resolve"]
    },
    "context": ["contextpatrol", "query"]
  }
}
```

These commands resolve through PATH and require no absolute checkout paths. No
implicit arguments are appended. CodePatrol supplies task state, context routing,
an explicitly configured executor and verification. It owns stage advancement;
release requires separate explicit human approval. AgentPatrol never invents
execution, approval, token, cost or deployment evidence.
