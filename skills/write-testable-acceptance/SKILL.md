---
name: write-testable-acceptance
description: Write acceptance criteria that an observer can pass or fail.
license: Apache-2.0
---

# write-testable-acceptance

## Purpose

Make every acceptance criterion observable. A criterion that cannot be shown
to pass or fail is not acceptance; this skill rewrites each statement until a
stranger could run one check and decide.

## When to use

Use this skill when acceptance statements are being written or judged:

- `spec`, for every Work before the Initiative is submitted.
- `spec-review`, when judging whether a criterion is verifiable.

Skip it only when every criterion already names a condition, an action, and
an observable result.

## Inputs

- The behavior the Work must deliver.
- Draft acceptance statements, if any.

## Output

A list of acceptance statements. Each one names the condition, the action,
and the evidence that would prove it. No other files are produced.

## Rules

- **One behavior per statement.** Split bundled criteria. Merge duplicates.
- **Observable triplet.** Every statement must make all three explicit: the
  setup or condition, the action or event, and the result a verifier can see
  (output, exit code, file, rendered state, or equivalent).
- **Reject untestable language.** Rewrite or drop statements that only say
  the change "works", "should", "probably", "handles it", or "is user
  friendly" without an observation.
- **Name the evidence, not the implementation.** Say what a run must show,
  not which module, helper, or pattern will produce it.
- **Negative paths count.** If the request implies a refusal, error, or
  unchanged behavior, write a criterion for that path too.
- Never write the rest of the spec or plan, never edit product code, and
  never run lifecycle operations. Self-contained and in English; no external
  references.
