---
name: map-acceptance
description: Trace every acceptance ID through plan steps with no orphans.
license: Apache-2.0
---

# map-acceptance

## Purpose

Make coverage mechanical. A plan that talks about the work without naming
every acceptance ID is not covering it; this skill maps each host ID onto
steps and refuses orphans.

## When to use

Use this skill when a Plan is written or reviewed:

- `plan`, before submitting, for every Work in the Wave.
- `plan-review`, when judging whether steps cover the Wave's acceptance.

Skip it only when the plan already lists every host acceptance ID on at least
one step and lists no unknown IDs.

## Inputs

- The Wave's Works and their host-assigned acceptance IDs.
- The draft plan steps.

## Output

For each Work, an ordered step list in which every step names one or more
acceptance IDs, every host ID appears at least once, and no ID is invented.
No other files are produced.

## Rules

- **Host IDs only.** Copy acceptance IDs from the host Works. Do not mint,
  rename, or paraphrase them.
- **Cover every ID.** Each host ID appears in at least one step of its Work.
  A missing ID is a defect, not an implication.
- **No orphan steps.** A step without an acceptance ID does not belong.
- **No unknown IDs.** An ID that is not on the host Work is a defect.
- **Keep the Work boundary.** Do not attach one Work's IDs to another Work's
  steps.
- Never edit product code and never run lifecycle operations. Self-contained
  and in English; no external references.
