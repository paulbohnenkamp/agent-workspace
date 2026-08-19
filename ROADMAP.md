# Agent Platform Roadmap

Implementation roadmap for the Agent Platform. Architecture V3 is complete and
frozen; this document tracks implementation maturity and the order of the next
useful slices.

Use `docs/specs/` for intended behavior, `plans/index.md` for active execution
plans, and this file for the verified product-level status.

**Last reviewed:** 2026-08-19

## Current position

The repository is a working vertical slice, not yet a complete platform:

- The Architecture V3 model, package vocabulary, examples, and reference docs
  are established.
- The TypeScript packages provide working foundations for package loading, tool
  registries, event projections, file-backed repositories, and runtime tests.
- The shared workspace composition is proven in React through the hiring and
  land examples.
- The land workspace now has a Next.js/Prisma application foundation, seeded
  projections, action routes, and deterministic assistant behavior.
- The main gap is production-grade runtime behavior: durable execution,
  resumable sessions, authorization, complete validation, and persisted
  collaboration records.

The next milestone is to make the existing dynamic workspace a durable,
authorized, testable end-to-end slice. After that, deepen the platform runtime
and package contracts before adding broad integrations.

## Status legend

- **Done** — implemented and verified in the repository.
- **In progress** — an active plan or implementation exists, with explicit
  remaining work.
- **Next** — the recommended next implementation slice.
- **Backlog** — valid future work, not currently sequenced.
- **Deferred** — intentionally postponed until the core runtime is stronger.

## Done

### Architecture and documentation foundation

- Architecture V3 and the layered vocabulary are documented and frozen.
- The ADR set, contributor guide, documentation map, specifications index, and
  architecture posters are in place.
- Example projects use the V3 filesystem package layout.
- The repository has a root `src/` layout and package-local `packages/*/src/`
  layouts.

### Package and runtime foundations

- Core collaboration, integration, runtime, workspace, and interpreter types
  exist in `packages/types`.
- Base schemas and runtime schemas exist in `packages/schemas`.
- YAML package discovery, basic validation, registries, and reference
  resolution foundations exist in `packages/loader`.
- Tool providers and tool registries exist in `packages/tools`.
- Event projection/replay, project runtime behavior, and JSON file persistence
  exist in `packages/runtime`.
- The repository has automated CI plus passing root build, lint, and test
  workflows.

### Workspace and example slices

- The metadata-driven workspace pipeline is established:
  project filesystem → typed model → event projection → interpreter →
  component registry → renderer.
- Generic workspace component aliases, primitives, composites, and registry
  guardrails are complete.
- The hiring workspace demonstrates multiple named views and renderer
  overlays.
- The land project defines eight agents, domain resources, artifact schemas,
  schedules, and five operational workspace views.
- The land workspace route, representative projected state, in-memory
  coordination actions, and shared workspace composition are working.
- The associated completed milestones are recorded in
  `plans/land-workspace-ui-milestone.md`,
  `plans/workspace-ui-slice-milestone.md`, and the component-catalog plans.

### Quality maintenance

- Root source-layout migration is complete.
- Package lint cleanup and generated-artifact/ESLint cleanup are complete.
- Continuous integration is complete and recorded in
  `plans/continuous-integration.md`.
- The durable authorized workspace slice is complete: PostgreSQL migration,
  seeded membership, authentication, authorization, and 7 passing Playwright
  tests are recorded in `plans/durable-authorized-workspace.md`.

## In progress

### Dynamic workspace UI

**Plan:** [plans/dynamic-workspace-ui.md](plans/dynamic-workspace-ui.md)

The Next.js/Prisma land workspace foundation is implemented. Remaining work:

- Complete database/browser verification for authentication, sessions, and
  project/matter authorization.
- Verify persisted assistant threads, messages, runs, and citations through
  Prisma with a configured database.
- Add browser-level coverage for PostgreSQL-backed action, assistant, and
  access-control flows.
- Add streaming transport to the provider-neutral live assistant adapter.
- Add shadcn/ui primitives and accessibility coverage where useful.

### Documentation story and release flow

