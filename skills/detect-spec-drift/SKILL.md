---
name: detect-spec-drift
description: Return a candidate when the diff does not match acceptance or plan.
license: Apache-2.0
---

# detect-spec-drift

## Purpose

Treat the diff as a claim about the spec. Code that passes tests while
implementing a different change is still drift; this skill matches candidate
behavior to acceptance IDs and plan steps.

## When to use

Use this skill on `build-review` after fresh verification evidence is in
hand. Skip it when the candidate has no diff.

## Inputs

- The candidate diff.
- The selected Plan and the Wave's acceptance IDs.
- Fresh verification output.

## Output

For each drifted acceptance ID or plan step: the ID or step, what the spec or
plan required, what the diff actually does, and a citation. No files are
produced.

## Rules

- **Walk every acceptance ID.** An ID with no corresponding change and no
  evidence that current code already satisfied it is missing behavior.
- **Walk the plan steps.** A change that matches no step is extra. A step
  with no matching change is incomplete.
- **Passing verification is not coverage.** A green command that does not
  speak to an ID does not clear that ID.
- **Cite the ID on return.** When recommending return, name the drifted
  acceptance IDs. Do not paraphrase them away.
- **Do not rewrite.** Do not patch the candidate or the plan. Report drift
  only.
- Never run lifecycle operations. Self-contained and in English; no external
  references.
