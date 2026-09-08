---
name: visual-regression-evidence
description: Require inspectable visual evidence for changed and newly built rendered outcomes.
license: MIT
---

# Visual Regression Evidence

## Inputs
Changed or newly added visual surface, relevant route and viewport, baseline
when available, and authorized capture tools.

## Procedure
1. Identify the surfaces that need rendered evidence. A surface qualifies when a
   visual claim is made about it **and** when it is new or restructured — a new
   surface has no baseline and no prior claim, which is exactly why nothing
   otherwise forces anyone to look at it before it ships.
2. Capture or inspect a reproducible artifact for each relevant surface and
   viewport.
3. Compare the artifact to accepted expectations or a supplied baseline. Where
   neither exists, review the artifact against the stated design direction and
   record that judgement as the first baseline.
4. When the working environment cannot render — no browser, no capture tool —
   state that plainly, name what was verified instead (build, tests, generated
   output), and mark the appearance unverified. Do not let structural checks
   stand in for having looked.

## Output
Stage-appropriate visual evidence references, comparison findings, and
limitations, including any surface whose appearance could not be observed.
CodePatrol executor and host own state, gates, and artifacts.

## Verification
Confirm every visual claim has an inspectable artifact and a reproducible
capture context, and that every new or restructured surface has either an
artifact or an explicit unverified note naming why.

## Safety
Do not store sensitive content in artifacts, access networks, or perform
lifecycle operations. Never describe an appearance that was not observed.
