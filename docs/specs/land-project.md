# Land project example specification

## Purpose

Create a reference Architecture V3 project showing how a West Virginia-focused oil-and-gas land department manages both land management/landman work and land administration.

The project is educational and domain-neutral. It must not provide legal advice, invent jurisdiction-specific requirements, or introduce a new platform concept called a pack.

## Required project shape

Create `docs/examples/land-project/` as a standard V3 project containing:

- `project.yaml`
- eight agent packages under `agents/`
- shared resources under `resources/`
- artifact schemas under `artifacts/`
- schedules under `schedules/`
- five metadata-driven views under `views/`
- a README explaining the domain and V3 mapping

The project must preserve the boundary between filesystem definitions, runtime events and records, projected current state, artifacts, and view metadata.

## Agents

Create these agents:

- `land-acquisition-coordinator`: landman intake, acreage strategy, owner research, lease acquisition, negotiation status, approvals, and acquisition recommendations.
- `title-ownership-analyst`: Appalachian chain-of-title review, severed mineral estates, heirship questions, ownership interests, title defects, curative actions, and legal escalation.
- `surface-rights-coordinator`: surface-use agreements, access, roads, pipelines, water, easements, crossing permits, and rights-of-way.
- `land-operations-coordinator`: development support, pooling/unitization coordination, portfolio status, and handoffs to geology, drilling, regulatory, legal, accounting, landowners, and agencies.
- `lease-rights-administrator`: executed lease records, terms, obligations, expirations, amendments, assignments, and held-by-production tracking.
- `division-order-analyst`: ownership and interest records used for division orders, decimal-interest validation, missing signatures, title changes, and downstream handoffs.
- `royalty-owner-relations-analyst`: royalty-owner inquiries, ownership transfers, death/heirship documentation, payment-related handoffs, suspense context, and communication tracking.
- `land-records-compliance-coordinator`: records completeness, recording status, audit trails, compliance findings, document retention, and unresolved administrative exceptions.

Each agent must have instructions embedded in `agent.yaml`, references only to locally defined tools and skills, and metadata identifying its land-department role.

## Skills and tools

Define reusable YAML skills for:

- acreage and acquisition strategy
- lease negotiation and landowner outreach
- title and Appalachian curative review
- pooling and unitization coordination
- surface and right-of-way acquisition
- land portfolio and development handoff management
- lease obligation and expiration administration
- division-order preparation and ownership validation
- royalty-owner and title-change coordination
- records and compliance auditing

Tools are interfaces, not domain implementations. Use descriptive `kind: tool` YAML packages with provider-neutral implementations such as `platform_service` or `function`. Do not add oil-and-gas logic to TypeScript platform code.

## Shared resources

Add resources describing:

- West Virginia land-department roles and handoffs
- Appalachian Basin ownership, title, and landman vocabulary
- surface, mineral, leasehold, working, royalty, overriding royalty, and net-revenue interests
- leases, assignments, easements, and rights-of-way
- West Virginia title and curative concepts
- West Virginia cotenancy, pooling, unitization, and division-order context
- lease terms and held-by-production concepts
- regulatory and government coordination
- owner-relations and documentation workflows
- land-to-accounting and land-to-operations handoffs
- jurisdiction and legal-review disclaimers

Use hypothetical examples and state clearly that lease language and local law control.

## Artifacts

Define artifact types for:

- land acquisition assessment
- title examination report
- lease and rights summary
- curative action plan
- surface-use or right-of-way coordination plan
- lease negotiation summary
- pooling and unitization coordination record
- lease administration record
- division-order analysis
- royalty-owner or ownership-change case
- land records and compliance report
- land portfolio status report

Schemas should be useful but compact. Include fields for status, findings, owners, dates, risks, recommendations, and escalation where appropriate. Do not treat artifact schemas as runtime records.

## Schedules and views

Add schedules for acquisition-pipeline, curative, lease-expiration, lease-administration, pooling/regulatory, division-order, owner-relations, and records/compliance reviews.

Add these views using the existing workspace view schema and canonical component aliases:

- `acquisition-rights-queue`: acquisition, title, lease, and surface-use work queues.
- `title-curative-review`: selected title matter with findings, curative actions, sources, activity, and next actions.
- `lease-administration-queue`: lease terms, expirations, obligations, and administrative exceptions.
- `division-order-owner-relations-queue`: division-order, royalty-owner, title-change, and suspense-context cases.
- `land-portfolio`: integrated land-management and land-administration status.

## Scope boundary

Make land administration a first-class project track. Division orders, royalty-owner cases, suspense context, lease audits, and records/compliance are administrative workflows, but the project must not implement payment processing or make final legal/accounting decisions. Adapt useful DecisionForge concepts such as title examination, title curative workflow, cotenancy, lease-term auditing, division-order analysis, royalty analysis, suspense, and compliance into V3 YAML where relevant; do not copy the DecisionForge `packs/` layout, manifest, authorization files, or Markdown agent format.

WV-specific material is educational context only. Do not invent statutory text, offer legal advice, or imply that a simplified workflow determines legal rights. Actual requirements depend on current law, source documents, and qualified professional review.

## Acceptance criteria

- Every required project directory and package exists, and `project.yaml` enumerates the eight agents, shared resources, schedules, and artifact types.
- All package references resolve within the project.
- The project uses only established V3 concepts and YAML package conventions.
- All eight agents are represented in `project.yaml` and their instructions, skills, resource content, and artifact schemas consistently cover both land management and land administration.
- All five views validate against `packages/schemas/workspace-view.schema.json` and use registered component aliases.
- The README explains the hypothetical workflow and maps the example to Architecture V3.
- Existing repository tests continue to pass.

## Workspace interpretation

The eight agents are specialized land-department roles. The five views are
shared workflow-oriented workspaces and are not a one-to-one mapping to jobs.
Multiple agents, human users, and handoffs may use one view. The UI should use
the established project archetype composition: work queue, AI Assistant,
primary artifact/work surface, and a right-side context rail containing
knowledge sources, agents, and actions.
