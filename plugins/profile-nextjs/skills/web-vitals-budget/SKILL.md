---
name: web-vitals-budget
description: Assess changed routes against explicit performance budgets and measurements.
license: MIT
---

# Web Vitals Budget

## Inputs
Changed routes, supplied performance budgets or baselines, repository measurement tools, and authorized results.

## Procedure
1. Identify performance-sensitive changes and applicable route-level metrics.
2. Use supplied budgets; if absent, report the missing decision rather than inventing targets.
3. Compare measured loading, stability, responsiveness, and size evidence to those budgets.

## Output
Stage-appropriate performance guidance, measurements, budget comparisons, and gaps. CodePatrol executor and host own state, gates, and artifacts.

## Verification
Record actual measurement commands, environment limits, and values for each claimed result.

## Safety
Do not claim improvement without measurement, access networks, or perform lifecycle operations.
