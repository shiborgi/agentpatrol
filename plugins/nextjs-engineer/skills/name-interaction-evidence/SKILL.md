---
name: name-interaction-evidence
description: Record named evidence for each interaction claim.
license: Apache-2.0
---

# name-interaction-evidence

## Purpose

Attach a named, reproducible source to every interaction claim so reviewers
can re-run the check. An unnamed claim cannot be verified; this skill
disciplines when a claim may be recorded as evidence during planning,
review, and ship.

## When to use

Use this skill whenever an interaction claim needs support:

- `plan`, when a planned interaction outcome needs a verifiable basis.
- `plan-review`, when judging whether an interaction plan is grounded.
- `ship`, when confirming an interaction satisfies its acceptance.

## Inputs

- The interaction claim being recorded.
- The command or observation that would produce the evidence.

## Output

A named evidence entry for the interaction claim: the claim, the source name,
and the exact way to reproduce it.

## Rules

- Name the evidence source explicitly; do not rely on unlabelled output.
- Tie each evidence entry to one claim and one reproducible check.
- State the lifecycle stage the evidence supports.
- Keep one concern per entry; do not overload a single source with multiple
  unrelated claims.
- Only record evidence that an operator could watch fail or pass.
- Self-contained and in English; no external references.
