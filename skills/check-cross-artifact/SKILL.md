---
name: check-cross-artifact
description: Find contradictions across spec, plan, and candidate without ranking.
license: Apache-2.0
---

# check-cross-artifact

## Purpose

Catch drift between artifacts of the same change. A spec, a plan, and a
candidate can each look coherent and still disagree; this skill reports those
disagreements without picking a winner.

## When to use

Use this skill whenever a review can see more than one artifact:

- `spec-review`, when comparing an Initiative to the stated intent.
- `plan-review`, when comparing a Plan to its Works and acceptance IDs.
- `build-review`, when comparing a candidate to the selected Plan and spec.

Skip it when only one artifact is in hand.

## Inputs

- The artifacts in scope for the current review.
- Host-assigned acceptance IDs, when present.

## Output

A list of contradictions. Each entry names the two (or more) artifacts, the
conflicting claims, and a citation into each. No ranking, score, or selection
is produced.

## Rules

- **Compare claims, not style.** Report only factual disagreements: missing
  coverage, extra behavior, renamed IDs, steps that implement a different
  Work, or a diff that does not match a plan step.
- **Cite both sides.** An entry without a pointer into each artifact is not
  a finding.
- **Do not repair.** Do not rewrite the spec, plan, or candidate. Return the
  list so the host can send the work back.
- **Do not rank.** Never prefer a candidate, compute a total, or name a
  winner. Host gates remain authoritative.
- Never run lifecycle operations. Self-contained and in English; no external
  references.
