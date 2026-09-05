---
name: record-non-goals
description: Record out-of-scope items and binding constraints.
license: Apache-2.0
---

# record-non-goals

## Purpose

Make exclusion explicit. Scope creep starts as an unspoken extra; this skill
writes the non-goals and the constraints that later steps must not quietly
expand.

## When to use

Use this skill when scope is being locked or reviewed:

- `spec` and `plan`, once intent is classified.
- `spec-review` and `plan-review`, when judging whether a candidate stayed
  inside that lock.

Skip it only when the request already names both the work and everything it
is not.

## Inputs

- The refined intent and the request as given.
- Existing glossary or decision notes, if present.

## Output

Two short lists: **non-goals** (work this change will not do) and
**constraints** (limits it must respect). Each constraint is marked
reversible or hard to reverse. No other files are produced.

## Rules

- **Non-goals are work, not wishes.** Each entry is a concrete behavior,
  integration, or slice that a reader might otherwise assume is in.
- **Constraints bind later steps.** Record platform, compatibility, data,
  security, or operational limits the request or repository already imposes.
  Do not invent a constitution.
- **Mark reversibility.** A hard-to-reverse constraint stays in the artifact;
  a reversible preference is advice and must be labeled as such.
- **Drop the rest.** Anything the request does not prove it needs is a
  non-goal, including speculative hooks, extra parameters, and adjacent
  cleanups.
- Reviewers cite a non-goal or constraint when a candidate expands past it.
  They do not rewrite the lists.
- Never edit product code and never run lifecycle operations. Self-contained
  and in English; no external references.
