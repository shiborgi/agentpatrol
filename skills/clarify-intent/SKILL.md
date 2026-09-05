---
name: clarify-intent
description: Classify and refine intent before writing a spec or plan.
license: Apache-2.0
---

# clarify-intent

## Purpose

Sharpen the intent behind a change before any Initiative or Plan is written.
A vague request produces a vague spec; this skill turns intent into a
classified, scoped direction the next step can act on.

## When to use

Use this skill at the start of a step when the request is not yet clear:

- `spec`, before writing an Initiative document.
- `plan`, before committing to decisions.

Skip it only when the operator already supplied a precise, scoped intent.

## Inputs

- The operator's request, as given.
- Any residual unknowns already recorded for this change.

## Output

- A classification of the request.
- For structural work, a recommended approach (chosen from 2-3 alternatives).
- A refined intent the caller can carry into the next step.
- A residual-unknowns list: every material question the request does not
  answer, each marked unresolved. This skill never writes the spec or plan
  document itself.

## Rules

- Classify before questioning: the request is **bounded** (a well-scoped
  change to a flow that already exists in the repository) or **structural**
  (new subsystems, or changes to interfaces others depend on). Record the
  classification in the output; when in doubt, take the heavier path.
- Do not block the step on a back-and-forth. Host tasks are one-shot: assume
  the smallest reading that the request supports, then list every remaining
  unknown instead of inventing an answer.
- For structural work, propose 2-3 approaches with trade-offs and a
  recommendation; lead with the recommended one.
- Ruthlessly drop everything the request does not prove it needs.
- Carry residual unknowns forward. On `spec`, they must remain visible as
  unresolved items. On `plan`, they belong in `openQuestions`. Never silently
  resolve an unknown by guessing.
- Never edit code and never run lifecycle operations.
- Self-contained and in English; no external references.
