---
name: frontend-a11y-check
description: Verify keyboard, focus, naming, and contrast for changed interactions.
license: Apache-2.0
---

# frontend-a11y-check

## Purpose

Make every changed interaction operable by keyboard, managed in focus,
correctly named, and contrast-safe. An interaction that only works with a
pointer, traps focus, or speaks no accessible name excludes operators;
this skill disciplines build and build-review so such regressions are
caught with reproducible evidence.

## When to use

Use this skill when interactive elements change or are judged:

- `build`, for every changed control, dialog, table, or visual before the
  Work is declared done.
- `build-review`, as the checklist against which the candidate is judged.

Skip it only when the diff touches no interactive surface (pure data,
config, or non-UI logic) — and record the skip with the paths checked.

## Inputs

- The changed interactive elements and their diff.
- The host's acceptance criteria and result contract.

## Output

Per-element verdicts: the element, pass or fail, and the exact reproduce
command (test path or Playwright spec). One concern per verdict.

## Rules

- Prefer native controls (`button`, `select`, `input`, `dialog`); when a
  custom role is required, set the correct `role` and its required states.
- Associate every input with a `label`; link error text via
  `aria-describedby` and surface errors with `role="alert"`.
- Manage focus: move focus into opened dialogs, restore it on close,
  close on `Escape`, and expose `aria-modal` semantics.
- Announce async success with `role="status"` or a live region; never rely
  on color alone for status.
- Give data tables `caption` or headers and visuals such as charts a
  textual alternative an operator can read.
- Run the axe suite with contrast checks enabled and record each verdict
  through `name-interaction-evidence`; an unnamed claim is not evidence.
- Self-contained and in English; no external references.
