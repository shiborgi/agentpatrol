---
name: delta-from-current
description: Separate existing behavior from the change being planned.
license: Apache-2.0
---

# delta-from-current

## Purpose

Plan against what already exists. A brownfield change that restates the
system as if it were new hides reuse and inflates scope; this skill splits
current behavior from the delta.

## When to use

Use this skill at the start of planning or plan review:

- `plan`, before walking the reuse ladder.
- `plan-review`, when judging whether decisions change more than the delta.

Skip it only when the repository has no existing behavior in the scoped
paths.

## Inputs

- The Wave's Works and acceptance criteria.
- The scoped code and, when present, a host context snapshot.

## Output

Two lists: **unchanged** (behavior and modules the plan will leave alone)
and **delta** (behavior the plan must add, change, or remove). No other
files are produced.

## Rules

- **Read the current flow first.** Trace the paths the Works touch before
  proposing a new structure.
- **Unchanged is in scope to protect.** Anything the acceptance criteria do
  not require changing belongs on the unchanged list and must survive the
  plan.
- **Delta is the only work.** Each delta item must map to at least one
  acceptance ID. Adjacent cleanup, renaming, or deepening that is not
  required is not delta.
- **Reuse beats rewrite.** If current code already satisfies an acceptance
  ID, record that fact and write no step for it.
- Never edit product code and never run lifecycle operations. Self-contained
  and in English; no external references.
