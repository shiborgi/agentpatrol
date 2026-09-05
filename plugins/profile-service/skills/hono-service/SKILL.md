---
name: hono-service
description: Implement Hono HTTP services with explicit routing and edge discipline.
license: Apache-2.0
---

# hono-service

## Purpose

Implement Hono HTTP services with explicit routing, edge validation, and
predictable lifecycle. A service that validates late, leaks upstream
details, or hides its lifecycle fails in production; this skill disciplines
build so every route is declared, guarded, and provable.

## When to use

Use this skill when service code changes or is judged:

- `build`, for every change to Hono apps, routes, middleware, or the
  serve entrypoint.
- `build-review`, when checking route behavior against acceptance.

Skip it only for pure domain logic with no HTTP surface — and record the
skip with the paths checked.

## Inputs

- The changed routes, middleware, or entrypoint.
- The host's acceptance criteria and result contract.

## Output

Per-route verdicts: method and path, auth and validation behavior, and
the exact check that proves it (contract test against a spawned server).

## Procedure

- Declare one app per service (`new Hono()`), one handler per method and
  path (`app.all`, `app.get`, `app.post`); no wildcard handlers except
  protocol adapters (such as an MCP endpoint) that dispatch internally.
- Validate at the edge: parse and reject malformed input before touching
  domain code; return JSON bodies with explicit status codes
  (`c.json(body, status)`).
- Guard with the application's established authentication middleware; do not
  invent token validation. Compare static secrets in constant time where
  applicable and fail without echoing credentials or exposing identity oracles.
- Use the existing runtime adapter, such as `Bun.serve` for Bun services; keep
  per-request state in the request scope and close per-request resources
  in `finally`.
- Bound upstream calls with timeouts (`AbortSignal.timeout`) and pass
  through only whitelisted fields; error responses carry messages, never
  stacks, SQL, or credentials.
- Preserve the service's health endpoint contract without exposing internal
  dependency details publicly. Prove routes with contract tests, including
  authorization failures. Record commands, exit codes and reachable evidence.

## Verification

Check route methods, status codes, malformed bodies, authorization failures,
upstream timeouts and resource cleanup using the repository's test harness.
Distinguish in-process tests from actual transport or deployment evidence.

## Safety

Use this procedure only for an existing Hono service and only implement during
an authorized build stage. Do not introduce Bun or Hono to an unrelated stack,
start public listeners, expose credentials or call production dependencies.
