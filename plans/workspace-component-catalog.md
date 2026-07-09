# Workspace Component Catalog

## Goal

Make `src/ComponentRegistry.tsx` the single authoritative catalog of all reusable `component` values that can appear in workspace `view.json` files, with generic names only and no workspace/view-specific component names.

## Related Roadmap Item

- `ROADMAP.md` tracker entry: 2.11 Workspace Component Catalog

## Context

- The current registry only exposes a partial set of components.
- Workspace authors need one place to discover everything they can use in `view.json`.
- Both the registry aliases and the underlying React component names should be generic.
- The registry should cover primitives, layout roles, and reusable composites, not just the first components we happened to implement.

## Scope

### In scope

- Inventory every reusable workspace primitive and composite component we want to support in `view.json`.
- Rename any workspace/view-specific component implementations to generic names.
- Expand `src/ComponentRegistry.tsx` into the canonical source of truth for all supported component aliases.
- Keep alias names short, generic, and one-to-one with registered components.
- Update examples and docs to match the expanded catalog.
- Add or update tests so unknown aliases and missing registry entries fail clearly.

### Out of scope

- Broad visual redesign.
- Unrelated workspace layout changes.
- Changing the interpretation pipeline unless needed to support the catalog.

## Implementation Steps

1. Inventory the full workspace component vocabulary, grouped by primitives, layout roles, and composites.
2. Rename any workspace-specific component implementations to generic names.
3. Update the registry so it exposes the full catalog as the canonical source of truth.
4. Update examples/docs and add validation/tests to keep the registry and `view.json` usage aligned.

## Acceptance Criteria

- `src/ComponentRegistry.tsx` is the canonical place to discover supported workspace component values.
- The registry contains the full set of reusable workspace primitives and composites we intend authors to use.
- No registered component names are workspace- or view-specific.
- `view.json` examples use only registry-backed canonical aliases.
- Docs explain what each alias is for and how to use it.

## Verification

- `Unit tests:` registry and view-loader coverage for alias resolution
- `Integration tests:` `npm run lint`, `npm run build:workspace`, `npm test -- --runInBand`
- `Manual checks:` inspect the registry catalog and sample views for generic naming and completeness

## Status

- `done`

## Completion Notes

- Registry now exposes generic primitives and composites as the canonical authoring catalog.
- Workspace-specific component names were renamed to generic ones.
- Docs/examples and loader tests were updated to cover the expanded catalog.

## Outcome Summary

- `src/ComponentRegistry.tsx` is now the single registry-backed catalog for workspace view components, with generic primitive and composite aliases plus regression coverage.

## Tooling / Verification Notes

- Build tool: npm / TypeScript / ESLint
- Expected verification command: `npm run lint`, `npm run build:workspace`, `npm test -- --runInBand`
- Current blocker, if any: none
