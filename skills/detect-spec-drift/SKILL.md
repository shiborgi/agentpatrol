---
name: detect-spec-drift
description: Detect differences between implemented behavior and accepted scope.
license: MIT
---

# Detect Spec Drift

## Inputs
Candidate diff, accepted scope, plan when supplied, acceptance criteria, and verification evidence.

## Procedure
1. Walk every supplied criterion and relevant planned change.
2. Compare required behavior with observed candidate behavior and evidence.
3. Identify missing, incorrect, or unsupported extra work with citations.

## Output
Stage-appropriate drift findings by criterion or planned change. CodePatrol executor and host own state, gates, and artifacts.

## Verification
Confirm green checks actually exercise the cited behavior before clearing a criterion.

## Safety
Do not rewrite the candidate or plan, access networks, or perform lifecycle operations.
