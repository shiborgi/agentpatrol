---
name: pack-context
description: Use ContextPatrol info/query standalone, or the host context snapshot when supplied.
license: Apache-2.0
---

# pack-context

## Purpose

Use ContextPatrol as a standalone companion when the host has not already
provided context. If a host task includes `contextSnapshot`, treat it as the
authoritative context and do not call ContextPatrol or another context provider.

## When to use

Use this skill when the operator needs repository context and no host snapshot
is available. Prefer the stage-typed recipe the workspace configured for the
current step; fall back to the matching default below when the workspace has
no named default:

- `spec` — `spec-survey` (`structure`, `symbols`, `source` at `signatures`).
- `spec-review` — `spec-deep` (`structure`, `symbols`, `relations`).
- `plan` — `plan-deep` (`changes`, `symbols`, `relations`, `source`, `tests`).
- `plan-review` — `review-diff` (`changes`, `symbols`, `relations`, `tests`).
- `build-review` — `review-grounded` (`changes`, `symbols`, `relations`, `source`,
  `tests`), with the candidate worktree as workspace and the build `baseCommit`
  as baseline.
- `ship` — `readiness` (`changes`, `tests`, `relations`).

The skill is loaded only by the full review and architect roles (never the
`*-lean` or build/ship producers).

## Inputs

- The current workspace root.
- For `query`: an explicit query or recipe input.
- The configured companion argv, defaulting to `["contextpatrol"]`.

## Output

The companion output from `info` or `query`, reported without inventing fields
or translating it into a lifecycle request. If a host supplied `contextSnapshot`,
use and cite that snapshot instead.

## Rules

- Resolve the companion argv from workspace configuration when present; fall
  back to ["contextpatrol"].
- Run `contextpatrol info` first. Use its `query.argv`, `requestSchema`, and
  `reportSchema`; do not infer a different command form.
- A standalone query must contain only the published neutral fields:
  `schemaVersion`, `workspace`, `query`, `facets`, `maxOutputBytes`, `target`,
  plus optional `baseline`, `includePaths`, and `excludePaths`.
- When the workspace names a recipe, copy that recipe's `facets`,
  `maxOutputBytes`, and any `sourceDepth` or `ranking` into the query. Do not
  invent a different facet set.
- Run `contextpatrol query --input -` with a JSON request and preserve its
  canonical output faithfully. `maxOutputBytes` is an output-byte budget, not a
  model token budget.
- If `contextpatrol` is unavailable or fails, state that no ContextPatrol
  context could be obtained. Do not substitute a provider or fabricate a
  context snapshot.
- Host task contracts and a supplied `contextSnapshot` always prevail over this
  skill.
- Never run a lifecycle operation.
- Self-contained and in English; no external references.
