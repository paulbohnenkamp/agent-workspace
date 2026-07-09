# Root `src/` Layout Migration

## Goal

Move repository-owned runtime/source code into a root `src/` tree so authored code is clearly separated from generated output, jobs, and other non-source folders.

## Related Roadmap Item

- `ROADMAP.md` tracker entry: 2.6 Root `src/` source layout migration

## Context

- The current repo has root-level authored code under `src/` plus package source under `packages/*/src/`.
- Linting and agent reasoning are easier when source trees are clearly separated from generated output such as `dist/`, `build/`, and runtime artifacts such as `jobs/`.
- The migration should preserve package boundaries and avoid changing architecture V3 or the package workspace model.

## Scope

### In scope

- Move root-owned runtime/source files from `system/` into `src/`.
- Update import paths, build entrypoints, and scripts that point at the moved files.
- Update repository docs and standards/config so linting and formatting focus on authored source.
- Exclude generated output and runtime artifact directories from the source-scan baseline.

### Out of scope

- Reworking package source inside `packages/*/src/`.
- Changing architecture V3 terminology or package concepts.
- Broad code cleanup unrelated to the file move itself.

## Implementation Steps

1. Inventory root-owned source files, generated files, and runtime artifact folders.
2. Choose the new `src/` layout for root-owned runtime code and map each current `system/` file to its new path.
3. Move the files, update imports and build scripts, and keep the app runnable.
4. Tighten lint/format scope so source checks target `src/**` and `packages/*/src/**` while skipping generated/output trees.
5. Run focused verification and record any follow-up cleanup that remains.

## Acceptance Criteria

- Root-owned authored code lives under `src/`.
- Package code continues to live under `packages/*/src/`.
- Generated output and runtime artifact folders are ignored by source linting.
- The workspace build and relevant checks still work after the move.

## Verification

- `Unit tests:` existing package/runtime tests that cover moved imports or entrypoints
- `Integration tests:` `npm run lint`, `npm run build:workspace`, and root test/build commands as applicable
- `Manual checks:` run the workspace entrypoint and confirm the moved source still resolves

## Status

- `done`

## Completion Notes

- Moved root-owned runtime/source files from `system/` into `src/`.
- Added a root `tsconfig.json` for `src/`-focused type-aware linting.
- Updated build and docs references to the new layout.
- Narrowed linting to authored source and excluded generated/runtime folders.
- Verified with `npm run build:workspace` and `npx eslint src`.

## Outcome Summary

- The repository now uses a root `src/` tree for workspace/runtime source code, while generated output and runtime artifacts stay outside the authored source path.

## Tooling / Verification Notes

- Build tool: npm / TypeScript
- Expected verification command: `npm run lint`, `npm run build:workspace`
- Current blocker, if any: none
