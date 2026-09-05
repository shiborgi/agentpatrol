---
name: detect-interaction-drift
description: Return a review when interaction behavior no longer matches its plan.
license: Apache-2.0
---

# detect-interaction-drift

## Purpose

Catch when implemented interaction behavior has drifted from its planned
acceptance criteria. Drift that goes unnoticed ships an interaction nobody
specified; this skill disciplines build-review so interaction differences are
surfaced and returned to the host.

## When to use

Use this skill during review when interaction behavior is being judged:

- `build-review`, when comparing an interaction change against its plan.

Skip it when no interaction behavior is under review.

## Inputs

- The planned interaction acceptance criteria.
- The implemented interaction behavior and its diff.

## Output

A decision on whether the interaction matches its plan, with the named
differences that caused a return.

## Rules

- Compare the implemented interaction against the accepted plan, not against
  a general idea of correctness.
- Name each concrete difference that constitutes drift.
- State the lifecycle stage the interaction belongs to.
- Keep one concern per finding; do not combine unrelated deviations.
- Return only on real drift, never on style or preference.
- Visual drift counts as drift: when the plan's observable interaction
  includes a visual outcome, compare screenshots per
  `visual-regression-evidence`; a missing artifact is itself drift.
- Self-contained and in English; no external references.