**Plan:** [plans/docs-story-and-release-flow-cleanup.md](plans/docs-story-and-release-flow-cleanup.md)

The repository has strong reference documentation but the public entry point is
still being reshaped. Remaining work is the concise product README, changelog,
release landing page, coherent example story, and final link/content audit.

## Next implementation sequence

These are the next slices, in order. Each should have an active plan before
implementation and should update this roadmap when verified.

### 1. Finish the durable dynamic workspace slice

**Status:** Done

Complete the remaining dynamic-workspace plan items so one real project can be
opened, authorized, acted on, and resumed with durable state.

**Acceptance signal:** authenticated users can operate the land workspace;
assistant and coordination records survive a restart; browser and
accessibility checks cover the primary flows.

### 2. Validate view metadata and references

**Status:** In progress

**Plan:** [plans/view-metadata-validation.md](plans/view-metadata-validation.md)

Enforce the canonical `views/` shape and report missing or mismatched view
metadata, fields, regions, components, and renderer overlays clearly.

**Acceptance signal:** invalid views fail during loading/validation with useful
paths and messages, while all current hiring and land views pass.

### 3. Complete the event-canonical runtime path

**Status:** Next

Close the gap between the runtime types and actual execution behavior:

- resolve agents with their tools and skills;
- execute real bounded runs through a provider boundary;
- emit and replay canonical run, thread, artifact, participant, and session
  events;
- rebuild projected state after restart;
- represent waiting, wake, resume, and failure transitions explicitly.

**Acceptance signal:** a fixture project can run, stop waiting for an event,
resume the correct agent session, and recover its current state from events.

### 4. Harden package loading and schema enforcement

**Status:** Next

Move beyond the loader’s current basic checks:

- validate every supported package kind against JSON Schema;
- make schema failures fatal when validation is requested, rather than warnings;
- validate references and dependency graphs with actionable errors;
- define package/version conflict behavior;
- document schema versioning and evolution.

**Acceptance signal:** valid example projects load cleanly and intentionally
broken fixtures fail with deterministic diagnostics.

### 5. Establish the persistence boundary

**Status:** Next

Unify the file-backed runtime foundation and application persistence behind a
clear repository boundary. Add artifact version storage, projection recovery,
event-log versus projection-cache rules, and backup/recovery behavior where
needed.

**Acceptance signal:** the same runtime operations can be tested against an
in-memory repository and a durable repository without changing domain behavior.

## Later backlog

These areas are legitimate, but should follow the five slices above rather than
compete with them.

### Collaboration and work

- Project lifecycle, initialization, participants, resources, and
  import/export.
- Artifact versioning, rendering, publishing, sharing, and dependency
  tracking.
- Production channels and schedules, including event-triggered dormancy and
  wake-up behavior.
- Resource storage, retrieval, search, and indexing.

### Integration and capability

- Complete skill composition and validation.
- Tool permissions, quotas, audit logging, and discovery.
- Connector-backed tools and MCP-backed tools with authentication, retries,
  and monitoring.
- Native tool execution only where a real project requires it, with sandbox
  enforcement.

### Developer experience and operations

- CLI commands for project creation, validation, execution, inspection, and
  export.
- Project scaffolding and guided quickstarts.
- Agent/tool test utilities and fixture generators.
- Structured logs, metrics, tracing, health checks, and alerting.

## Deferred exploration

Do not treat these as core implementation priorities yet. They should be
separate adapters, extensions, or experiments that preserve the V3 filesystem,
event, projection, and package boundaries:

- multi-agent coordination;
- distributed execution and hosted runtimes;
- a separately deployable ASP.NET Core/.NET implementation option;
- evaluation as a sidecar subsystem;
- artifact dependency graphs beyond the basic model.

## Working rules

- Keep Architecture V3 frozen unless a substantive change is explicitly
  approved and recorded as an ADR.
- Prefer end-to-end slices over isolated abstractions.
- Keep filesystem definitions, runtime events, projections, and rendered UI
  separate.
- Put domain behavior in YAML packages, tools, skills, resources, and artifact
  schemas rather than hard-coding it in platform code.
- Update the relevant spec first when intended behavior changes, then update
  the plan and this roadmap after verification.
