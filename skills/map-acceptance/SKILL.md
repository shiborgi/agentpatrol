---
name: map-acceptance
description: Map each supplied acceptance criterion to planned work and evidence.
license: MIT
---

# Map Acceptance

## Inputs
Supplied acceptance criteria or identifiers, proposed work, and verification approach.

## Procedure
1. Preserve supplied criteria and identifiers exactly.
2. Map every criterion to one or more bounded changes and observable checks.
3. Flag unmapped criteria, unsupported work, and missing evidence.

## Output
Stage-appropriate coverage map and gaps. CodePatrol executor and host own state, gates, and artifacts.

## Verification
Confirm every supplied criterion is mapped and no map entry introduces an unsupported criterion.

## Safety
Do not mint host identifiers, mutate files, access networks, or perform lifecycle operations.
