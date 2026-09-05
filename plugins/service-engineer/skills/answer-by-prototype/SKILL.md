---
name: answer-by-prototype
description: Answer a design question with a throwaway prototype.
license: Apache-2.0
---

# answer-by-prototype

## Purpose

Answer a design question by building a throwaway prototype. Some questions are
cheaper to answer by building than by debating; this skill makes the prototype
fast, honest, and disposable so the answer — not the code — is what survives.

## When to use

Use this skill when a design question is genuinely open:

- `plan`, when it is unclear whether a state model or a flow holds up.
- `build`, when exploring an approach before committing to it.

Skip it when the answer is already clear enough to decide directly.

## Inputs

- The design question to answer.
- The surrounding code the question concerns.

## Output

A recorded verdict — the question it settled and the decision it validated.
On `build` only, a throwaway prototype that answers the question. The
prototype itself never lands on the product branch.

## Rules

- **Identify the question first.** The question decides the shape of the
  prototype; state it before building anything.
- **Plan produces a verdict, not code.** On `plan`, reason through the
  smallest experiment that would settle the question and record the verdict.
  Do not edit product code, create files, or leave a prototype in the
  workspace. If the question cannot be settled without running code, record it
  as an open question and stop.
- **Throwaway from day one (build only).** Name it so a casual reader sees it
  is a prototype, not production, and locate it next to where it would be used.
- **Trivial to run.** One command or one click starts it; no setup thought
  required.
- **Skip the polish.** No tests, no error handling beyond what makes it
  runnable, no abstractions — the point is to learn fast.
- **No persistence by default.** State lives in memory unless the question is
  about persistence, in which case use a clearly marked scratch store.
- **Surface the state.** After every action, render or print the full relevant
  state so the effect of each action is visible.
- **Fold back the decision, not the code.** When the question is answered,
  fold the validated decision into the real work and record the verdict with
  the question it settled; the prototype never reaches the product branch.
- Never run lifecycle operations. Self-contained and in English; no external
  references.
