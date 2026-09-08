---
name: strip-over-engineering
description: Identify unsupported complexity that can be removed without losing required behavior.
license: MIT
---

# Strip Over-Engineering

## Inputs
Candidate diff or plan, requested behavior, and existing repository capabilities.

## Procedure
1. Identify speculative abstractions, duplicate paths, reinventions, and unused flexibility.
2. Test each concern against a concrete required behavior.
3. Recommend only removals that preserve required validation, security, and accessibility.

## Output
Stage-appropriate delete-list guidance with task-grounded rationale. CodePatrol executor and host own state, gates, and artifacts.

## Verification
Confirm each proposed removal is unnecessary for supplied acceptance and is not merely unfamiliar style.

## Safety
Do not rewrite unrelated code, mutate files, access networks, or perform lifecycle operations.
