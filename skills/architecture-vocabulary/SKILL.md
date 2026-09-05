---
name: architecture-vocabulary
description: Shared design terms and principles for structural reasoning.
license: Apache-2.0
---

# architecture-vocabulary

## Purpose

Provide the single design vocabulary that every architecture discussion uses.
It fixes the meaning of seven terms and three principles so that different
skills, at different stages, reason about structure the same way instead of
drifting into synonyms.

## When to use

Use this skill whenever a primary or support skill reasons about code
structure. In particular:

- `plan`, when the Plan must name modules, seams and boundaries precisely.
- `spec-review` and `build-review`, when judging whether a candidate improves
  depth or merely moves complexity.
- `find-deepening-opportunities`, which states its findings in these terms.

Do not use it to inject implementation structure into a spec. Spec records
what must change; this vocabulary is for how.

## Inputs

None. This skill is the vocabulary itself; it is referenced, not executed.

## Output

The seven terms and three principles below, which consumers must apply
verbatim. No files are produced.

### Terms

- **module** — a self-contained unit of code with a clear responsibility.
  Example: the `git` module wraps every subprocess call behind a small set of
  helpers (`runGit`, `runGitNullable`).
- **interface** — the surface a module exposes: what callers can do with it,
  and nothing more. Example: `change.ts` exposes `createChange`,
  `observeCandidate` and `cleanupChange`, hiding the branch and worktree
  mechanics behind them.
- **depth** — a module is *deep* when its interface is small but its
  implementation absorbs real complexity; it is *shallow* when the interface
  is nearly as complex as the implementation.
- **seam** — a place where two modules meet and can be separated; the
  interface *is* the seam. Example: `verifier.ts` is the seam at which
  build-review decides how verification runs.
- **adapter** — a module that translates one interface into another. Example:
  the zod schemas in `schemas.ts` adapt raw JSON into typed domain objects.
- **leverage** — how much value a change unlocks relative to its cost.
  Example: improving `verifier.ts` benefits every Wave, because one command
  gates every build.
- **locality** — related behavior lives together, so understanding one concept
  does not require bouncing across many modules. Example: `lifecycle.ts`
  derives the next operation from attempts in a single place.

### Principles

- **The deletion test** — deleting a deep module concentrates complexity;
  deleting a shallow one just moves it.
- **The interface is the test surface.**
- **One adapter is a hypothetical seam, two make it real.**

## Rules

- Use these terms exactly; do not drift into synonyms such as "service",
  "API", or "boundary". The synonym "component" is likewise forbidden,
  except when the resolving agent is `frontend-engineer` or
  `frontend-engineer-lean` describing a React surface, where "component"
  means a UI module with props as its interface.
- State findings in this vocabulary; when a term does not fit, revisit the
  term before inventing a new one.
- This skill is self-contained: no external links or attributions, English
  only.
