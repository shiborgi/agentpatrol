---
name: nextjs-app-router
description: Implement Next.js App Router surfaces with correct rendering semantics.
license: Apache-2.0
---

# nextjs-app-router

## Purpose

Implement Next.js App Router surfaces with the correct rendering semantics
for each route. A route with the wrong segment config ships stale data or
needless dynamism; this skill disciplines build so routing, rendering, and
configuration choices match the plan.

## When to use

Use this skill when App Router code changes or is judged:

- `build`, for every change under `app/`, `next.config.*`, or framework
  data-fetching code.
- `build-review`, when checking rendering behavior against acceptance.

Skip it only for framework-agnostic UI work (pure presentational
components with no routing, fetching, or config involvement) — and record
the skip with the paths checked.

## Inputs

- The changed routes, segments, or configuration.
- The host's acceptance criteria and result contract.

## Output

Per-route rendering verdicts: the segment, the chosen semantics
(static, dynamic, forced), and the exact check that proves it
(typecheck, unit test, `next build` output, or Playwright spec).

## Rules

- Place routes in `app/` with `layout.tsx` for shared shell and `page.tsx`
  per segment; colocate `loading.tsx`, `error.tsx`, and `not-found.tsx`
  where the plan requires those states.
- Declare rendering per segment: default static where possible,
  `export const dynamic = "force-dynamic"` only where the route reads
  uncacheable request data; never force the whole tree dynamic for one
  dynamic leaf.
- Keep Server Components free of client hooks and `"use client"` boundaries
  minimal and explicit; client state (`useState`, `useEffect` fetches)
  lives below the boundary, never above it.
- Export `metadata` from segments that need titles and descriptions;
  keep it serializable and static.
- Declare workspace packages in `transpilePackages`, deployment shape in
  `output: "standalone"`, and dev origins in `allowedDevOrigins`;
  environment reads stay server-side (`process.env` in server code) with
  client-safe fallbacks where the plan requires them.
- Prove rendering with the repo's own runners: `tsc --noEmit`, RTL unit
  tests for segment behavior, `next build` for static/dynamic assignment,
  Playwright specs for flows. Record each verdict through
  `name-interaction-evidence`.
- Self-contained and in English; no external references.
