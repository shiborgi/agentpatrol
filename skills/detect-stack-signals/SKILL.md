---
name: detect-stack-signals
description: Select base and technical agents from repository stack signals.
license: Apache-2.0
---

# detect-stack-signals

## Purpose

Select the base and technical agents each Work needs from repository
signals, before anyone writes code. A Work opened with the wrong agents
either drags irrelevant skills into context or lacks the discipline it
needs; this skill disciplines planning so selection is evidence from
files, never a hunch — and costs nothing at build time.

## When to use

Use this skill when a Work is being planned:

- `plan`, for every Work, before opening producer tasks.

Skip it only when the plan explicitly reuses a prior Work's selection
unchanged — and cite that selection.

## Inputs

- The Work's touched paths (or proposed scope).
- Repository markers: `package.json` dependencies, framework configs,
  entrypoints, and task graphs.

## Output

A named selection per Work: the base agent, zero or more technical
agents, and the exact `--agents` string for Producer Open. A Work that
needs no technical agent records that negative explicitly.

## Rules

- Detect from files, never from memory. The signal table below is
  exhaustive; a signal not listed selects nothing until the table grows.
- One Work, one selection; split the Work before splitting the selection.
- Never silently fall back: without an explicit selection or a matching
  operation default, Producer Open remains a usage error.
- Defaults in `codepatrol.json` stay unchanged; this skill only advises
  the per-Work `--agents` string.
- Self-contained and in English; no external references.

## Signal table

| Signal (files present) | Technical skill | Open alongside base |
|---|---|---|
| `apps/*/next.config.*` or `app/{layout,page}.tsx` with `next` in dependencies | `nextjs-app-router` | `agentpatrol/nextjs-engineer@1.0.0` |
| `new Hono()` in service sources with `Bun.serve` entrypoint | `hono-service` | `agentpatrol/service-engineer@1.0.0` |
| `turbo.json` with `workspaces` and `bun.lock` on a cross-package Work | `bun-workspace` | additive to whichever engineer is open |
| MCP server sources (`apps/mcp/**`, MCP SDK dependency) on the Work | `mcp-server-standard` | `agentpatrol/mcp-engineer@1.0.0` once that agent ships; until then record the need and open `developer` |
| None of the above | — | base agent only; record "no technical agents" |
