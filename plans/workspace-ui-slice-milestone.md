# Workspace UI Slice Milestone

## Goal

Deliver a working hiring-project workspace UI slice with a real loader, interpreter, registry, shell, and smoke test.

## Related Roadmap Item

- `ROADMAP.md` tracker entry: 2.0 Workspace UI Slice

## Context

- The repository needed an end-to-end workspace UI proof, not just architecture docs.
- The slice had to honor `views/` metadata and remain renderer-neutral.
- The hiring-project example was the best proving ground because it already represented resumable collaborative work.

## Scope

### In scope

- Define workspace view metadata and example views.
- Implement the loader, interpreter, layout builder, component registry, and shell renderer.
- Add workspace view validation.
- Add a smoke test that exercises the hiring-project views.
- Update docs to explain the slice and the workflow.

### Out of scope

- Broader runtime persistence beyond the workspace slice.
- New architecture concepts.
- Additional products or example domains.

## Implementation Steps

1. Create the workspace `view.json` model and hiring-project example views.
2. Build the loader, interpreter, registry, layout builder, and shell.
3. Add validation for workspace view metadata.
4. Add a smoke test that verifies the rendered workspace.
5. Update the plan record and documentation to reflect the new milestone.

## Acceptance Criteria

- The hiring-project workspace renders from `views/` metadata.
- The loader/interpreter path resolves fields, bindings, and overlays.
- The smoke test passes.
- Documentation reflects the workspace UI slice and how to resume work.

## Verification

- `Unit tests:` validation helpers and view resolution behavior
- `Integration tests:` workspace smoke test
- `Manual checks:` build the system bundle and run the smoke entrypoint

## Status

- `done`

## Completion Notes

- Added a metadata-driven workspace UI pipeline in `system/`.
- Added a workspace view schema and validation path.
- Added hiring-project views for candidate review, open roles, and approvals.
- Updated docs so the milestone and follow-up workflow are visible to the next agent.

## Outcome Summary

- The repo now has a real, tested workspace UI slice that is committed and pushed, and the next slice can resume from `plans/index.md`.

## Tooling / Verification Notes

- Build tool: `npm run build:system`
- Expected verification command: `node build/system/system/render-workspace.smoke.js`
- Current blocker, if any: none
