---
name: minimal-implementation
description: Prefer the smallest safe change that satisfies observed requirements.
license: MIT
---

# Minimal Implementation

## Inputs
Approved scope, acceptance criteria, relevant code, and repository conventions.

## Procedure
1. Inspect the actual flow and existing reuse options.
2. Prefer no change, existing code, platform capabilities, or installed dependencies before new abstractions.
3. Limit edits to behavior required by acceptance while retaining validation, security, and accessibility.

## Output
Stage-appropriate implementation guidance or changed-path evidence, including deliberate limits. CodePatrol executor and host own state, gates, and artifacts.

## Verification
Confirm each changed element supports acceptance and no speculative interface or abstraction was added.

## Safety
Preserve unrelated work. Do not install dependencies, access networks, or perform lifecycle operations.
