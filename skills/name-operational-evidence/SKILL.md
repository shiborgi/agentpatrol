---
name: name-operational-evidence
description: Record named, reproducible evidence for each operational claim.
license: Apache-2.0
---

# name-operational-evidence

## Purpose

Attach a named, reproducible source to every operational claim so reviewers
can re-run the check. An unnamed claim cannot be verified; this skill
disciplines when a claim may be recorded as evidence during planning,
review, and ship.

## When to use

Use this skill whenever an operational claim needs support:

- `plan`, when a planned operational outcome needs a verifiable basis.
- `build-review`, when judging whether an operational change is grounded.
- `ship`, when confirming an operational change satisfies its acceptance.

## Inputs

- The operational claim being recorded.
- The command or observation that would produce the evidence.

## Output

A named evidence entry for the operational claim: the claim, the source name,
and the exact way to reproduce it.

## Rules

- Name the evidence source explicitly; do not rely on unlabelled output.
- Tie each evidence entry to one claim and one reproducible check.
- State the lifecycle stage the evidence supports.
- Keep one concern per entry; do not overload a single source with multiple
  unrelated claims.
- Only record evidence that an operator could watch fail or pass.
- Self-contained and in English; no external references.
