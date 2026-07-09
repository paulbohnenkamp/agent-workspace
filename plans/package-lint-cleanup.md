# Package Lint Cleanup

## Goal

Clean the remaining package source lint backlog so the repo-wide lint pass can succeed without excluding authored code.

## Related Roadmap Item

- `ROADMAP.md` tracker entry: 2.8 Package Lint Cleanup

## Context

- `packages/types` is already lint-clean.
- The remaining errors are concentrated in `packages/loader`, `packages/runtime`, and `packages/tools`.
- The goal is to remove avoidable lint noise from authored package source, not to change behavior.

## Scope

### In scope

- Refactor package source files to satisfy the current lint rules.
- Keep the fixes behavior-preserving and focused on source code conventions.
- Verify each package after cleanup.

### Out of scope

- Runtime behavior changes unrelated to lint cleanup.
- Package layout changes.
- Broad API redesign.

## Implementation Steps

1. Clean `packages/loader/src` and confirm the remaining error count drops sharply.
2. Clean `packages/tools/src` and `packages/runtime/src`.
3. Run repo-wide lint to verify the backlog is gone or identify any final stragglers.

## Acceptance Criteria

- `npx eslint packages/loader/src packages/runtime/src packages/tools/src` passes.
- `npm run lint` passes or only reports newly introduced issues outside the scoped packages.

## Verification

- `Unit tests:` existing package tests in loader/runtime/tools
- `Integration tests:` `npx eslint packages/loader/src packages/runtime/src packages/tools/src`, `npm run lint`
- `Manual checks:` spot-check edited files for type safety and readability

## Status

- `done`

## Completion Notes

- Cleaned `packages/loader`, `packages/runtime`, and `packages/tools` until repo lint passed.
- Added generated schema JS output to the ESLint ignore list so lint targets authored source only.
- Verified with `npm run lint` and `npm run build:workspace`.

## Outcome Summary

- The remaining package lint backlog was cleared and the repo now passes lint from the root.

## Tooling / Verification Notes

- Build tool: npm / TypeScript / ESLint
- Expected verification command: `npx eslint packages/loader/src packages/runtime/src packages/tools/src`
- Current blocker, if any: none
