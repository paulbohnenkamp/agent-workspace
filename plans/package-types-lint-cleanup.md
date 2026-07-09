# Package Types Lint Cleanup

## Goal

Normalize `packages/types` to the repository's current TypeScript conventions so the core type model stops generating avoidable lint noise.

## Related Roadmap Item

- `ROADMAP.md` tracker entry: 2.7 Package Types Lint Cleanup

## Context

- `packages/types/src/*.ts` accounts for a large share of the repo's lint backlog.
- The package defines the shared type model used by loaders, runtime code, and workspace rendering.
- Cleaning it first gives us the best leverage for the next lint pass without scattering changes across unrelated packages.

## Scope

### In scope

- Replace `interface` declarations with `type` aliases where the repo's lint rule expects that shape.
- Remove or narrow `any` usage in `packages/types/src/*`.
- Keep changes behavior-preserving and focused on type declarations.

### Out of scope

- Broad runtime logic changes in `packages/loader`, `packages/runtime`, or `packages/tools`.
- Architecture or vocabulary changes.
- Package layout changes beyond the type cleanup itself.

## Implementation Steps

1. Audit the `packages/types/src` lint errors and group them by file and pattern.
2. Refactor the shared type declarations to match the current lint conventions.
3. Re-run focused lint on `packages/types` and then a broader repo lint check to measure remaining debt.

## Acceptance Criteria

- `packages/types/src` no longer produces lint errors from the current convention set.
- The shared type package still compiles and exports the same public concepts.
- Remaining lint debt is clearly isolated to other packages.

## Verification

- `Unit tests:` existing package tests that depend on `packages/types`
- `Integration tests:` `npx eslint packages/types`
- `Manual checks:` inspect the package exports and any downstream type imports if needed

## Status

- `done`

## Completion Notes

- Replaced `interface` declarations with `type` aliases across `packages/types`.
- Replaced `any` with `unknown` or `Record<string, unknown>` in the shared type model.
- Verified the package with `npx eslint packages/types/src`.

## Outcome Summary

- `packages/types` no longer contributes lint errors, and the remaining lint backlog is isolated to the other packages.

## Tooling / Verification Notes

- Build tool: npm / TypeScript / ESLint
- Expected verification command: `npx eslint packages/types`
- Current blocker, if any: none
