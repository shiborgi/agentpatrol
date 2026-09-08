---
name: scope-hotspots
description: Focus analysis on the smallest repository areas relevant to the change.
license: MIT
---

# Scope Hotspots

## Inputs
Task request, supplied repository context, named paths, and read-only history when supplied.

## Procedure
1. Prefer explicitly named areas.
2. Identify a small set of relevant paths from current flow and change evidence.
3. State why each area matters and what remains outside scope.

## Output
Stage-appropriate investigation guidance with ordered hotspots and exclusions. CodePatrol executor and host own state, gates, and artifacts.

## Verification
Confirm each hotspot has a task-grounded rationale and no broad scan is presented as required.

## Safety
Use only authorized read-only inspection. Do not mutate files, access networks, or perform lifecycle operations.
