# Persistence Boundary

## Goal

Unify runtime and application persistence behind a clear repository boundary so
the same domain operations can recover durable event history and projected
state across in-memory, file-backed, and database-backed implementations.

## Related Roadmap Item

- `ROADMAP.md` tracker entry: Establish the persistence boundary

## Context

- The runtime has in-memory and JSON file repositories with event replay.
- The Next.js land workspace has a Prisma/PostgreSQL application persistence
  path for authenticated projects, threads, messages, runs, and citations.
- These paths need explicit ownership and recovery rules before more runtime or
  integration work is added.

## Scope

### In scope

- Define the repository contract for events, projections, artifacts, threads,
  runs, and agent sessions.
- Make event history canonical and projections rebuildable rather than
  independently authoritative.
- Add artifact version storage and recovery behavior.
- Exercise equivalent operations against in-memory and durable repositories.
- Document event-log versus projection-cache responsibilities and recovery.

### Out of scope

- New architecture concepts or changes to Architecture V3.
- Production backup platforms or multi-region disaster recovery.
- Live model-provider integrations.

## Implementation Steps

1. Audit runtime repositories and Prisma persistence against the event and
   projection model.
2. Define the shared repository boundary and recovery invariants.
3. Implement missing event, artifact-version, thread, run, and session
   persistence behavior.
4. Add parity fixtures for in-memory, file-backed, and database-backed paths.
5. Verify restart/replay behavior and document operational boundaries.

## Acceptance Criteria

- Runtime operations use a repository boundary without changing domain
  behavior between implementations.
- Projected state can be discarded and rebuilt from canonical events.
- Artifact versions, threads, runs, and agent sessions survive restart.
- Database-backed verification covers the primary durable operations.
- Existing builds, tests, lint, and workspace smoke remain green.

## Verification

- `Unit tests:` repository contracts, replay, versioning, and projection parity
- `Integration tests:` file and PostgreSQL-backed persistence fixtures
- `Manual checks:` inspect persisted events and recovered projections

## Status

`in progress`

## Completion Notes

- Initial audit complete. The runtime already has event-replay behavior for
  in-memory and JSON file repositories, while the Prisma layer currently
  stores a land-specific workspace projection plus application event records.
- The next implementation must define the shared event envelope and recovery
  contract between those paths; artifact versions and agent sessions are not
  yet represented in the Prisma persistence model.

## Outcome Summary

- Pending implementation.

## Tooling / Verification Notes

- Build tool: TypeScript, Jest, Prisma, and PostgreSQL fixtures
- Expected verification command: `npm test -- --runInBand && npm run build && npm run build:workspace && npm run lint`
- Current blocker, if any: none
