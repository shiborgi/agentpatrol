---
name: minimal-implementation
description: Write only what the task needs, via a reuse ladder.
license: Apache-2.0
---

# minimal-implementation

## Purpose

Write only what the task needs. The best code is the code never written; this
skill stops unnecessary code before it exists by walking a reuse ladder before
any implementation begins.

## When to use

Use this skill at the start of implementation work:

- `build`, before writing code for any Work.
- `plan`, when scoping a decision to the smallest change that satisfies it.

Skip it only for throwaway prototypes, which `answer-by-prototype` already
marks as disposable.

## Inputs

- The behavior being implemented, from the Work's acceptance criteria.
- The code the change touches and its actual flow.

## Output

The smallest implementation that satisfies the task, or a decision to write
nothing because the task is already solved by something that exists. No other
files are produced.

## Rules

- **Read first, then ladder.** Read the code the change touches and trace the
  real flow before picking a rung. Lazy about the solution, never about
  reading.
- **Walk the reuse ladder in order.** Stop at the first rung that holds:
  1. Does this need to exist at all? If not, skip it.
  2. Already in the codebase? Reuse it — do not rewrite it.
  3. The standard library does it? Use it.
  4. A native platform feature does it? Use it.
  5. An installed dependency does it? Use it.
  6. One line suffices? Write one line.
  7. Only then: the minimum that works.
- **Never cut the load-bearing parts.** Validation, error handling, security
  and accessibility are never on the chopping block. The code ends up small
  because it is necessary, not golfed.
- **No speculative generality.** Do not add parameters, hooks or abstractions
  for needs the task does not have.
- **Mark known ceilings.** When a deliberate simplification has a known ceiling
  and a named upgrade path, mark it at the call site in a short comment.
- Never run lifecycle operations. Self-contained and in English; no external
  references.
