# Schema Inventory

This document defines the schema set the platform should converge on for implementation.

Each schema entry describes:

- purpose
- required properties
- relationships
- persistence rules
- versioning requirements

## Definition-side Schemas

### `workspace-definition`

- Purpose: declarative description of a workspace type and shell composition
- Required properties:
  - `workspace.id`
  - `workspace.type`
  - `workspace.version`
  - `zones`
  - `bindings`
- Relationships:
  - references `artifact-definition`
  - references `playbook-definition`
  - references `agent-definition`
  - references `policies`
  - references `permissions`
- Persistence rules: persistable, portable, publishable
- Versioning requirements: required semantic or integer version; historical versions must remain resolvable

### `artifact-definition`

- Purpose: declarative definition of a durable artifact type
- Required properties:
  - `id`
  - `type`
  - `version`
  - `displayName`
- Relationships:
  - referenced by `workspace-definition`
  - instantiated by `artifact-instance`
- Persistence rules: persistable and reusable
- Versioning requirements: required version; changes should support migration or compatibility rules

### `playbook-definition`

- Purpose: orchestration/process definition composed of activities and transitions
- Required properties:
  - `id`
  - `type`
  - `version`
  - `activities`
- Relationships:
  - referenced by `workspace-definition`
  - may reference `skill-definition`
  - may reference `tool-definition`
  - instantiated by `playbook-instance`
- Persistence rules: persistable and reusable
- Versioning requirements: required version

### `agent-definition`

- Purpose: declarative definition of an agent role and its capabilities
- Required properties:
  - `id`
  - `type`
  - `version`
- Relationships:
  - referenced by `workspace-definition`
  - may reference `skill-definition`
  - may reference `tool-definition`
  - instantiated by `agent-session`
- Persistence rules: persistable and reusable
- Versioning requirements: required version

### `skill-definition`

- Purpose: reusable capability definition invoked by agents or playbooks
- Required properties:
  - `id`
  - `type`
  - `version`
- Relationships:
  - referenced by `agent-definition`
  - referenced by `playbook-definition`
  - may reference `tool-definition`
- Persistence rules: persistable and reusable
- Versioning requirements: required version

### `tool-definition`

- Purpose: declarative description of a bounded callable capability
- Required properties:
  - `id`
  - `type`
  - `version`
- Relationships:
  - referenced by `skill-definition`
  - referenced by `playbook-definition`
  - may be referenced from `run`
- Persistence rules: persistable and reusable
- Versioning requirements: required version

### `policies`

- Purpose: declarative behavior, visibility, or execution constraints
- Required properties:
  - collection `id`
  - `version`
  - `rules`
- Relationships:
  - referenced by `workspace-definition`
  - evaluated by interpreter and runtime
- Persistence rules: persistable
- Versioning requirements: required version

### `permissions`

- Purpose: declarative access and authorization rules
- Required properties:
  - collection `id`
  - `version`
  - `grants` or `rules`
- Relationships:
  - referenced by `workspace-definition`
  - evaluated by interpreter and runtime
- Persistence rules: persistable
- Versioning requirements: required version

## Runtime-side Schemas

### `workspace-instance`

- Purpose: runtime realization of a workspace definition
- Required properties:
  - `id`
  - `workspaceDefinitionId`
  - `status`
  - `createdAt`
- Relationships:
  - owns `work-item`
  - owns `artifact-instance`
  - owns `action`
  - owns `thread`
  - owns `run`
  - owns `event`
  - owns `participant`
  - references `workspace-definition`
- Persistence rules: persistable
- Versioning requirements: instance revisions should be auditable; definition reference must remain explicit

### `work-item`

- Purpose: business anchor for active work
- Required properties:
  - `id`
  - `type`
  - `workspaceId`
  - `status`
  - `title`
- Relationships:
  - belongs to `workspace-instance`
  - links to `artifact-instance`
  - links to `action`
  - links to `knowledge-source`
  - may link to `thread`
- Persistence rules: persistable
- Versioning requirements: state changes should be auditable; subtype-specific fields may evolve by type

### `artifact-instance`

- Purpose: durable result created or edited in a workspace
- Required properties:
  - `id`
  - `type`
  - `workspaceId`
  - `status`
  - `version`
- Relationships:
  - belongs to `workspace-instance`
  - may derive from `artifact-definition`
  - may link to `work-item`
  - links to `knowledge-source`
  - links to `action`
  - may link to `participant`
