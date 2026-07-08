# View Metadata Validation

## Goal

Tighten workspace view loading so broken `views/` files fail fast with clear errors and the next session can trust the metadata contract.

## Related Roadmap Item

- `ROADMAP.md` tracker entry: Tighten loader/schema validation for missing or mismatched view metadata

## Context

- The hiring-project workspace UI slice is already implemented and smoke-tested.
- The next phase is to harden `views/` validation so the loader catches structural errors earlier.
- Relevant docs:
  - `ROADMAP.md`
  - `AGENTS.md`
  - `docs/README.md`
  - `docs/examples/hiring-project/README.md`

## Scope

### In scope

- Validate workspace view files more strictly at load time.
- Catch missing or mismatched regions, fields, and renderer overlays.
- Keep the current React workspace slice working.
- Update docs if the view contract changes.

### Out of scope

- New workspace concepts
- Broader runtime persistence work
- Additional example projects

## Implementation Steps

1. Review the current `view.json` contract and validation path.
2. Add any missing reference checks for fields, regions, and renderer overlays.
3. Make validation errors concise and actionable.
4. Rebuild and rerun the workspace smoke test.
5. Update plan completion notes and the matching `ROADMAP.md` checkbox when done.

## Acceptance Criteria

- Invalid workspace view metadata fails fast with a clear error.
- The existing hiring-project views still load and render.
- The smoke test continues to pass.
- The plan includes a completion summary when finished.

## Verification

- `Unit tests:` validation helpers, if any are added
- `Integration tests:` workspace loader smoke path
- `Manual checks:` build and run the workspace smoke test

## Status

- `planned`

## Completion Notes

- 

## Outcome Summary

- 

## Tooling / Verification Notes

- Build tool: `npm run build:system`
- Expected verification command: `node build/system/system/render-workspace.smoke.js`
- Current blocker, if any: none yet
