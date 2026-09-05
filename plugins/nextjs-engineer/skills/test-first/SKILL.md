---
name: test-first
description: Implement through a failing-test-first loop.
license: Apache-2.0
---

# test-first

## Purpose

Pin every behavior a Work changes with a failing test before code exists. A
test that was never seen failing proves nothing; this skill disciplines the
build's inner loop so tests guard real behavior.

## When to use

Use this skill throughout the implementation loop:

- `build`, for every behavior change.
- `plan`, when decisions promise new behavior that will need tests.

Skip it only for throwaway prototypes, generated code, or configuration files
— and confirm the skip with the operator.

## Inputs

- The behavior being changed, from the Work's acceptance criteria.
- The repository's test runner and its command.

## Output

A green test suite where every changed behavior has a test that was observed
to fail first. No files are produced beyond the tests and the minimal code.

## Rules

- **Write the failing test first**: one behavior per test, a name that
  describes the behavior, real code rather than mocks when avoidable.
- **Watch it fail**: run the test and confirm it fails for the expected reason
  — a missing behavior, not a typo or setup error.
- **Minimal code**: write the smallest implementation that makes the test
  pass. Do not add features, refactor neighbors, or improve beyond the test.
- **Keep the suite green**: after the test passes, run the whole suite and
  fix any regression before moving on.
- **Refactor last**: only after green, remove duplication, improve names and
  extract helpers — without adding behavior.
- Code written before its test is deleted and redone, never kept as reference.
- Frontend evidence runs through the repo's own runners without mandating
  one: React Testing Library plus jest-axe assertions for interaction and
  accessibility claims, Playwright specs for viewport and flow claims. Name
  the runner per claim via `name-interaction-evidence`.
- Never run lifecycle operations. Self-contained and in English; no external
  references.
