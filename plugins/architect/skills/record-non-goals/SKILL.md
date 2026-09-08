---
name: record-non-goals
description: Make excluded work and binding constraints explicit.
license: MIT
---

# Record Non-Goals

## Inputs
Requested outcomes, repository constraints, and known adjacent work.

## Procedure
1. Identify plausible work not required by the request.
2. Separate exclusions from constraints that the change must respect.
3. Mark assumptions and hard-to-reverse constraints distinctly.

## Output
Stage-appropriate non-goal and constraint guidance. CodePatrol executor and host own state, gates, and artifacts.

## Verification
Confirm each exclusion is concrete and each constraint is grounded in supplied evidence.

## Safety
Do not broaden scope, mutate files, access networks, or perform lifecycle operations.
