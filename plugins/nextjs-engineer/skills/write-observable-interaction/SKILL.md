---
name: write-observable-interaction
description: Author interaction requirements that an operator can watch fail or pass.
license: Apache-2.0
---

# write-observable-interaction

## Purpose

Make every interaction requirement observable so a reviewer can verify it
without trusting a claim. An interaction that cannot be watched passing proves
nothing; this skill disciplines how interaction behavior is specified during
planning and reviewed during build-review.

## When to use

Use this skill when an interaction is being specified or judged:

- `plan`, when describing an interaction a Work will change.
- `build-review`, when checking whether an interaction change meets its
  acceptance criteria.

Skip it for pure read-only queries where no interaction behavior changes.

## Inputs

- The interaction behavior being planned or reviewed.
- The host's acceptance criteria and result contract.

## Output

An observable interaction requirement: a concrete stimulus, a named outcome,
and a way to detect that outcome from outside the interaction.

## Rules

- Describe the interaction as an external observer would, from inputs and
  side effects, not from internal state.
- Name the outcome precisely enough that a reviewer could watch for it.
- State the lifecycle stage the interaction belongs to.
- Keep one concern per requirement; do not bundle unrelated outcomes.
- Never claim pass or fail without a reproducible way to observe it.
- Self-contained and in English; no external references.
