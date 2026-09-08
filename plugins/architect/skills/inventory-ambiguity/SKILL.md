---
name: inventory-ambiguity
description: Keep material unknowns visible rather than resolving them by guesswork.
license: MIT
---

# Inventory Ambiguity

## Inputs
Task request, supplied context, current proposal, and known assumptions.

## Procedure
1. List unanswered questions that affect behavior, scope, risk, or verification.
2. Explain why each question matters and the smallest provisional assumption, if needed.
3. Remove only questions resolved by supplied evidence.

## Output
Stage-appropriate ambiguity guidance with questions, impact, and labeled assumptions. CodePatrol executor and host own state, gates, and artifacts.

## Verification
Confirm no material assumption is presented as a fact and no settled question remains listed.

## Safety
Do not guess answers, mutate files, access networks, or perform lifecycle operations.
