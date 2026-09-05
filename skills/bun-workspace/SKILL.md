---
name: bun-workspace
description: Work inside Bun and Turborepo monorepos using workspace conventions.
license: Apache-2.0
---

# bun-workspace

## Purpose

Work inside Bun and Turborepo monorepos using the workspace conventions
instead of fighting them. A change that bypasses filters, lockfiles, or
the task graph breaks sibling packages; this skill disciplines build so
commands run at the right scope with reproducible installs.

## When to use

Use this skill when monorepo structure is involved:

- `build`, for every change spanning packages, adding dependencies, or
  touching shared configuration (`package.json`, `turbo.json`, lockfiles).
- `plan`, when decisions promise cross-package changes.

Skip it only for single-package changes with no shared surface — and
record the skip with the paths checked.

## Inputs

- The packages and shared files the task touches.
- The repository's task graph (`turbo.json`) and workspace roots.

## Output

The scoped commands actually run (install, filter, task) plus any
lockfile or graph change with its reason. No other files are produced.

## Procedure

- Respect the repository's declared workspace roots: depend across
  packages with `workspace:*`, never with relative paths or duplicated
  installs.
- Install reproducibly: `bun install --frozen-lockfile`; commit lockfile
  changes only when dependencies intentionally changed, with the reason
  recorded.
- Scope execution with filters (`turbo run <task> --filter=<package>`);
  run the whole graph only when the change is genuinely cross-cutting.
- Honor the task graph: `build` depends on upstream builds, `check`
  composes `typecheck`, `lint`, `test`, and `build`; never run `build`
  before its dependencies or skip `typecheck` to save time.
- Follow existing package scripts (`typecheck`, `lint`, `test`, `build`,
  `dev`, `check` where defined); do not add no-op scripts to imply verification.
- Test with the repo's runner (`bun test`, with preload setup files where
  configured); preload and setup files are shared infrastructure, never
  per-test workarounds.

## Verification

Confirm scoped commands cover changed packages and affected dependents. Check
lockfile consistency and record actual results, including skipped or unavailable
checks. Use the installed Bun and Turborepo versions rather than assumed flags.

## Safety

Apply only when Bun/workspace tooling is present. During planning or review,
assess these practices without making changes. Installs can execute lifecycle
scripts and require authorization; never rewrite unrelated lockfiles, commit
changes, install globally or bypass frozen-lockfile failures without approval.
