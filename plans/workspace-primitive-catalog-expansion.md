# Workspace Primitive Catalog Expansion

## Goal

Expand the workspace component registry from the earlier 13-item generic catalog into a fuller primitive and composite catalog so authors can discover the broad reusable authoring surface in one place.

## Related Roadmap Item

- `ROADMAP.md` tracker entry: 2.12 Workspace Primitive Catalog Expansion

## Context

- The registry is now generic, but it still only exposes a small subset of the broader workspace surface.
- Workspace authors need to see layout primitives, shell roles, and reusable content primitives together.
- The registry should continue to act as the single source of truth for what `component` values are valid in `view.json`.

## Scope

### In scope

- Inventory the broader primitive vocabulary, including shell, layout, container, and content primitives.
- Add generic registry entries for the missing primitives.
- Keep all component and alias names generic, short, and reusable.
- Update any docs/examples/tests that should demonstrate the expanded catalog.

### Out of scope

- View-specific rendering branches.
- Broad visual redesign.
- Reworking the interpretation pipeline unless the expanded catalog requires it.

## Implementation Steps

1. Identify the reusable primitives the workspace authoring model should expose.
2. Add the missing primitives to `src/ComponentRegistry.tsx` and any supporting styles/helpers.
3. Update docs/examples/tests so the expanded registry is the authoritative catalog.

## Acceptance Criteria

- The registry exposes a materially broader generic primitive catalog than the current 13 entries.
- Authors can discover layout and content primitives in one place.
- No component names or aliases are workspace/view-specific.
- Docs and example views reflect the expanded catalog.

## Verification

- `Unit tests:` registry and loader coverage for the expanded primitive catalog
- `Integration tests:` `npm run lint`, `npm run build:workspace`, `npm test -- --runInBand`
- `Manual checks:` inspect the registry, docs, and example views for generic and complete primitive coverage

## Status

- `done`

## Completion Notes

- Split `src/ComponentRegistry.tsx` into a thin registry and moved every workspace primitive/composite into `src/components/*.tsx`.
- Expanded the canonical catalog to include shell/layout/content primitives alongside the existing composites.
- Updated docs, example references, and loader coverage so the registry is the obvious source of truth.

## Outcome Summary

- Workspace authors now discover the component catalog in the registry while implementations live one-per-file under `src/components/`.

## Tooling / Verification Notes

- Build tool: npm / TypeScript / ESLint
- Expected verification command: `npm run lint`, `npm run build:workspace`, `npm test -- --runInBand`
- Current blocker, if any: none
