# Event-Canonical Runtime Path

## Goal

Make one fixture project execute a bounded agent run through the V3 runtime,
record canonical events, and recover the same projected state after restart.

## Related Roadmap Item

- `ROADMAP.md` tracker entry: Complete the event-canonical runtime path

## Context

- Architecture V3 defines events as the canonical record and projections as
  queryable current state.
- `packages/runtime` already has project runtime, event projection/replay, and
  repository foundations, but execution and session behavior remain partial.
- The completed workspace and authorization slices now provide a visible
  consumer for runtime state.
- Relevant references:
  - `docs/architecture/ARCHITECTURE_V3.md`
  - `docs/designs/current-runtime-event-checklist.md`
  - `docs/designs/multi-participant-resumable-workflow.md`
  - `packages/runtime/README.md`
  - `packages/runtime/src/project-runtime.ts`

## Scope

### In scope

- Resolve an agent package with its referenced tools and skills.
- Execute one bounded run through an explicit provider boundary.
- Emit canonical run, artifact, thread, and agent-session lifecycle events.
- Replay events into the existing projection model.
- Persist and reload a waiting/resumed agent session.
- Add an integration fixture covering success, failure, and waiting paths.
- Keep evaluation outside the primary run loop.

### Out of scope

- Live LLM provider integration.
- Multi-agent orchestration beyond one resumable handoff fixture.
- New ontology concepts or changes to Architecture V3.
- Database persistence beyond the repository interface needed by the fixture.
- Channels and schedules as production integrations.

## Implementation Steps

1. Audit the runtime types, repository, projection handlers, and example
   execution path against the event checklist.
2. Define the smallest provider-neutral run boundary and agent resolution path.
3. Add missing canonical event payloads and projection handlers without
   mutating projected state directly.
4. Implement bounded run lifecycle handling for success, failure, waiting, and
   resume.
5. Add an event fixture that persists, reloads, replays, and compares current
   projected state.
6. Verify the existing workspace and land flows remain unchanged.
7. Record completion notes and update the roadmap when the acceptance criteria
   pass.

## Acceptance Criteria

- A fixture agent resolves with its declared tools and skills.
- A bounded run emits start and terminal lifecycle events.
- Waiting and resumed sessions are persisted as runtime records and projected
  from events.
- Replaying the persisted event stream reconstructs equivalent current state.
- Success and failure paths are distinguishable and auditable.
- No evaluation behavior is required inside the primary execution loop.
- Existing tests, builds, and workspace smoke verification pass.

## Verification

- `Unit tests:` runtime projection, agent resolution, and lifecycle tests
- `Integration tests:` fixture execution with in-memory and file repositories
- `Manual checks:` inspect event sequence and compare pre/post-replay state

## Status

`done`

## Completion Notes

- Added a provider-neutral bounded agent execution boundary while keeping the
  runtime responsible for lifecycle, event emission, and projections.
- Agent runs now create or resume sessions, associate runs with sessions, and
  emit created, updated, waiting, and resumed session events.
- File-backed persistence and event replay now recover the same session and run
  projections; projection application explicitly rebinds every projected
  collection.
- Added a fixture covering provider resolution, waiting, file persistence,
  replay, resume, and terminal success. Existing missing-agent/tool failures
  remain auditable through `run.failed`.
- Verified 11 Jest suites / 116 tests, package builds, workspace build, lint,
  and workspace render smoke.

## Outcome Summary

- One bounded agent run can stop for an external event and later resume through
  the same durable session, with canonical events reconstructing current state.

## Tooling / Verification Notes

- Build tool: TypeScript, Jest, and existing workspace runtime scripts
- Expected verification command: `npm test -- --runInBand && npm run build && npm run build:workspace`
- Current blocker, if any: none
