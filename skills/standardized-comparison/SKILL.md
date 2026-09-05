---
name: standardized-comparison
description: Assess candidates against a host-supplied rubric, one category at a time.
license: Apache-2.0
---

# standardized-comparison

## Purpose

Compare multiple candidates on the same footing, strictly inside the rubric the
host supplies. The host owns the category definitions and the acceptance gates;
this skill only structures the judgment so every candidate is assessed against
exactly the same categories, in the same order, with the same level scale.

## When to use

Use this skill whenever a review compares more than one candidate and the host
provides a rubric:

- `spec-review`, when judging multiple Initiative documents.
- `plan-review`, when judging multiple Plans.
- `build-review`, when judging multiple build candidates.

Skip it when only one candidate is under review or no host rubric is supplied.

## Inputs

- The candidates under review.
- The host rubric: an ordered list of categories, each with a description.
- The verification result and acceptance coverage the host provides.

## Output

For each supplied category, in the order the host supplied it, one assessment
per candidate:

- **Level** — one of `0`, `25`, `50`, `75`, or `100`, assigned from the
  candidate's content alone.
- **Rationale** — a concise reason for the level.
- **Evidence references** — sorted, unique, host-addressable references (such
  as a path with line numbers, a command with its exit code, or a quoted
  hunk) that a host or operator can actually reach. No unsupported evidence.

No aggregate score, total, rank, winner, or Ship decision is produced.

## Rules

- **Assess content first.** Judge each category from the candidate's content
  before considering who produced it, how it was produced, or when it arrived.
- **Anonymize while judging.** Assess under anonymized labels (`Candidate A`,
  `Candidate B`, …) and defer audit provenance (author, process, ordering)
  until after the judgment is recorded.
- **Use only the level scale.** Levels are exactly `0`, `25`, `50`, `75`, and
  `100`. Nothing outside that scale.
- **One assessment per category, in host order.** Cover every category the host
  supplied, in the order supplied, for every candidate. Do not reorder,
  merge, or drop categories.
- **Keep provenance out of the level.** The harness, the model, the context
  profile, the agent identity, unsupported evidence, and candidate order must
  never change a level. A level reflects the candidate's content alone.
- **Cite only host-addressable evidence.** Every reference must be reachable
  from the host address space. Do not fabricate evidence or cite what cannot
  be reached.
- **No arithmetic.** Never compute weights, aggregate totals, or a combined
  score. Report per-category levels only.
- **Host gates are authoritative.** Host verification and acceptance gates
  decide pass/fail and any selection. This skill never ranks candidates, names
  a winner, or makes a Ship decision. Defer to the host result contract.
- Never run lifecycle operations. Self-contained and in English; no external
  references.
