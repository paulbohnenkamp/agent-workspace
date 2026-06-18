# Architecture Freeze

This file marks the end of architecture discovery and consolidation for the current repository phase.

The architecture is now frozen enough to support schema-first implementation work.

## Frozen Decisions

The following decisions are frozen for the next implementation phase:

- `Artifact` is the canonical durable-result term.
- `Output` is a historical term and should not appear in active examples or new implementation work.
- `WorkItem` is the canonical queue and business-anchor abstraction.
- `Task` is a specialization of `WorkItem`, not a platform root.
- event names use the canonical `<object>.<verb>` pattern.
- workspace definitions use the canonical nested WDL shape:
  - `workspace`
  - `zones`
  - `bindings`
  - `artifacts`
  - `actions`
  - `playbooks`
  - `policies`
  - `permissions`
- `Run` is a finite execution instance.
- `AgentSession` is a long-lived participation context that may span multiple runs.
- `PlaybookDefinition` is orchestration/process definition.
- `SkillDefinition` is a reusable capability.
- vertical workspaces are `WorkspaceDefinitions` rendered by one runtime.

## Architecture Evolution Notes

The project explored several alternative terms and structures during discovery.

The v1 specification adopts a single canonical vocabulary and model.

Earlier terminology is retained only where necessary to explain design evolution and is not part of the normative specification.

Reference documents:

- [CANONICAL_MODEL.md](CANONICAL_MODEL.md)
- [DECISIONS.md](DECISIONS.md)
- [IMPLEMENTATION_CONTRACT.md](IMPLEMENTATION_CONTRACT.md)
- [SCHEMA_INVENTORY.md](SCHEMA_INVENTORY.md)

## Implementation Scope For Next Phase

The next phase is implementation preparation, not product feature work.

In scope:

- schema refinement and stabilization
- type generation or authoring from schemas
- definition package setup
- interpreter scaffolding
- runtime state modeling
- workspace shell scaffolding
- vertical definitions expressed through canonical WDL

Out of scope:

- domain-specific runtime forks
- separate applications for Decision, Finance, HR, or Partner
- ad hoc object models that bypass schemas
- runtime feature implementation beyond architecture-backed scaffolding

## Explicit Non-Goals

The following are explicit non-goals for this phase:

- production runtime behavior
- provider-specific integration work
- infrastructure setup
- marketplace implementation
- fully realized UI application code
- schema drift away from the canonical model

## Next Packages To Implement

The next packages should be created in this order:

1. `packages/schemas`
2. `packages/types`
3. `packages/definitions`
4. `packages/interpreter`
5. `packages/runtime`
6. `packages/state`
7. `packages/components`

## Final Constraint

Prefer fewer, more generic platform abstractions.

Do not introduce new platform root concepts when an existing abstraction can be specialized.

Decision Workspace, Finance Workspace, HR Workspace, and Partner Workspace MUST remain `WorkspaceDefinitions` rendered by one runtime.
