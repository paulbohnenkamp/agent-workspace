# Workspace Component Alias Standard

## Goal

Define and enforce a single, generic, one-to-one alias convention for workspace view components, then update the registry, `view.json` files, and docs/examples to use it.

## Related Roadmap Item

- `ROADMAP.md` tracker entry: 2.10 Workspace Component Alias Standard

## Context

- Workspace view authors discover usable components through `src/ComponentRegistry.tsx`.
- Any alias that can appear in `view.json` must be present in the registry.
- Current aliases are inconsistent in punctuation and domain scope, which makes view authoring harder to scan and reuse.

## Scope

### In scope

- Define the canonical alias standard for workspace components.
- Inventory the complete reusable component catalog and map each alias to exactly one component.
- Update `src/ComponentRegistry.tsx` to expose the canonical alias set.
- Update all `view.json` files to use the canonical aliases.
- Update docs and markdown examples that mention or demonstrate component aliases.
- Add guardrails so unknown or duplicate aliases fail clearly.

### Out of scope

- Reworking the rendering implementation of the components themselves unless needed for the alias migration.
- Changing unrelated workspace layout or interpreter behavior.
- Broad UI redesign.

## Implementation Steps

1. Define the alias rules: generic, short, dot-free or dot-used consistently, one-to-one, and view-safe.
2. Inventory all component aliases that should be supported in `view.json`, including layout, content, interaction, and status roles.
3. Refactor the registry and view JSON files to the canonical alias set.
4. Update README/docs/examples and add validation/tests to prevent alias drift.

## Acceptance Criteria

- `view.json` references use only registry-backed canonical aliases.
- Every supported alias is documented and discoverable from the registry.
- No component has multiple canonical aliases.
- No alias maps to multiple components.
- Docs and examples match the new standard.

## Verification

- `Unit tests:` existing workspace/view tests plus any alias validation tests
- `Integration tests:` repo lint/build and targeted workspace view smoke checks
- `Manual checks:` inspect `src/ComponentRegistry.tsx` and representative `view.json` files for consistency

## Status

- `done`

## Completion Notes

- Canonical aliases are now generic, registry-backed, and validated at view load time.
- Example views and design docs now use the canonical alias set.
- Duplicate alias registration now throws immediately.

## Outcome Summary

- Workspace views now use a short, generic alias vocabulary: `header`, `queue`, `summaryCard`, `timeline`, `composer`, `tabs`, `sources`, `statusList`, and `actions`.
- `loadView()` now rejects unknown aliases before rendering.
- A focused loader test covers both canonical views and a deliberately invalid alias.

## Tooling / Verification Notes

- Build tool: npm / TypeScript / ESLint
- Expected verification command: `npm run lint`, `npm run build:workspace`
- Current blocker, if any: none
