---
name: web-vitals-budget
description: Hold changed routes to declared loading, stability, and size budgets.
license: Apache-2.0
---

# web-vitals-budget

## Purpose

Hold every changed route to declared budgets for loading, visual
stability, responsiveness, and bundle size. Performance that is not
budgeted regresses by default; this skill disciplines planning (declare
the numbers) and build-review and ship (measure them) so LCP, CLS, INP,
and bundle deltas stay visible.

## When to use

Use this skill when perf-critical routes change or are judged:

- `plan`, when declaring the budget numbers the Work must hold.
- `build-review` and `ship`, when measuring the candidate against them.

Skip it only for routes with no user-visible rendering change — and record
the skip with the paths checked.

## Inputs

- The changed route and the budget numbers the plan declared.
- The measurement commands available in the repository.

## Output

Budget verdicts: one row per metric with the measured value, the budget,
and the exact command that produced it, recorded through
`name-interaction-evidence`.

## Rules

- Declare budgets before code: LCP, CLS, and INP targets plus a bundle-delta
  limit for the route.
- Size and lazy-load media and fonts; reserve space for late content so no
  unreserved shift contributor ships without a reservation.
- Prefer `Suspense` and streaming boundaries for slow sections over
  blocking the whole route.
- Record the bundle delta for the route in the build result; an unmeasured
  perf claim fails review.
- Self-contained and in English; no external references.
