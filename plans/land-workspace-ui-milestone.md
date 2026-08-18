# Land workspace UI milestone

## Goal

Build and polish all five land-project workspace views using the shared project
archetype layout and an in-memory event/projection demo state.

## Scope

- Add the land workspace specification and future-example authoring guidance.
- Add a dedicated land demo entrypoint and routes.
- Add representative land-management and land-administration projected state.
- Add generic action metadata and in-memory simulated actions.
- Improve shared rendering only where the land data requires it.
- Add focused route, view, action, and regression tests.

## Acceptance criteria

- The five land views render with queue, assistant, artifact, sources, agents,
  and actions in the established workspace composition.
- All routes and simulated actions work without persistence.
- The eight-agent/five-view distinction is documented.
- Existing examples and tests remain valid.

## Verification

Run `npm test -- --runInBand`, `npm run build`, `npm run build:workspace`, and
the dedicated land workspace smoke and route checks.

## Completion notes

- Added the dedicated land workspace route helpers, state fixture, and server entrypoint.
- Updated all five land views to the shared four-column queue, assistant, artifact, and context-rail composition.
- Added in-memory action events and projection updates.
- Added documentation guidance for future example projects.
- Verified 8 test suites and 107 tests, package/workspace builds, lint, YAML references, and all five view loads.
