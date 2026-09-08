---
name: design-system-discipline
description: Keep UI changes inside one coherent token and component system.
license: MIT
---

# design-system-discipline

## Purpose

Keep interface changes inside one coherent system of tokens and components, so
the product looks like one product. Layout decay is rarely one bad screen: it
is a theme layer that overrides a component's meaning, a hard-coded colour that
ignores the theme, a variant that no longer differs from the default. Each is
small; together they produce a surface nobody wants to touch. This skill makes
those specific failures reviewable.

## When to use

Use this skill when interface code, tokens or component wrappers change:

- `build`, for changes to components, styles, themes or design tokens.
- `build-review`, when judging whether a change fits the existing system.
- `plan`, when a change proposes a new component, token or theme layer —
  decide then whether it belongs in the system or is a one-off.

## Inputs

- The token definitions (theme variables) and the component library in use.
- The changed components and the surfaces that render them.
- Any stated visual reference or design direction.

## Output

Per-change verdicts: which tokens and components were used, any value written
outside the token system, and evidence that the result is legible in every
supported theme.

## Procedure

- Take colour, spacing, radius and type from tokens. A literal colour in a
  component is a defect unless the token system genuinely cannot express it,
  and then the fix is a token.
- Define every token for every supported theme. A value defined only inside a
  dark block leaves the light theme falling back to whatever the browser
  chooses.
- Check wrapper layers for meaning they destroy. A decorative wrapper that
  overrides a component's variants — mapping `destructive` and `outline` onto
  the same background as `default` — removes the distinction the variant
  exists to communicate, and usually breaks contrast too by changing a
  background without changing the paired foreground. If a wrapper flattens
  variants, that is the finding.
- Keep one visual idea per surface rather than layering a second one on top of
  a working library. A theme applied as an extra wrapper around each component
  costs a whole indirection layer and is where variant meaning gets lost;
  prefer retuning the tokens the library already reads.
- Reserve the accent for the primary action; if everything is accented, nothing
  is. Signal state with a label as well as a colour.
- Set dense numeric data in tabular figures so columns align, and keep type
  sizes legible at the smallest supported viewport.
- Prefer removing a decorative layer over adding another to compensate for it.

## Verification

Render the changed surface in every supported theme and at the smallest,
middle and largest supported viewport, and report what was actually observed —
a build succeeding is not evidence of a layout. Run the project's automated
accessibility check with contrast enabled, not disabled. Confirm each variant
of a changed component still renders distinguishably from the others. Check no
new literal colour values were introduced outside the token definitions.

## Safety

Only change interface code during an authorized build stage. Do not restyle
surfaces outside the requested scope, do not remove an accessibility
affordance (focus ring, accessible name, reduced-motion handling) to achieve a
visual result, and do not disable an accessibility check to make it pass —
report the violation instead.
