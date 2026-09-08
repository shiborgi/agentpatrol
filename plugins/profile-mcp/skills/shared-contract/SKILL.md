---
name: shared-contract
description: Keep multiple delivery surfaces on one validated contract instead of parallel copies.
license: MIT
---

# shared-contract

## Purpose

Keep every surface that exposes the same capability — HTTP API, agent protocol,
background worker, client — parsing and emitting through one shared, validated
contract. When each surface owns its own copy of a shape, the copies agree on
the day they are written and drift silently afterwards: a field is normalised
in one and not the other, a rule is tightened on one path only, and the two
answers to the same question stop matching. This skill treats duplicated
serialization or validation logic as a defect in itself, before it produces a
visible bug.

## When to use

Use this skill when a change touches more than one surface, or adds one:

- `plan`, when deciding where a new shape lives.
- `build`, whenever request/response shapes, serialization or validation change.
- `build-review`, when checking that surfaces still agree.

## Inputs

- The surfaces that expose the capability and the module they share.
- The validation library and version in use.
- The acceptance criteria describing the external shape.

## Output

Per-shape verdicts: where the schema is defined, which surfaces parse through
it, and the check that proves two surfaces return the same answer for the same
input.

## Procedure

- Define the shape once, in a module both surfaces already depend on, and have
  each surface import it. If two surfaces cannot share a module, that is an
  architectural finding to report, not a licence to copy.
- Parse at the boundary and emit through the same schema, so an
  invalid response fails at the surface that produced it rather than at the
  consumer.
- Put the normalisation of persisted values — identifiers to strings, exact
  numerics to strings, timestamps to a single encoding — in one function beside
  the schema. Duplicated normalisation is the most common source of surfaces
  that disagree by one field.
- Keep validation rules in the schema rather than re-implementing them in each
  handler; a handler that re-checks what the schema already rejects will
  eventually check something different.
- When one surface needs a subset or an extension, derive it from the shared
  schema rather than restating it.
- Pin one major version of the validation library across the workspace.
  Two majors of the same library in one dependency graph produce types that
  look compatible and are not.
- Treat "an equivalent exists on the other surface" as part of the definition
  of done for any new capability, and say explicitly when a surface is
  deliberately excluded.

## Verification

Run the same logical request through each surface and compare the normalised
results for equality — this is the check that actually catches drift. Assert
that an invalid payload is rejected identically everywhere. Grep for the shape's
field names across surfaces to find copies that no longer import the shared
definition.

## Safety

Only change contracts during an authorized stage. Widening a schema is
additive; narrowing one, renaming a field or changing an encoding breaks
existing consumers, so report it as a compatibility decision with the affected
surfaces named rather than performing it silently.
