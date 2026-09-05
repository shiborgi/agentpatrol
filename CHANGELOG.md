# Changelog

## 1.0.0

Initial public release.

- Provide architect, developer, qa and release lifecycle personas.
- Provide orthogonal general, react, python, mcp, nextjs and service profiles.
- Implement exact Patrol 1.0 catalog/resolve requests and responses, deterministic
  composition and complete recursively key-sorted response digests.
- Require catalog `contentDigest` over all active descriptors, instructions and raw
  skill assets; reuse it as resolved `catalogDigest` from the same loaded snapshot
  so same-version content changes invalidate host learning.
- Make active IDs explicit; undeclared authoring is never discovered automatically.
- Publish self-contained skills-only Agent Plugins 1.0.0 packs, with AgentPatrol
  persona/profile metadata under the `io.shiborgi.agentpatrol` extension.
- Add bounded JSON stdin, strict request validation, containment and symlink checks,
  no-deletion builds, source validation and read-only drift checks.
- Export the Node.js 22+ dependency-free ESM library and a five-command CLI.
- Add isolated test fixtures and an offline installed-package smoke check.
- Use portable PATH-based Patrol providers; omit model execution and MCP launching.
- Keep specialist authoring outside the active catalog and distribution while
  supporting equivalent composition through personas and profiles.
