---
name: root-cause-first
description: Establish the cause of a failure before proposing a minimal fix.
license: MIT
---

# Root Cause First

## Inputs
Failure symptoms, command output, relevant code, and recent change evidence.

## Procedure
1. Reproduce the failure and read the complete diagnostic output.
2. Trace the failing boundary and compare relevant working behavior.
3. Test one evidence-backed hypothesis at a time before selecting a fix.

## Output
Stage-appropriate diagnosis, reproduction evidence, and minimal fix guidance. CodePatrol executor and host own state, gates, and artifacts.

## Verification
Confirm the proposed fix addresses the reproduced cause and the failure no longer occurs.

## Safety
Do not stack speculative fixes, add diagnostic leakage, access networks, or perform lifecycle operations.
