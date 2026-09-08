---
name: frontend-a11y-check
description: Check changed interactions for keyboard, focus, naming, and visual accessibility.
license: MIT
---

# Frontend Accessibility Check

## Inputs
Changed UI surfaces, existing semantics, applicable accessibility requirements, and authorized checks.

## Procedure
1. Inspect keyboard operation, focus movement, accessible names, errors, and status feedback.
2. Prefer native controls and check custom semantics only where necessary.
3. Assess contrast and non-color cues for changed visual states.

## Output
Stage-appropriate accessibility findings or evidence per changed surface. CodePatrol executor and host own state, gates, and artifacts.

## Verification
Record accessible checks and actual outcomes; distinguish automated coverage from manual interaction coverage.

## Safety
Do not treat an automated scan as complete proof, mutate files, access networks, or perform lifecycle operations.
