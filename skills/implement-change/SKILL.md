---
name: implement-change
description: Implement the smallest correct change with reproducible verification.
license: Apache-2.0
---

# Implement Change

## Inputs
Approved scope, acceptance criteria, host-provided workspace, relevant code and
the repository's documented build and test commands.

## Procedure
1. Inspect surrounding code and current changes; preserve unrelated work.
2. Reproduce a defect or add a focused test for the requested behavior.
3. Confirm a new regression test fails for the intended reason when feasible.
4. Implement the smallest change that satisfies the contract and existing style.
5. Run focused checks, then the relevant broader suite; inspect the final diff.

## Output
Changed paths, behavior summary, actual command outcomes and remaining risks.
Explain any test-first exception without deleting preexisting implementation.

## Verification
Confirm acceptance coverage, error paths and regression checks. Record commands,
exit codes and accessible evidence; a proposed test is not a successful test.

## Safety
Work only within the authorized scope. Never discard unrelated changes, install
dependencies, run destructive commands or expose credentials without authority.
Do not self-approve, mutate workflow gates, commit, push, publish or deploy unless
separately and explicitly authorized by the host and operator.
