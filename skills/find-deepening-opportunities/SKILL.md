---
name: find-deepening-opportunities
description: Surface deepening candidates inside a scoped area.
license: Apache-2.0
---

# find-deepening-opportunities

## Purpose

Surface deepening opportunities — refactors that turn shallow modules into
deep ones — inside a scoped target list. The aim is to reduce architectural
friction so the codebase becomes easier to change and to test.

## When to use

Use this skill after `scope-hotspots` (or with a caller-named scope) when a
structural change is being considered:

- `plan`, to feed deepening candidates into the Plan's decisions.
- `build-review`, as a lens to judge whether a candidate deepened or merely
  rearranged a module.

Do not use it on `spec`. Spec records what must change and why; deepening is
how, and belongs in the plan.

## Inputs

- A scoped target list of paths (from `scope-hotspots` or named by the
  caller).
- The `architecture-vocabulary` skill, whose terms and principles this skill
  uses verbatim.

## Output

A set of candidates. Each candidate carries:

- **Files** — which modules are involved.
- **Problem** — why the current structure causes friction, in vocabulary
  terms.
- **Solution** — a plain-English description of what would change.
- **Benefits** — locality, leverage, and test-surface improvement.
- **Recommendation strength** — one of `strong`, `worth exploring`, or
  `speculative`.

## Rules

- Walk the scoped area and note where friction lives: understanding one concept
  requires bouncing across many small modules (no locality); a module's
  interface is nearly as complex as its implementation (shallow);
  tightly-coupled modules leak across their seams; behavior is hard to test
  through its current interface.
- Apply the deletion test to every candidate and discard any that merely move
  complexity instead of concentrating it.
- State every finding in the `architecture-vocabulary` terms exactly — no
  synonyms.
- Propose only: never edit code and never run lifecycle operations.
- Self-contained and in English; no external references.
