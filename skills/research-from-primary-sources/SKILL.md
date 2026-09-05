---
name: research-from-primary-sources
description: Gather facts from primary sources only.
license: Apache-2.0
---

# research-from-primary-sources

## Purpose

Gather external facts against primary sources so a decision is built on what
owns the truth, not on a second-hand write-up of it. Secondary accounts inherit
their errors; this skill follows every claim back to its owner.

## When to use

Use this skill when a step needs facts it does not already have:

- `spec`, when the intent depends on an API contract or a runtime behavior.
- `plan`, when a decision depends on a cost, a limit, or a documented guarantee.

Skip it when the facts are already in the repository or in the operator's own
domain knowledge.

## Inputs

- The question to answer.
- The candidate sources for the answer.

## Output

A single findings note, saved with the project's documents, with every claim
cited to the source that owns it. No design decision is made — only facts are
gathered.

## Rules

- **Primary sources only.** Official documentation, the source code itself,
  specifications, and first-party APIs — never secondary write-ups of them.
- **Follow the claim to its owner.** For every claim, record the source that
  owns it, not the place that repeated it.
- **Cite each claim.** The findings note cites its source for every statement;
  an uncited claim does not belong in the note.
- **Documents only.** Match the repository's existing note convention; if none
  exists, write under `CONTEXT.md` or a sibling document and say where. Never
  edit product code, tests, or generated files.
- **Prefer the owner on conflict.** When sources disagree, prefer the one that
  owns the claim and record the conflict rather than silently picking one.
- This skill gathers facts; it never makes the design decision and never runs
  lifecycle operations. Self-contained and in English; no external references.
