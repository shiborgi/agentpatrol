---
name: layout-composition
description: Compose page structure, density and navigation that fit the content they carry.
license: MIT
---

# layout-composition

## Purpose

Decide how a surface is arranged: its regions, the shape of its navigation, the
rhythm of its spacing, and how dense its content is allowed to be. This is
distinct from tokens and from breakage. A page can use every token correctly,
clip nothing at any viewport, pass every accessibility check, and still be
unusable because twelve destinations were put in a horizontal tab strip, or
because everything on it has equal weight and the eye has nowhere to land.
Those are composition failures, and nothing catches them by accident.

## When to use

Use this skill when a surface's structure changes or is judged:

- `plan`, when a new surface, section or navigation destination is proposed —
  the shape is cheapest to change before it is built.
- `build`, for changes to page shells, navigation, grids or spacing.
- `build-review`, when judging whether an arrangement fits its content.

## Inputs

- The surface's regions and the content each carries.
- The full set of navigation destinations, including the ones planned next.
- The spacing, sizing and type scales available as tokens.
- Any stated visual reference or direction.

## Output

Per-surface verdicts: the chosen structure and why it fits this content, the
navigation shape against the destination count, and the rendered evidence at
each supported viewport.

## Procedure

- Name the regions before arranging them: what is persistent chrome, what is
  the current view, what is contextual to a selection. A region that carries no
  content of its own is scaffolding to remove.
- Match the navigation shape to the number of destinations and how they grow. A
  horizontal strip stops working once its items wrap or scroll; a list in a
  persistent rail carries far more and shows current position without
  truncating. Count the destinations the surface will have after the next
  planned addition, not just today's.
- Group destinations by what they are and label the groups. An undifferentiated
  list of a dozen items makes the reader scan all of them every time.
- Establish one hierarchy per view: the primary object, its supporting figures,
  then its detail. If everything is the same size and weight, nothing is
  emphasised, and the surface reads as noise however clean its parts are.
- Take spacing from the scale and use rhythm to group. Related things sit
  closer than unrelated things; that proximity does more grouping work than
  borders or boxes, which should be spent sparingly.
- Choose a density suited to the content. Dense tabular data wants tight rows
  and small type; a form wants room. Applying one density everywhere makes half
  the product wrong.
- Constrain measure: long prose lines get a maximum width, wide tables scroll
  within their own container rather than pushing the page sideways.
- Design the states the content will actually be in — empty, one item, very
  many, and a value far longer than the example. A layout verified only against
  convenient fixture data is unverified.
- When a visual reference is given, extract its concrete rules — structure,
  palette, spacing scale, type sizes and weights, border and radius treatment —
  and record them as the target. "Like that product" is not implementable and
  cannot be reviewed; the extracted rules can.

## Verification

Render every changed surface and look at it, at each supported viewport, and
report what was observed rather than that the build succeeded. Check the
navigation with the real destination count, and each view with empty, minimal
and overflowing content. Confirm the primary element of each view is
identifiable at a glance. Where rendering is not possible in the working
environment, say so explicitly and mark the composition unverified rather than
implying it was reviewed.

## Safety

Only restructure surfaces during an authorized stage, and only the surfaces in
scope — a layout change that touches every screen is a much larger change than
it looks. Do not remove navigation paths, keyboard operability or accessible
names to achieve an arrangement, and do not delete content to make a layout fit;
report the tension instead.
