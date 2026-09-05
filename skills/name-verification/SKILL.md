---
name: name-verification
description: Require a real verification command and per-ID expected evidence.
license: Apache-2.0
---

# name-verification

## Purpose

Make verification specific. A plan that says "tests pass" is not a strategy;
this skill names the command that will be run and the evidence each
acceptance ID must leave behind.

## When to use

Use this skill when verification is being promised or judged:

- `plan`, when filling the plan's `verification` field.
- `plan-review`, when judging whether that field is executable.
- `build-review`, when checking that claimed evidence matches the named
  command.

Skip it only when the command, its working directory, and per-ID expected
evidence are already explicit.

## Inputs

- The Wave's acceptance IDs.
- The repository's documented test or verify command, if any.

## Output

A single verification command (argv or equivalent) plus, for each acceptance
ID, the output, exit code, or artifact that would prove it. No other files
are produced.

## Rules

- **Name a real command.** Prefer the repository's documented verify command.
  Record the exact argv, not a paraphrase such as "run the tests".
- **One command for the Wave.** Extra checks are allowed only when that
  command cannot speak to an ID; each extra check is named the same way.
- **Evidence per ID.** For every acceptance ID, state what a fresh run must
  show. Shared suite output is allowed; hand-waving is not.
- **Reject placeholders.** "CI", "looks good", or "the developer will check"
  is not verification.
- Reviewers compare later claims against this command. They do not invent a
  different one.
- Never run lifecycle operations. Self-contained and in English; no external
  references.
