---
name: review-change
description: Review stage deliverables against acceptance and independently checked evidence.
license: Apache-2.0
---

# Review Change

## Inputs
Active review stage, candidate deliverable, acceptance criteria, supplied context,
verification evidence and the host's result contract.

## Procedure
1. Check scope, clarity and testability at spec-review.
2. Check criterion coverage, dependencies and realistic verification at plan-review.
3. At build-review, inspect code and tests for correctness, security and regressions.
4. Reproduce material findings with authorized checks where feasible.
5. Distinguish defects, evidence gaps and optional suggestions; apply host criteria.

## Output
Findings ordered by severity with reachable path references, impact and suggested
remediation. Include evidence gaps and an explicit approved boolean when required
by the host contract. Do not invent a scoring rubric or aggregate ranking.

## Verification
Recheck each finding against actual code or documents. Confirm that an approval
is supported by required evidence, not merely the candidate author's claims.

## Safety
Do not modify the candidate, approve your own work or bypass host gates. Missing
or inaccessible evidence is unknown, not passing. Do not execute repository code
unless the host has authorized the command and workspace.
