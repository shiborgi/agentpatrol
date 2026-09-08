---
name: detect-interaction-drift
description: Detect differences between accepted interaction behavior and the candidate.
license: MIT
---

# Detect Interaction Drift

## Inputs
Accepted interaction requirements, candidate UI behavior, diff, and supplied evidence.

## Procedure
1. Compare each required stimulus and outcome with the candidate.
2. Check visual, accessible, and responsive outcomes where required.
3. Cite missing, changed, or extra interaction behavior without treating style as drift.

## Output
Stage-appropriate interaction-drift findings and evidence gaps. CodePatrol executor and host own state, gates, and artifacts.

## Verification
Confirm each finding references an accepted interaction requirement and observed candidate behavior.

## Safety
Do not modify the candidate, access networks, or perform lifecycle operations.
