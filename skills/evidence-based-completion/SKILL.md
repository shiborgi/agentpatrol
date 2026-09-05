---
name: evidence-based-completion
description: Require fresh evidence before any completion claim.
license: Apache-2.0
---

# evidence-based-completion

## Purpose

Ground every completion claim in fresh evidence. A claim is only as good as
the command output behind it; this skill disciplines when a step may declare a
Work done, fixed or passing.

## When to use

Use this skill before any claim of completion:

- `build`, before claiming `continue`.
- `build-review`, when judging whether a candidate meets its acceptance.
- `ship`, before declaring acceptance.

Use it always, not just for the hard cases.

## Inputs

- The claim being made (done, fixed, passing, requirements met).
- The verification command and its fresh output.
- The Work's acceptance criteria, including host-assigned IDs when present.

## Output

A claim together with its evidence: the command run, its exit code, and the
relevant output. When the host supplies acceptance IDs, one status per ID in
host order. No files are produced.

## Rules

- **Evidence before claims.** Identify the command that proves the claim, run
  it fresh in the same step, read the full output, and check the exit code —
  then state the claim with the evidence attached.
- **No hedged claims.** Words such as "should", "probably" or "seems to" are
  not evidence and do not count as completion.
- **Fresh, not remembered.** A previous run or a partial check proves nothing;
  run the full command again.
- **Walk the acceptance criteria in host order.** Before declaring a Work
  complete, go through every acceptance criterion the host listed, in that
  order. For each ID record `passed` or `failed`, the command that proves it,
  the exit code, and a one-line summary of the output. Do not skip, merge, or
  reorder IDs.
- Never run lifecycle operations. Self-contained and in English; no external
  references.
