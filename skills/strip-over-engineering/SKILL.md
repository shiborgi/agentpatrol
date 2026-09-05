---
name: strip-over-engineering
description: Review for over-engineering and return a delete-list.
license: Apache-2.0
---

# strip-over-engineering

## Purpose

Remove code that should never have existed. Over-engineered code is debt with
a warranty: this skill reviews a diff or a plan and hands back a delete-list so
the change ships only what the task actually needed.

## When to use

Use this skill when judging whether a change is too big:

- `build-review`, on the candidate diff.
- `plan-review`, on the plan's decisions.

Skip it when the change is already minimal.

## Inputs

- The diff or plan under review.
- The originating intent or acceptance criteria.

## Output

A delete-list: each entry names what to remove and why. No other files are
produced.

## Rules

- **Look for over-engineering only.** Code that does not need to exist (YAGNI
  violations), reinventions of the standard library or an installed
  dependency, speculative generality (parameters, hooks and abstractions
  added for needs that are not real), and dead or duplicate paths.
- **State what to remove and why.** Every entry justifies the deletion against
  the task's actual need, not taste.
- **Keep the list honest.** Propose deletions only for genuine
  over-engineering; do not propose rewriting code that is merely awkward or
  unfamiliar. When in doubt, leave it off the list.
- **Sharpen, do not duplicate.** This skill is the focused form of the
  speculative-generality check inside `two-axis-review`; use it when that one
  concern deserves full attention, and do not repeat the other review axes.
- Never run lifecycle operations. Self-contained and in English; no external
  references.
