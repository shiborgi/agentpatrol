---
name: visual-regression-evidence
description: Require a screenshot artifact for every visual claim.
license: Apache-2.0
---

# visual-regression-evidence

## Purpose

Forbid visual claims without artifacts. A CSS refactor that passes unit
tests can still break the interface; this skill disciplines build
(capture) and build-review and ship (compare) so every visual outcome is
backed by an image a reviewer can inspect and re-capture.

## When to use

Use this skill when visuals change or are judged:

- `build`, when capturing the baseline for a changed surface.
- `build-review` and `ship`, when comparing the candidate against it.

Skip it only when the diff provably renders nothing different (logic,
copy, or aria-only changes) — and record the skip with the paths checked.

## Inputs

- The interaction claim and its baseline reference.
- The route and viewport the claim covers.

## Output

A named screenshot evidence entry: the claim, the route and viewport, the
artifact location, and the exact re-capture command. Record it through
`name-interaction-evidence` and `evidence-based-completion`.

## Rules

- One claim, one reproducible screenshot check; never bundle unrelated
  surfaces into a single capture.
- Capture with Playwright screenshots or an approved snapshot service and
  record the artifact location with the entry — a path or URI the reviewer
  can open, not a description.
- Never claim a visual pass without an artifact; a missing baseline fails
  review even when the code looks correct.
- Self-contained and in English; no external references.
