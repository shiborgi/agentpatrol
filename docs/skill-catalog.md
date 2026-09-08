# Skill Catalog

AgentPatrol has a validated 34-skill catalog. These skills are resolved, generated,
and published.

## Active Skills

| Source skill | Consumer(s) | Stage coverage |
| --- | --- | --- |
| `clarify-intent` | architect | spec, plan |
| `inventory-ambiguity` | architect | spec, plan |
| `design-change` | architect | spec, plan |
| `write-testable-acceptance` | architect | spec, plan |
| `record-non-goals` | architect | spec, plan |
| `delta-from-current` | architect | plan |
| `map-acceptance` | architect, qa | plan, plan-review, build-review |
| `scope-hotspots` | architect | spec, plan |
| `root-cause-first` | developer | build |
| `minimal-implementation` | developer | build |
| `test-first` | developer | build |
| `implement-change` | developer | build |
| `evidence-based-completion` | developer, release | build, ship |
| `review-change` | qa | spec-review, plan-review, build-review |
| `two-axis-review` | qa | spec-review, plan-review, build-review |
| `check-cross-artifact` | qa | spec-review, plan-review, build-review |
| `detect-spec-drift` | qa | build-review |
| `name-verification` | qa | plan-review, build-review |
| `strip-over-engineering` | qa | plan-review, build-review |
| `prepare-release` | release | ship |
| `verify-evidence` | all personas and profiles | spec, plan, spec-review, plan-review, build, build-review, ship |
| `react-development` | react, nextjs | build, build-review |
| `nextjs-app-router` | nextjs | build, build-review |
| `write-observable-interaction` | react, nextjs | spec, plan, build, build-review |
| `frontend-a11y-check` | react, nextjs | build, build-review |
| `responsive-interaction` | react, nextjs | plan, build, build-review |
| `preserve-access-paths` | react, nextjs | build, build-review |
| `detect-interaction-drift` | react, nextjs | build-review |
| `visual-regression-evidence` | react, nextjs | build, build-review |
| `web-vitals-budget` | nextjs | plan, build-review |
| `python-development` | python | build, build-review |
| `mcp-development` | mcp | build, build-review |
| `hono-service` | service | build, build-review |
| `bun-workspace` | service | plan, build |

## Stage Coverage

| CodePatrol stage | Active coverage |
| --- | --- |
| `spec` | architect, `verify-evidence`, interaction requirements when React or Next.js is selected |
| `plan` | architect, `verify-evidence`, relevant profile planning guidance |
| `spec-review` | qa, `verify-evidence` |
| `plan-review` | qa, `verify-evidence` |
| `build` | developer, `verify-evidence`, selected profile guidance |
| `build-review` | qa, `verify-evidence`, selected profile guidance |
| `ship` | release, `evidence-based-completion`, `verify-evidence` |
