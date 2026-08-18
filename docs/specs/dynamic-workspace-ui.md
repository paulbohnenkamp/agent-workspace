# Dynamic workspace UI specification

## Purpose

Define the next product-facing workspace slice: a dynamic, data-backed,
LLM-enabled application that preserves the Architecture V3 package model while
providing a substantially more professional user experience than the current
static Node renderer.

The land workspace is the first target, but the application must support the
existing hiring, finance, decision, and systems examples through the same
metadata-driven composition model.

The UI is an educational and hypothetical application. West Virginia and
Appalachian content must remain clearly labeled as educational context. The
application must not present generated output as legal advice, a title opinion,
a permit determination, a payment decision, or accounting advice.

## Product goal

A user should be able to open a project, understand what needs attention,
inspect the current artifact and evidence, ask grounded questions, see which
agents and people participated, and take an authorized next action.

The experience should feel like a serious operational workspace rather than a
static page assembled for one example. It should have:

- a clear project and workspace hierarchy;
- a dense but readable work queue;
- a grounded assistant conversation with a persistent composer;
- a central artifact or work surface with useful tabs and status;
- visible Knowledge Sources, Agents, and Actions panels;
- consistent icons, typography, spacing, state colors, and responsive behavior;
- loading, empty, error, stale-data, and permission states;
- auditable transitions from human action to event to projection.

## Application stack

The application should reuse the proven foundation in `../nextjs-auth-demo`:

- Next.js with the App Router;
- React and TypeScript;
- Prisma ORM with PostgreSQL;
- Tailwind CSS for utility styling and design tokens;
- Zod for request, environment, and boundary validation;
- the existing authentication/session approach as it is promoted into the
  application;
- Vitest or the repository's established unit-test runner;
- Playwright for browser and accessibility flows.

Add the following workspace UI layer:

- shadcn/ui for composable application components;
- Lucide React for the shared SVG icon system;
- Radix primitives where shadcn components require accessible interaction
  behavior such as menus, dialogs, popovers, tooltips, and tabs.

The current hand-authored CSS renderer may remain as a transitional smoke and
metadata-render path. New product UI work should be implemented in the Next.js
application and should not expand the static renderer into a second product
frontend.

## Architecture boundary

Next.js is the application and interaction layer. It is not a replacement for
Architecture V3.

```text
Next.js route or server action
        ↓
Application service and repository boundary
        ↓
Prisma persistence adapter
        ↓
PostgreSQL

Next.js workspace renderer
        ↓
Interpreted view metadata
        ↓
V3 project, agent, skill, tool, resource, artifact, schedule, and view packages
```

The following rules are mandatory:

- Projects remain the containers for work and context.
- Agents, Skills, Tools, Resources, Artifacts, Schedules, and Views remain
  filesystem definitions.
- Events, Runs, Threads, AgentSessions, and projections remain runtime
  concepts.
- Prisma is an implementation detail of persistence, not a new ontology
  concept.
- Domain behavior belongs in YAML instructions, skills, tools, resources, and
  artifact schemas—not in platform-specific React or Prisma code.
- Tools remain interfaces. External data and actions are reached through
  provider-backed tool implementations.
- No packs, manifests, domain class hierarchies, or parallel container concepts
  may be introduced.

## Dynamic data model

The first persistence slice should support the runtime records needed to make a
workspace genuinely dynamic:

- users, memberships, and project access;
- projects and selected views;
- events as the canonical history;
- projected queue and matter state;
- runs and agent sessions;
- threads, messages, and assistant citations;
- artifacts and artifact versions;
- resource references and source snapshots;
- schedules and schedule-run records;
- action requests, authorization results, and handoff records.

Land-specific records may be added as application data or resources, but they
must not become new platform concepts. The land example should cover acreage,
acquisition, title/curative, pooling/unitization, surface rights, leases,
division orders, royalty-owner cases, records/compliance, and downstream
handoffs.

The repository layer must expose interfaces that can be tested without a live
database. The Prisma adapter implements those interfaces and owns transactions,
queries, indexes, and migrations.

Event handling must follow this sequence:

```text
authorized user or agent action
        → append event
        → update or rebuild projection
        → refresh workspace query
        → show actor, timestamp, status, and artifact impact
```

Direct mutation of projected UI state without an event is not acceptable for
durable behavior.

## LLM and assistant behavior

The assistant must be grounded in the selected project, view, matter, artifact,
and permitted resources. A response should expose enough provenance for a user
to understand:

- which sources were used;
- which agent or run produced the relevant finding;
- when the information was generated;
- what remains uncertain or missing;
- whether the response is educational context or an operational recommendation
  requiring human review.

