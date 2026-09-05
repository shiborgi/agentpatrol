---
name: responsive-interaction
description: Prove changed surfaces at mobile, tablet, and desktop widths.
license: Apache-2.0
---

# responsive-interaction

## Purpose

Prove every changed surface works at 360, 768, and 1280 pixels wide with
no horizontal overflow and no lost function. A surface verified at one
width only is verified nowhere; this skill disciplines planning (declare
the matrix) and build-review (prove it) so mobile layouts never break
silently.

## When to use

Use this skill when routes or components change or are judged:

- `plan`, when declaring which widths a Work must satisfy.
- `build` and `build-review`, when proving and judging the matrix.

Skip it only when the diff cannot affect layout (pure copy, logic, or
non-visual tokens) — and record the skip with the paths checked.

## Inputs

- The changed routes or components.
- The viewport matrix the plan declared.

## Output

A verdict table: one row per viewport with the command run and pass or
fail. One concern per row; a failing width blocks the Work.

## Rules

- Design mobile-first: stack and wrap before spreading out; declare
  `flexWrap` or stacking behavior explicitly.
- Degrade dense surfaces deliberately: wide tables and charts get a named
  scroll region or a stacked-card alternative, never a clipped overflow.
- Respect reduced motion at every width; animation is enhancement, never
  the signal.
- Verify with Playwright viewport runs and record each verdict through
  `name-interaction-evidence`.
- Self-contained and in English; no external references.
