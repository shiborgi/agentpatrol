---
name: two-axis-review
description: Review a document or diff along independent Standards and Spec axes.
license: Apache-2.0
---

# two-axis-review

## Purpose

Review a diff along two deliberately independent axes so that neither masks
the other. A change can pass one and fail the other: standards-perfect code
implementing the wrong thing, or spec-faithful code breaking convention.

## When to use

Use this skill whenever a document or diff is reviewed:

- `spec-review`, when judging an Initiative document against the intent.
- `plan-review`, when judging a Plan against the acceptance criteria of its Works.
- `build-review`, when judging a candidate against its acceptance.

## Inputs

- The document or diff under review.
- The originating intent, spec, or acceptance criteria.
- The repository's documented conventions, if any.
- The host review protocol's dimensions, when supplied.

## Output

Two separate reports — `Standards` and `Spec` — each listing findings with a
citation, plus a one-line summary of the worst issue within each axis. The two
axes are never merged or reranked.

When the host supplies a rubric and a result contract, defer to the host
contract for any aggregate score, ranking, pass/fail, or `selectedProposalId`;
this skill only structures judgment and never overrides the host result
contract.

## Rules

- **Standards axis** — does the change follow the repository's documented
  conventions, plus a baseline of common code smells used as judgement calls,
  never hard violations: mysterious names, duplicated logic, feature envy,
  data clumps, speculative generality, message chains, and a middle man that
  only delegates. A documented convention overrides the baseline; skip
  anything tooling already enforces.
- **Spec axis** — does the change faithfully implement what was asked:
  requirements that are missing or partial, behavior that was not asked for
  (scope creep), and requirements that look implemented but wrong.
- **Check the host's Spec dimensions without scoring them.** When the host
  supplies dimensions, use them as the Spec-axis checklist and cite each
  finding against the matching dimension name. Typical names include
  `scope-coverage`, `requirement-grounding`, `acceptance-clarity`,
  `unresolved-ambiguity`, `acceptance-mapping`, `code-locality`,
  `dependency-risk-coverage`, `verification-specificity`,
  `acceptance-evidence`, `test-verification-evidence`, `regression-risk`, and
  `change-scope`. Do not assign levels, weights, or totals here.
- **Cite every finding.** Point at the specific standard or the specific
  requirement, and quote the relevant text or hunk.
- **Label judgement calls.** Distinguish hard violations from smell
  heuristics; never present a judgement call as a hard failure.
- **Report axes separately.** Present each axis under its own heading without
  merging or reranking, so one axis cannot hide the other.
- The objective gates (verification exit code, acceptance coverage) remain
  authoritative; this skill only structures judgment. Aggregate score,
  ranking, winner selection, and Ship decisions are the host result contract's,
  not this skill's. Never run lifecycle operations. Self-contained and in
  English; no external references.
