---
name: maintain-domain-model
description: Keep the project's domain model sharp while designing.
license: Apache-2.0
---

# maintain-domain-model

## Purpose

Keep the project's domain model alive and sharp while designing. Fuzzy
language produces fuzzy software; this skill challenges the terms a change
uses so the Initiative or Plan speaks the codebase's real language.

## When to use

Use this skill at the start of a step when terminology is being decided or
challenged:

- `spec`, when naming new concepts or reusing existing ones.
- `plan`, when a decision hinges on what a term means.

Skip it only when no new or ambiguous term is involved.

## Inputs

- The project's existing glossary (`CONTEXT.md`) and decisions (`docs/adr/`),
  if present.
- The operator's statements about how the system works.

## Output

- Precise, canonical terms for the concepts under discussion.
- Updated `CONTEXT.md` and `docs/adr/` entries, written inline as decisions
  crystallize. No other files are produced.

## Rules

- **Challenge conflicts immediately.** When a term conflicts with the
  glossary, call it out: "the glossary defines X, but you seem to mean Y —
  which is it?"
- **Sharpen fuzzy terms.** When a term is vague or overloaded, propose one
  precise canonical name and use it from then on.
- **Stress-test with scenarios.** Probe relationships with concrete edge-case
  scenarios that force the boundary between concepts to be explicit.
- **Cross-reference against code.** When the operator states how something
  works, check whether the code agrees and surface any contradiction.
- **Record inline, lazily.** Write resolved terms into `CONTEXT.md` as they
  crystallize — a glossary only, never implementation detail. Create
  `CONTEXT.md` and `docs/adr/` only when there is something to write.
- **Offer decisions sparingly.** Record a decision (an ADR) only when it is
  hard to reverse, surprising without context, and the result of a real
  trade-off; otherwise skip it.
- Never write the spec or plan itself and never run lifecycle operations.
  Self-contained and in English; no external references.
