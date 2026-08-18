# Land workflow specification

## Summary

Define a repeatable, PostgreSQL-backed land workflow across the
five reusable workspace views and eight specialized agents.

The workflow supports two assistant modes:

- deterministic mode for reliable local workflows and automated tests;
- live mode for provider-backed LLM responses.

Both modes use PostgreSQL as the source of truth for events, projections,
artifacts, threads, and assistant activity.

The UI is educational and hypothetical. West Virginia and Appalachian content
must be clearly labeled as educational context. The application must not
generate or present statutory text, legal conclusions, title opinions, permit
determinations, payment entitlements, or accounting decisions.

## Dynamic state

- Load land matters, artifacts, agents, sources, and activity from
  Prisma/PostgreSQL.
- Persist every durable user action as an event.
- Update or rebuild projections after each event.
- Refresh the selected workspace from projections rather than initial fixture
  state.
- Provide an idempotent seed/reset operation for the land project.
- Keep package definitions unchanged when resetting local runtime state.

Supported action events:

- `land.assign-matter`
- `land.mark-handoff-ready`
- `land.request-missing-record`
- `land.escalate-review`
- `land.acknowledge-owner-response`
- `land.record-administrative-follow-up`

Every action must show the resulting status, actor, timestamp, activity entry,
and affected matter or artifact.

The durable flow is:

```text
authorized action
  → append event
  → update or rebuild projection
  → refresh workspace query
  → show actor, time, status, and artifact impact
```

Direct mutation of projected UI state without an event is not acceptable for
durable behavior.

## Five walkthrough workflows

The five views are reusable workflow surfaces, not five separate jobs. The
eight agents appear across assignments, activity, artifacts, and handoffs.

### Acquisition and Rights Queue

- North Fork acreage block;
- acquisition assessment;
- title and surface dependencies;
- negotiation readiness;
- handoff to title and surface-rights roles.

### Title and Curative Review

- Harrison mineral estate;
- missing heirship documentation;
- legal-description discrepancy;
- missing-record request;
- professional-review escalation.

### Lease Administration Queue

- Pine Hollow lease set;
- upcoming lease obligation or expiration date;
- continuation evidence request;
- records reconciliation;
- operations handoff.

### Division Orders and Owner Relations

- Riverbend division-order exception;
- decimal or signature discrepancy;
- Martha Ellis ownership-change case;
- missing heirship or ownership document;
- title, accounting, and owner-relations handoff.

### Integrated Land Portfolio

- cross-functional view of land-management and land-administration work;
- eight-agent activity summary;
- rights readiness;
- lease-administration readiness;
- owner and downstream handoffs;
- records completeness;
- management review action.

## Assistant modes

Configure the assistant through:

```text
LAND_ASSISTANT_MODE=deterministic|live
```

### Deterministic mode

- Use fixed responses keyed by view, matter, action, and available sources.
- Return citations to project resources and artifacts.
- Expose missing information and escalation language.
- Remain the default for local workflows and automated tests.
- Require no external provider credentials.

### Live mode

- Call a provider-neutral assistant service.
- Support streaming responses.
- Supply the selected project, view, matter, artifact, thread, and permitted
  resources.
- Record assistant messages, citations, tool calls, and run metadata.
- Show provider failure, stale-source, and missing-source states explicitly.

Provider-specific SDKs must remain behind the assistant/service boundary and
must not be embedded in workspace components or land-domain renderers.

The assistant response boundary must expose:

- message content;
- citations;
- run identifier;
- mode: `deterministic` or `live`;
- status: `complete`, `streaming`, `needs-review`, or `failed`;
- escalation or missing-source metadata.

## Operations

Document and implement these repeatable operations:

```text
npm run demo:land:seed
npm run demo:land:reset
npm run dev
```

The reset operation must restore baseline matters and projections, remove
events, messages, runs, and artifacts created during local work, and produce
the same starting state every time.

A local identity may be used during development. Any authentication bypass
must be explicitly development-only and unavailable in production
configuration.

The workspace route remains:

```text
/land/[viewId]?matterId=[matterId]
```

The action endpoint remains:

```text
POST /api/land/actions
```

Add an assistant endpoint or equivalent server action:

```text
POST /api/land/assistant
```

## Data and interfaces

Expose repository interfaces for:

- land workspace reads;
- event append;
- projection reads and rebuild;
- artifact and artifact-version reads;
- thread and message persistence;
- assistant runs and citations;
- seed and reset operations.

The Prisma adapter implements these interfaces. Workspace UI code must not
import Prisma directly.

Land-specific records remain application data or resources. They must not
become new platform ontology concepts. Projects, Agents, Skills, Tools,
Resources, Artifacts, Schedules, and Views remain filesystem definitions;
Events, Runs, Threads, AgentSessions, and projections remain runtime concepts.

No packs, manifests, domain class hierarchies, or parallel container concepts
may be introduced.

## Safety boundaries

- Clearly label West Virginia/Appalachian material as educational context.
- Use qualified-review escalation language for title, legal, regulatory,
  owner, payment, or accounting judgment.
- Validate action and assistant inputs server-side.
- Keep provider credentials server-side.
- Record actor, project, matter, event, run, and artifact references.
- Enforce project and matter authorization server-side when authentication is
  introduced.

## Acceptance criteria

- All five land views load from PostgreSQL-backed state.
- The five walkthroughs are repeatable from a seeded baseline.
- All eight agents appear in meaningful activity, assignment, artifact, or
  handoff context.
- Every supported action appends an event and updates visible projections.
- Refreshing the browser preserves the action result.
- Reset restores the original baseline.
- The assistant composer works in deterministic mode without external
  credentials.
- Deterministic responses cite selected project resources or artifacts.
- Live mode is provider-configurable and has explicit loading, failure,
  stale-source, and escalation states.
- Knowledge Sources, Agents, Actions, artifact, queue, and assistant surfaces
  are populated in every workflow.
- Playwright covers all five workflows and reset/action flows.
- Existing V3 package validation, tests, builds, and static renderer behavior
  remain passing.
- No new ontology concept, pack, manifest, domain class hierarchy, or
  hard-coded land behavior is introduced into platform TypeScript.

## Assumptions

- PostgreSQL is the persistence source of truth for both assistant modes.
- Deterministic assistant mode is the default.
- Five view-centered workflows are the primary product narrative.
- The current Next.js workspace remains the frontend.
- Existing V3 filesystem packages remain authoritative.
- Live LLM integration is optional at runtime but must be implemented behind a
  tested provider boundary before the full workflow is considered complete.
