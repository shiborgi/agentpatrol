---
name: python-development
description: Develop and assess Python changes with reproducible environments and resource safety.
license: Apache-2.0
---

# Python Development

## Inputs
Active persona, acceptance criteria, supported Python versions, pyproject metadata,
dependency lockfiles, module layout and test/lint/type-check configuration.

## Procedure
1. Inspect interpreter constraints and the repository's environment tooling.
2. Keep imports and package interfaces explicit; avoid import-time side effects.
3. Use context managers for files, connections and transactions; handle failures.
4. Distinguish sync and async execution; do not block event loops or swallow errors.
5. Add focused success and failure tests using the existing runner.
6. During planning/review, assess these practices without silently implementing.

## Output
Stage-appropriate decisions or changes, compatibility considerations, verification
commands and results, and unresolved environment or integration limitations.

## Verification
Run configured tests, lint and type checks in the project environment when
authorized. Check supported versions and package imports without network assumptions.

## Safety
Do not install globally, deserialize untrusted pickle data, interpolate untrusted
shell/SQL strings or log secrets. Preserve exception context and bound external I/O.
Environment setup and execution require host authorization, not profile selection.
