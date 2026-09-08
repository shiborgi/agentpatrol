---
name: test-first
description: Use focused failing checks to establish changed behavior before implementation.
license: MIT
---

# Test First

## Inputs
Changed behavior, existing test conventions, and authorized repository checks.

## Procedure
1. Define one focused check for each changed behavior.
2. When feasible, observe the check fail for the intended missing behavior.
3. Make the smallest change to pass, then run relevant regression checks.

## Output
Stage-appropriate test strategy or evidence showing focused and broader check outcomes. CodePatrol executor and host own state, gates, and artifacts.

## Verification
Record actual commands, exit status, and any justified exception to a failing-first observation.

## Safety
Do not delete preexisting work to recreate a red state, access networks, or perform lifecycle operations.
