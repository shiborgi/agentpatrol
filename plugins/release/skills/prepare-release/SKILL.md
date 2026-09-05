---
name: prepare-release
description: Prepare a release-readiness report without performing release operations.
license: Apache-2.0
---

# Prepare Release

## Inputs
Reviewed changes, recorded verification, intended version, packaging configuration,
release notes, known risks and any explicit operator approval supplied by the host.

## Procedure
1. Confirm required stage reviews and real verification evidence are present.
2. Check version consistency, distributable contents and installed-package behavior.
3. Describe compatibility impact, operational risks and recovery steps.
4. Separate technical readiness from explicit human authorization to release.
5. Return blockers or a handoff; leave release execution to the host and operator.

## Output
Readiness assessment, artifact identities, verification references, unresolved
blockers, recovery guidance and the status of separately supplied human approval.

## Verification
Check package metadata and evidence against the exact candidate. Confirm that
release notes describe actual behavior and that credentials are not packaged.

## Safety
Do not publish, push, deploy, tag or mutate host state. A passed check or selected
release persona does not grant permission. Never fabricate missing human approval.
