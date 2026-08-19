# Durable Authorized Workspace Slice

## Goal

Make the existing land workspace a durable, authorized application slice:
users can access only permitted project/matter data, perform auditable actions,
and continue assistant conversations after a restart.

## Related Roadmap Item

- `ROADMAP.md` tracker entry: Finish the durable dynamic workspace slice

## Context

- The dynamic workspace foundation is implemented in Next.js with a Prisma
  PostgreSQL adapter.
- Durable land actions already follow the intended event flow, and assistant
  threads, messages, citations, and runs are persisted by the Prisma adapter.
- Authentication and project/matter authorization are now enforced for the
  database-backed application path; browser/database verification remains.
- Relevant references:
  - `docs/specs/dynamic-workspace-ui.md`
- `docs/specs/land-workflow.md`
- `docs/architecture/ARCHITECTURE_V3.md`
- `plans/dynamic-workspace-ui.md`
- `../nextjs-auth-demo/lib/session.ts`, `lib/validation.ts`, and security tests

## Scope

### In scope

- Establish the application authentication/session boundary using the existing
  approved authentication approach.
- Add server-side project and matter authorization checks for workspace reads,
  assistant requests, and durable actions.
- Verify assistant threads, messages, citations, and run/activity records
  through repository interfaces and the Prisma adapter.
- Preserve events as canonical history and projections as queryable current
  state.
- Add idempotency and actor metadata for durable action requests where needed.
- Add unit/integration coverage for authorization, persistence, restart/reload,
  and event-to-projection behavior.
- Add browser-level coverage for one authorized land workflow and one denied
  access path when a test database is available.

### Out of scope

- Streaming assistant transport.
- Full live LLM/provider integration.
- Complete agent execution, wake-up, or resumable session orchestration.
- Broad visual redesign or shadcn/ui migration beyond what is required for
  accessible test coverage.
- Replacing filesystem YAML definitions with database records.
- New land-domain concepts or platform ontology changes.

## Implementation Steps

1. Audit the current Prisma schema, repository interfaces, route handlers, and
   test fixtures against the required users, memberships, projects, matters,
   threads, messages, citations, runs, events, and projections.
2. Add or adapt the authentication/session boundary and define the server-side
   authorization service for project and matter access.
3. Apply authorization consistently to workspace loading, assistant requests,
   and action routes; add explicit denied and unauthenticated responses.
4. Verify the existing assistant thread, message, citation, and run records
   against a configured PostgreSQL database.
5. Persist assistant and action metadata without bypassing the canonical event
   append and projection-refresh flow.
6. Add deterministic tests for authorized access, denied access, persistence,
   reload/restart behavior, and idempotent actions.
7. Add browser coverage for the primary authorized workflow and an access
   failure path; document any local database prerequisites.
8. Update the dynamic workspace plan, plans index, and roadmap with verified
   completion notes.

## Acceptance Criteria

- Authentication/session state is available to server-side workspace paths.
- Project and matter authorization is enforced on the server for reads and
  writes.
- Assistant threads, messages, citations, and runs survive a process restart.
- Durable actions record actor, project, matter, event, and resulting status.
- Events remain canonical and projections can be rebuilt or refreshed from
  persisted history.
- Unauthorized users cannot read project data or execute project actions.
- Unit/integration tests cover the repository and authorization boundaries.
- Browser tests cover an authorized workflow and an access-denied path when the
  configured test database is available.
- Existing package, runtime, workspace, and web builds remain passing.

## Verification

- `Unit tests:` `npm test -- --runInBand`
- `Integration tests:` database validation, Prisma adapter tests, and the
  existing workspace/web builds
- `Manual checks:` authenticated authorized workflow, denied project access,
  reload after persisted assistant/action activity, and event/projection audit

## Status

`done`

## Completion Notes

- Added the session, Argon2id password, signup/login/logout, same-origin, and
  rate-limit boundaries adapted from `../nextjs-auth-demo`.
- Added project/matter membership authorization to workspace pages, actions,
  and assistant requests.
- Added the Prisma migration, opt-in E2E membership seed, login UI, unit tests,
  and Playwright auth/authorization coverage.
- Verified against an isolated PostgreSQL 17 container with migration, seed,
  and all 7 Playwright tests passing.
- Follow-up: streaming assistant transport and broader agent execution remain
  in the parent dynamic workspace plan.

## Outcome Summary

- The land workspace now has a verified authenticated, authorized, durable
  application path with auditable action actors and database-backed E2E tests.

## Tooling / Verification Notes

- Build tool: Next.js, TypeScript, Prisma, Jest, and Playwright
- Expected verification command: `npm test -- --runInBand && npm run lint && npm run build && npm run build:web`
- Current blocker, if any: none for this slice
- E2E setup: `DATABASE_URL=... LAND_DEMO_EMAIL=... LAND_DEMO_PASSWORD=... npm run db:seed`, then `E2E_EMAIL=... E2E_PASSWORD=... npm run test:e2e`
