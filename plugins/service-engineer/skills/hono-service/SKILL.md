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

## Rules

- Declare one app per service (`new Hono()`), one handler per method and
  path (`app.all`, `app.get`, `app.post`); no wildcard handlers except
  protocol adapters (such as an MCP endpoint) that dispatch internally.
- Validate at the edge: parse and reject malformed input before touching
  domain code; return JSON bodies with explicit status codes
  (`c.json(body, status)`).
- Guard with middleware: bearer checks compare in constant time, fail
  without echoing secrets, and never distinguish valid from invalid
  identities in ways an oracle could exploit.
- Serve with `Bun.serve({ port, hostname, fetch: app.fetch })`; keep
  per-request state in the request scope and close per-request resources
  in `finally`.
- Bound upstream calls with timeouts (`AbortSignal.timeout`) and pass
  through only whitelisted fields; error responses carry messages, never
  stacks, SQL, or credentials.
- Expose unauthenticated `GET /health` (plus dependency status where one
  exists) and prove every route with contract tests against a spawned
  server, including auth negatives. Record each verdict through
  `name-interaction-evidence`.
- Self-contained and in English; no external references.