The assistant integration should support:

- streaming responses;
- source and artifact citations;
- conversation persistence in Threads and Messages;
- tool calls through registered Tool interfaces;
- bounded agent runs with resumable status;
- explicit escalation when legal, title, regulatory, payment, or accounting
  judgment is outside the system boundary;
- clear handling of unavailable, stale, or conflicting sources.

The LLM provider must be replaceable behind an application/service boundary.
Provider-specific SDK calls must not be embedded in workspace components or
land-domain renderers.

## Workspace visual system

The five land views remain reusable workflow workspaces, not five separate jobs.
The eight land agents may share views with human users and with each other.

Every workspace should support the reference composition:

1. compact left navigation rail with consistent SVG icons, tooltips, and
   accessible labels;
2. work queue with filters, matter cards, status, ownership, and deadlines;
3. AI Assistant column with grounded messages and a persistent `Ask anything`
   composer at the bottom;
4. central artifact/work surface with title, status, tabs, provenance, and
   structured sections;
5. right context panels for Knowledge Sources, Agents, and Actions.

The shell must be reusable across at least two projects before visual polish is
considered complete. View-specific content belongs in `view.json`, bindings,
project state, and artifacts. Renderers interpret metadata and must not contain
candidate-, land-, or route-specific branches.

The design system should define shared tokens for:

- typography hierarchy;
- neutral surfaces and borders;
- primary, positive, warning, and escalation states;
- spacing and radius scale;
- focus, hover, selected, disabled, loading, and error states;
- compact and wide workspace breakpoints.

Icons must come from the shared Lucide-based icon registry. Unicode glyphs must
not be used as primary navigation or action icons.

## Security and safety boundaries

- Enforce project and matter authorization on the server, not only in the UI.
- Validate all route and action inputs with Zod or equivalent boundary schemas.
- Keep secrets and provider credentials server-side.
- Redact sensitive data from logs and assistant traces where appropriate.
- Record who initiated durable actions and which run or event resulted.
- Require human confirmation for external side effects and consequential
  actions.
- Clearly label educational West Virginia/Appalachian context throughout the
  land example.

## Delivery phases

### Phase 1: Application foundation

- Add a Next.js application boundary without changing V3 package semantics.
- Reuse the authentication example's Prisma/PostgreSQL setup and session
  approach.
- Establish application services, repository interfaces, and a Prisma adapter.
- Add shared Tailwind tokens, shadcn primitives, and Lucide icons.

### Phase 2: Dynamic workspace shell

- Render project and view metadata through the Next.js shell.
- Implement queue selection, context panels, tabs, responsive layout, and
  loading/error states.
- Replace static fixture state with repository-backed projections.
- Preserve the current five land routes as application routes.

### Phase 3: Events, artifacts, and actions

- Persist events, runs, threads, artifacts, and handoffs.
- Implement authorized actions through server actions or route handlers.
- Show event-derived status and artifact version history.
- Add browser coverage for representative land and hiring flows.

### Phase 4: Grounded assistant and agent runs

- Add streaming assistant responses and persisted threads.
- Add source citations and registered tool invocation.
- Add bounded, resumable agent runs and visible handoff status.
- Test missing-source, escalation, authorization, and provider-failure paths.

## Acceptance criteria

- A Next.js application renders at least the land portfolio and one operational
  land queue from project/view metadata.
- The application uses Prisma with a PostgreSQL-compatible schema and a tested
  repository boundary.
- Durable actions append events and refresh projections rather than mutating UI
  state directly.
- The workspace has a professional shared shell with queue, assistant,
  artifact, Knowledge Sources, Agents, and Actions surfaces.
- The assistant has a persistent composer, grounded source references, loading
  state, error state, and an explicit escalation path.
- The same shell renders at least one non-land example without page-specific
  renderer duplication.
- Navigation and action icons use the shared Lucide icon registry and provide
  accessible labels/tooltips.
- Authentication and project authorization are enforced server-side.
- PostgreSQL migrations, seed data, unit tests, and Playwright flows are
  documented and reproducible.
- Existing Architecture V3 validation, package tests, workspace tests, and
  builds remain passing.
- The land UI labels WV/Appalachian material as educational context and does
  not produce legal conclusions, title opinions, permit determinations,
  payment decisions, or accounting decisions.

## Non-goals

- Replacing YAML packages with database rows.
- Introducing a pack or manifest concept.
- Creating domain-specific TypeScript agent classes.
- Building a complete land-management system or production title,
  regulatory, royalty, or accounting service.
- Treating generated LLM output as authoritative professional advice.
- Rebuilding every existing example before the shared application shell and
  persistence boundaries are proven.
