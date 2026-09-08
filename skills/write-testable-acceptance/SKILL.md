---
name: write-testable-acceptance
description: Express requested behavior as observable pass or fail criteria.
license: MIT
---

# Write Testable Acceptance

## Inputs
Refined intent, behavior boundaries, known failure paths, and supplied acceptance conventions.

## Procedure
1. Split requested behavior into independent criteria.
2. State condition, action, and observable result for each criterion.
3. Include relevant refusal, error, and unchanged paths without prescribing implementation.

## Output
Stage-appropriate acceptance guidance with observable criteria and proposed evidence. CodePatrol executor and host own state, gates, and artifacts.

## Verification
Check every criterion has one behavior, a visible result, and a feasible check.

## Safety
Do not assign host identifiers, mutate files, access networks, or perform lifecycle operations.