- Persistence rules: persistable with versions
- Versioning requirements: explicit artifact versioning required

### `knowledge-source`

- Purpose: grounding source for artifacts, work items, and actions
- Required properties:
  - `id`
  - `type`
  - `workspaceId`
  - `title`
- Relationships:
  - belongs to `workspace-instance`
  - linked from `artifact-instance`
  - linked from `work-item`
  - may be surfaced in `thread` or `run`
- Persistence rules: persistable
- Versioning requirements: versioning optional, provenance required

### `action`

- Purpose: executable or reviewable next step
- Required properties:
  - `id`
  - `type`
  - `workspaceId`
  - `status`
- Relationships:
  - belongs to `workspace-instance`
  - may link to `work-item`
  - may link to `artifact-instance`
  - may link to `run`
  - may link to `participant`
- Persistence rules: persistable
- Versioning requirements: state transitions should be auditable

### `thread`

- Purpose: conversation or discussion context
- Required properties:
  - `id`
  - `workspaceId`
  - `status`
- Relationships:
  - belongs to `workspace-instance`
  - may link to `work-item`
  - may link to `artifact-instance`
  - may link to `agent-session`
- Persistence rules: persistable
- Versioning requirements: message history should be durable or replayable according to retention policy

### `run`

- Purpose: finite execution instance
- Required properties:
  - `id`
  - `workspaceId`
  - `status`
  - `startedAt`
- Relationships:
  - belongs to `workspace-instance`
  - may reference `playbook-definition`
  - may reference `skill-definition`
  - may reference `tool-definition`
  - linked to `event`
  - linked to `agent-session`
- Persistence rules: persistable
- Versioning requirements: immutable identity; status and event history must be auditable

### `playbook-instance`

- Purpose: runtime realization of a playbook definition
- Required properties:
  - `id`
  - `playbookDefinitionId`
  - `workspaceId`
  - `status`
- Relationships:
  - belongs to `workspace-instance`
  - references `playbook-definition`
  - may own or reference `run`
- Persistence rules: persistable
- Versioning requirements: definition reference required

### `agent-session`

- Purpose: long-lived participation context for an agent
- Required properties:
  - `id`
  - `agentDefinitionId`
  - `workspaceId`
  - `status`
- Relationships:
  - belongs to `workspace-instance`
  - references `agent-definition`
  - may link to `thread`
  - may link to multiple `run` records
- Persistence rules: persistable
- Versioning requirements: state changes auditable; definition reference required

### `event`

- Purpose: canonical event record for runtime activity
- Required properties:
  - `id`
  - `name`
  - `timestamp`
  - `workspaceId`
- Relationships:
  - belongs to `workspace-instance`
  - may belong to `run`
  - may reference `artifact-instance`
  - may reference `action`
  - may reference `agent-session`
- Persistence rules: persistable, append-friendly
- Versioning requirements: immutable event identity; payload schema should be versioned if it evolves

### `participant`

- Purpose: human or agent actor in the workspace
- Required properties:
  - `id`
  - `type`
  - `workspaceId`
  - `role`
- Relationships:
  - belongs to `workspace-instance`
  - may link to `artifact-instance`
  - may link to `action`
  - may link to `run`
  - may link to `thread`
- Persistence rules: persistable
- Versioning requirements: state changes auditable

## Interpreter and Shell Schemas

### `component-tree`

- Purpose: normalized interpreter output for shell rendering
- Required properties:
  - `workspace`
  - `zones`
  - `components`
  - `bindings`
- Relationships:
  - produced from `workspace-definition`
  - consumed by runtime and shell
- Persistence rules: may be transient; may be cached
- Versioning requirements: must track the `workspace-definition` version and interpreter version used to create it

## Canonical Notes

### Existing vs Required

Existing draft schemas in the repo cover only part of this inventory:

- `workspace-definition`
- `workspace-state`
- `artifact-definition`
- `playbook-definition`
- `run`

Required additions or major revisions:

- `workspace-instance`
- `work-item`
- `artifact-instance`
- `knowledge-source`
- `action`
- `thread`
- `playbook-instance`
- `agent-definition`
- `agent-session`
- `skill-definition`
- `tool-definition`
- `event`
- `participant`
- `component-tree`
- `policies`
- `permissions`

### Implementation Rule

Future schema work MUST converge on this inventory rather than extending the current partial set ad hoc.
