---
name: preserve-access-paths
description: Keep every observable access path intact while changing behavior.
license: Apache-2.0
---

# preserve-access-paths

## Purpose

Ensure a behavior change does not silently break any observable way an
operator reaches the interaction. An access path that regresses without a
test is a defect; this skill disciplines build changes so access paths stay
available and testable.

## When to use

Use this skill while implementing or reviewing a behavior change:

- `build`, before and after changing interaction behavior.
- `build-review`, when judging whether a change dropped an access path.

Skip it only for interactions with no observable external access path.

## Inputs

- The interaction's existing access paths.
- The change being made to the interaction behavior.

## Output

A confirmed set of access paths that remain reachable, each backed by an
observation that it still works after the change.

## Rules

- Enumerate the access paths before making a change; do not assume them.
- After the change, verify every enumerated path still reaches the behavior.
- Name the lifecycle stage affected by the change.
- Keep one concern per change; do not widen scope to unrelated paths.
- Treat a broken access path as a regression even if the new behavior is
  otherwise correct.
- Self-contained and in English; no external references.
