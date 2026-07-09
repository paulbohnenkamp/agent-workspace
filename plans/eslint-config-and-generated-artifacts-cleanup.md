# ESLint Config and Generated Artifacts Cleanup

## Goal

Remove the remaining ESLint warning and explicitly ignore generated schema artifacts so lint only targets authored source.

## Related Roadmap Item

- `ROADMAP.md` tracker entry: 2.9 ESLint Config and Generated Artifacts Cleanup

## Context

- `eslint.config.mjs` is currently loaded as ESM and triggers a Node module-type warning during lint runs.
- `packages/schemas/index.js` and related maps are generated outputs, not authored source.
- This cleanup keeps the repo's lint signal focused on real source files.

## Scope

### In scope

- Rename the ESLint config to an `.mjs` entrypoint to match Node's module handling.
- Add explicit ignores for generated schema artifacts.
- Verify lint and build still pass.

### Out of scope

- Changing lint rules.
- Regenerating schemas.
- Broad package source cleanup.

## Implementation Steps

1. Rename the ESLint config to an ESM file and update any references.
2. Add explicit ignores for generated schema outputs.
3. Run lint and build verification.

## Acceptance Criteria

- `npm run lint` passes without the module-type warning.
- Generated schema artifacts are explicitly ignored by lint.
- Existing build verification still passes.

## Verification

- `Unit tests:` existing tests are unaffected
- `Integration tests:` `npm run lint`, `npm run build:workspace`
- `Manual checks:` confirm the generated schema files are excluded from lint scope

## Status

- `done`

## Completion Notes

- Renamed the ESLint config to `eslint.config.mjs` to eliminate the Node module warning.
- Added explicit ignores for generated schema artifacts in `packages/schemas`.
- Verified with `npm run lint` and `npm run build:workspace`.

## Outcome Summary

- Lint now runs without the module warning, and generated schema artifacts are explicitly excluded from the lint surface.

## Tooling / Verification Notes

- Build tool: npm / ESLint / TypeScript
- Expected verification command: `npm run lint`
- Current blocker, if any: none
