---
name: root-cause-first
description: Find the root cause before attempting a fix.
license: Apache-2.0
---

# root-cause-first

## Purpose

Find the root cause of a failure before attempting any fix. A fix applied to
a symptom hides the real problem and guarantees rework; this skill disciplines
diagnosis so the first fix is the right one.

## When to use

Use this skill whenever behavior is wrong:

- `build`, when verification fails or a test breaks.
- `build-review`, when diagnosing why a candidate was returned.

Use it especially when a fix seems obvious, when under time pressure, or when
an earlier fix did not work.

## Inputs

- The failing command and its full output.
- Access to recent history and the surrounding code.

## Output

A stated root cause and a minimal fix, plus a test that reproduces the failure.
No files are produced beyond the fix and its test.

## Rules

- **No fix before root cause.** Read the error completely — stack traces, line
  numbers, exit codes. Reproduce the failure consistently before theorizing.
  Check what recently changed: diffs, new dependencies, config, environment.
- **Gather evidence at boundaries.** In a multi-layer flow, log what enters and
  exits each layer once, run it, and locate the failing layer before touching
  anything.
- **Compare against working code.** Find similar code that works, read it
  completely, and list every difference before concluding.
- **One hypothesis at a time.** State it explicitly, test it with the smallest
  possible change, and verify. If it fails, form a new hypothesis — do not
  stack fixes.
- **Three failed fixes means stop.** Reconsider the approach or the design
  instead of attempting a fourth; say so rather than guessing.
- Never run lifecycle operations. Self-contained and in English; no external
  references.
