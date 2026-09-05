---
name: inventory-ambiguity
description: Record residual unknowns instead of guessing them away.
license: Apache-2.0
---

# inventory-ambiguity

## Purpose

Keep every material unknown visible. Guessing closes a question in the
author's head and opens a defect in the artifact; this skill inventories what
the request, the spec, or the plan still does not settle.

## When to use

Use this skill before submitting a spec or plan, and when reviewing one:

- `spec` and `spec-review`, for unresolved product or domain questions.
- `plan`, to populate `openQuestions`.

Skip it only when nothing material remains unknown.

## Inputs

- The request, spec, or plan under consideration.
- Any residual unknowns already listed by `clarify-intent`.

## Output

An ordered list of residual unknowns. Each entry is one question, why it
matters, and what was assumed instead of answering it. No other files are
produced.

## Rules

- **Unknowns are first-class.** If the artifact must proceed, it proceeds
  with the list attached — never with a silent default presented as fact.
- **One question per entry.** Name the decision, the options if known, and
  the cost of being wrong.
- **Assumptions are labeled.** When a smallest reading was taken so the step
  could continue, record it as an assumption, not as a requirement.
- **Do not invent answers.** Prefer an explicit unknown over a plausible
  guess. On `plan`, copy still-open items into `openQuestions`.
- **Drop settled items.** If a later fact, the operator, or a primary source
  closed a question, remove it from the list.
- Never edit product code and never run lifecycle operations. Self-contained
  and in English; no external references.
