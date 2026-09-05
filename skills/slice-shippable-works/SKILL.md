---
name: slice-shippable-works
description: Split intent into independently shippable Works with real blockers.
license: Apache-2.0
---

# slice-shippable-works

## Purpose

Turn refined intent into the smallest independently shippable slices. A Work
that cannot land without its siblings is not a slice; this skill keeps Waves
and `blockedBy` honest.

## When to use

Use this skill when an Initiative's Waves and Works are being shaped:

- `spec`, after intent is classified and hot spots (if any) are named.

Skip it when the request is already a single bounded Work with no blockers.

## Inputs

- The refined intent and residual unknowns.
- An optional hotspot list from `scope-hotspots`.

## Output

Keyed Waves, each containing keyed Works. Every Work has a description, at
least one acceptance statement, and a `blockedBy` list of Work keys. No other
files are produced.

## Rules

- **Independently shippable.** Each Work could be accepted on its own without
  leaving the repository half-finished. If two slices only make sense
  together, they are one Work.
- **Waves are sequential; Works inside a Wave are not.** Put a Work in a
  later Wave only when it truly cannot start until the earlier Wave is
  accepted. Do not invent Waves for narrative grouping.
- **`blockedBy` is a real key.** Every blocker is a Work key in this
  Initiative. Empty means none. Never block on a Wave, a file, or a hope.
- **Smallest covering set.** Prefer fewer Works that still isolate distinct
  acceptance. Do not split by file, layer, or ceremony.
- **No how.** Descriptions say what the slice delivers, not which modules,
  types, or refactors will do it.
- Never edit product code and never run lifecycle operations. Self-contained
  and in English; no external references.
