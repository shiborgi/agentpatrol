---
name: form-validation-observable
description: Make form states and errors schema-driven and externally visible.
license: Apache-2.0
---

# form-validation-observable

## Purpose

Make every form state and error observable and schema-driven. A form that
fails silently, accepts unparsed input, or reports errors only in code
cannot be verified; this skill disciplines planning (declare the states),
build (implement them), and build-review (judge them) so operators always
see what is wrong and why.

## When to use

Use this skill when forms change or are judged:

- `plan`, when declaring the field states a Work must handle.
- `build`, when implementing validation and error display.
- `build-review`, when judging whether error paths are observable.

Skip it only when the Work touches no form — and record the skip.

## Inputs

- The form fields and the Zod schema (in `packages/contracts` or colocated)
  that validates them.
- The host's acceptance criteria and result contract.

## Output

A per-field state table: field, states covered
(`pristine`, `touched`, `submitting`, `disabled`), message shown, and the
`aria` wiring. One concern per row.

## Rules

- Parse input on the client before submit (for example `amountMinor` from
  string to validated minor units); never send unparsed strings and hope.
- Free-typed identifiers get autocomplete or validation, or an explicit
  non-goal entry citing why they stay free-typed.
- Disable submit while the mutation and refresh are in flight; a double
  submit is a validation failure.
- Link every error message to its field with `aria-describedby` and expose
  it with `role="alert"`; success feedback uses `role="status"`.
- Self-contained and in English; no external references.
