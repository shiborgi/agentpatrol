---
name: preserve-access-paths
description: Protect existing reachable paths to changed user behavior.
license: MIT
---

# Preserve Access Paths

## Inputs
Changed behavior, known existing access paths, candidate behavior, and authorized checks.

## Procedure
1. Enumerate relevant pointer, keyboard, route, deep-link, and assistive-technology paths.
2. Compare reachability before and after the proposed change.
3. Identify lost paths and required replacement paths when behavior intentionally changes.

## Output
Stage-appropriate access-path guidance, findings, and evidence. CodePatrol executor and host own state, gates, and artifacts.

## Verification
Confirm each enumerated path reaches the required behavior through an observed check.

## Safety
Do not widen scope, mutate files, access networks, or perform lifecycle operations.
