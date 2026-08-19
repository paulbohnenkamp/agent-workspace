# Dynamic workspace UI implementation plan

## Goal

Implement the dynamic workspace UI specification in
`docs/specs/dynamic-workspace-ui.md`, beginning with a real Next.js land
workspace while preserving Architecture V3 and the existing metadata renderer.

## Current slice

This slice establishes the application foundation and a working land vertical
slice:

- Next.js App Router with webpack build compatibility;
- Tailwind CSS v4 foundation;
- Lucide-based workspace navigation and professional four-surface shell;
- server-rendered `/land/[viewId]` route driven by existing land `view.json`
  metadata and projected state;
- server POST action route at `/api/land/actions`;
- Prisma PostgreSQL schema for projects, events, and projections;
- tested event repository interface with in-memory and Prisma adapters;
- PostgreSQL-backed land projection reads, transactional action append, and seed/reset commands;
- deterministic assistant endpoint with grounded citations and an optional provider-neutral live adapter;
- Prisma config, seed entrypoint, and environment example;
- existing V3 package/runtime and static workspace paths preserved.

## Remaining work

- Add browser-level coverage for the PostgreSQL-backed action and assistant
  flows once a test database is available.
- Verify assistant thread, message, citation, and run persistence through the
  Prisma adapter; the repository implementation now records these entities,
  but database-backed end-to-end coverage remains.
- Complete database/browser verification for the authentication/session
  approach adapted from `../nextjs-auth-demo` and project/matter authorization.
- Add streaming transport to the provider-neutral live adapter.
- Add shadcn/ui primitives and browser/accessibility coverage for the dynamic
  workspace flows.

## Verification completed

- `npm run db:generate` passes with the permitted Prisma engine cache access.
- `DATABASE_URL=... npm run db:validate` passes.
- `npm test -- --runInBand` passes: 106 tests.
- `npm run build:workspace` passes.
- `npm run build:web` passes with `next build --webpack`.
- `npm run build` passes.
- `npm run lint` passes after excluding generated `.next/` output.
- `git diff --check` passes.
- Running Next app returns HTTP 200 for the land route and 307 for the action
  redirect.
- `DATABASE_URL=... npm run db:validate` passes for the expanded runtime schema.
- `npm test -- --runInBand` passes: 107 tests.
- `npm run lint` passes.
- `NEXT_DIST_DIR=../../../../private/tmp/agent-workspace-next-build npm run build:web`
  compiles the Next application successfully before the sandbox blocks Next's
  generated `next-env.d.ts` write.

## Status

In progress. The application foundation and first dynamic-looking vertical
slice are complete; persistence, authentication, live LLM behavior, and
browser-level product coverage remain subsequent implementation phases.
