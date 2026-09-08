---
name: name-verification
description: Specify reproducible checks and expected evidence for each criterion.
license: MIT
---

# Name Verification

## Inputs
Supplied acceptance criteria, repository check conventions, and available test surfaces.

## Procedure
1. Select the smallest real repository checks that exercise each criterion.
2. State exact commands, working context, and expected observable evidence.
3. Flag criteria with no feasible verification rather than using placeholders.

## Output
Stage-appropriate verification guidance and per-criterion evidence expectations. CodePatrol executor and host own state, gates, and artifacts.

## Verification
Confirm commands are concrete and each criterion has a stated observable result.

## Safety
Do not invent commands, run unauthorized checks, access networks, or perform lifecycle operations.
