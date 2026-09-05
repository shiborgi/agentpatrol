---
name: design-token-discipline
description: Keep styling on shared design tokens, never on hardcoded values.
license: Apache-2.0
---

# design-token-discipline

## Purpose

Keep `packages/ui/src/tokens.ts` (or the repo's declared token module) the
single source of visual truth. Hardcoded colors, spacing, shadows, and
radii drift across surfaces and silently break themes; this skill
disciplines build and build-review so every style resolves to a token or
carries an explicit, cited exception.

## When to use

Use this skill when styles change or are judged:

- `build`, for every changed style declaration.
- `build-review`, when checking the candidate's visual diff.

Skip it only when the diff contains no style declarations — and record the
skip with the paths checked.

## Inputs

- The changed style declarations and their diff.
- The token module and its theme wiring.

## Output

A token-violation list (file, line, hardcoded value, token that should
have been used) — or an explicit `Mark known ceilings` comment per
exception. No violations and no unmarked hardcoding is also a result.

## Rules

- No hardcoded hex, `rgb()`/`rgba()`, spacing, shadow, or radius outside
  the token module; reuse shared components from the UI package instead of
  duplicating field, label, or button styles.
- Resolve themes through the declared mechanism (for example
  `themeVariables(theme)`); color is never the only status signal.
- Keep `tabular-nums` for monetary values and legible type for financial
  tables; decorative chrome never degrades data legibility.
- Mark a genuine exception with `// Mark known ceilings: <reason>
  (<criterion-id>)` on the preceding line; an unmarked hardcoding fails
  review even when the surface looks correct.
- Self-contained and in English; no external references.
