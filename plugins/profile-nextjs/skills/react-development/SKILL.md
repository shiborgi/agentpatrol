---
name: react-development
description: Develop and assess React interfaces with explicit state and accessible behavior.
license: Apache-2.0
---

# React Development

## Inputs
Active persona and stage, acceptance criteria, installed React/framework versions,
component boundaries, design conventions and existing test runners.

## Procedure
1. Identify state ownership, server/client boundaries and asynchronous transitions.
2. Prefer derived values over mirrored state and stable keys over array positions.
3. Keep effects for external synchronization; handle cleanup and stale requests.
4. Preserve the design system and implement loading, empty, error and focus states.
5. Exercise keyboard, screen-reader semantics and desktop/mobile interactions.
6. In planning or review stages, assess these choices rather than modifying code.

## Output
Stage-appropriate component decisions or changes, interaction coverage, concrete
test outcomes and any rendering, accessibility or performance gaps.

## Verification
Use the repository's component tests and browser checks for real user flows.
Check console errors, hydration, focus and responsive layouts when applicable.
Measure performance before introducing memoization or claiming improvement.

## Safety
Do not introduce a new UI system, framework API or dependency without need.
Never expose server secrets to client bundles or render untrusted HTML without
the application's established sanitization. Do not infer visual testing from unit tests.
