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

## Procedure

- Place routes in `app/` with `layout.tsx` for shared shell and `page.tsx`
  per segment; colocate `loading.tsx`, `error.tsx`, and `not-found.tsx`
  where the plan requires those states.
- Inspect the installed Next.js version and caching mode before choosing
  segment configuration. Use static rendering where requirements permit;
  do not force the whole tree dynamic for one dynamic leaf. Verify defaults
  rather than assuming they are stable across framework versions.
- Keep Server Components free of client hooks and `"use client"` boundaries
  minimal and explicit; client state (`useState`, `useEffect` fetches)
  lives below the boundary, never above it.
- Use static metadata or `generateMetadata` as the route requires.
- Configure `transpilePackages`, deployment output and development origins
  only when needed and supported by the installed version. Environment reads
  for secrets stay server-side; never add a secret-bearing client fallback.
- Prove rendering with the repo's own runners: `tsc --noEmit`, RTL unit
  tests for segment behavior, `next build` for static/dynamic assignment,
  Playwright specs for flows. Record each command, exit code and reachable
  artifact with the route verdict.

## Verification

Confirm rendering and caching behavior against the installed version using
the repository's build and route tests. Exercise loading, error, navigation,
hydration and mobile/desktop states; report checks that could not run.

## Safety

Apply changes only in an authorized implementation stage; otherwise plan or
review these decisions. Do not expose server credentials, introduce a framework
upgrade, deploy or assume that a selected profile grants execution permission.
