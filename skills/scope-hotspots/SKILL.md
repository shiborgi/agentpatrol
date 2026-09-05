---
name: scope-hotspots
description: Decide where to look before any deep analysis.
license: Apache-2.0
---

# scope-hotspots

## Purpose

Decide where to look before any deep analysis. Architecture work only pays off
where change actually happens, so this skill narrows the field to a small set
of hot spots instead of scanning the whole repository.

## When to use

Use this skill at the start of any structural analysis:

- `spec` and `plan`, when the operator's intent is structural and no specific
  direction has been named. On `spec`, the list bounds which Works to write;
  it does not authorize deepening or implementation choices.
- `find-deepening-opportunities`, to obtain the target list it walks.

## Inputs

- An optional direction from the caller: a module, a subsystem, or a pain
  point. When present, it overrides inference.
- Access to the repository's recent commit history.

## Output

An ordered target list, written for the calling skill. Each entry is a path
with a one-line rationale for why it is a target, followed by an explicit
out-of-scope statement declaring everything outside the list excluded from the
current step.

## Rules

- An explicitly named direction wins and skips inference entirely.
- Otherwise, walk recent commit history (`git log --oneline`) and change
  frequency to find paths that keep coming up; let those pull the focus first.
  Widen the net only when changes are scattered with no clear hot spot.
- Keep the list small enough to act on. Everything outside it is out of scope.
- Never edit code and never run lifecycle operations; use read-only git
  inspection only.
- Self-contained and in English; no external references.
