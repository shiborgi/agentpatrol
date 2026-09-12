---
name: python-development
description: Develop and assess Python changes with reproducible environments and resource safety.
license: MIT
---

# Python Development

## Inputs
Active persona, acceptance criteria, supported Python versions, pyproject metadata,
dependency lockfiles, module layout and test/lint/type-check configuration.

## Procedure
1. Inspect interpreter constraints, environment tooling (e.g. uv, poetry, venv) and pyproject layout.
2. Keep imports and package interfaces explicit; use strict PEP 484/604 type annotations (`A | B`) without import-time side effects.
3. Define robust schema validation using Pydantic V2 or dataclasses; isolate domain entities from serialization layers.
4. Use context managers for files, connections and transactions; handle and propagate typed exceptions cleanly.
5. Distinguish sync and async execution (FastAPI/asyncio); do not block event loops with synchronous I/O or swallow errors.
6. Add focused success, edge-case and failure tests using pytest with typed fixtures and monkeypatch isolation.
7. During planning/review, assess these practices without silently implementing.

## Output
Stage-appropriate decisions or changes, compatibility considerations, verification
commands and results, and unresolved environment or integration limitations.

## Verification
Run configured tests (e.g. `pytest`, `uv run pytest`), lint (e.g. `ruff check`) and type checks (`mypy`, `pyright`)
in the project environment when authorized. Check supported versions and package imports without network assumptions.

## Safety
Do not install globally, deserialize untrusted pickle data, interpolate untrusted
shell/SQL strings or log secrets. Preserve exception context and bound external I/O.
Environment setup and execution require host authorization, not profile selection.
