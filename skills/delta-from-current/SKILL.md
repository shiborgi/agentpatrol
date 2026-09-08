---
name: delta-from-current
description: Separate current behavior from the smallest requested change.
license: MIT
---

# Delta From Current

## Inputs
Requested outcomes, relevant repository context, and existing behavior evidence.

## Procedure
1. Trace the relevant current flow before proposing changes.
2. List behavior and paths that must remain unchanged.
3. Identify only additions, removals, or changes required by acceptance.

## Output
Stage-appropriate current-state and delta guidance with affected paths and reuse opportunities. CodePatrol executor and host own state, gates, and artifacts.

## Verification
Confirm each delta is required and every unchanged claim is supported by inspected context.

## Safety
Do not rewrite working behavior, mutate files, access networks, or perform lifecycle operations.
