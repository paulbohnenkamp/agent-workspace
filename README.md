# Agent Workspace Platform (AWP)

Agent Workspace Platform, or `AWP`, is a metadata-driven platform for building collaborative AI workspaces.

It is not a single application for one workflow. It is a reusable platform for defining workspace types, interpreting those definitions into UI and runtime behavior, and supporting durable human-agent collaboration around business work.

## What AWP Is

An Agent Workspace Platform is a system that lets teams define workspaces declaratively instead of hard-coding a new application for every domain.

In AWP:

- work happens inside a durable `Workspace`
- each workspace is organized around a `WorkItem`
- agents and humans collaborate through shared state
- durable results are preserved as `Artifacts`
- actions, runs, threads, and knowledge sources remain inspectable
- the experience is composed from definitions, not bespoke page logic

The central architecture is:

```text
WorkspaceDefinition
        ↓
Workspace Interpreter
        ↓
Workspace Runtime
        ↓
Workspace Shell
```

## Why It Exists

Most agent products stop at chat, prompt orchestration, or workflow automation. AWP exists to support a more durable model of work:

- business work is larger than a single prompt
- the thing users keep is usually not the conversation, but the resulting artifact
- review, approval, traceability, and follow-up actions need first-class treatment
- different teams need different workspace shapes, but should not require separate applications

AWP is meant to support operational, analytical, and review-heavy workflows through one platform model.

## Core Principles

- `Workspace-centric`: work happens inside durable collaboration containers.
- `Artifact-centric`: the durable result of work is an artifact, not a chat transcript.
- `Human + agent collaboration`: both people and agents operate through shared workspace state.
- `Metadata-driven composition`: workspace experiences are assembled from definitions.
- `Definition/runtime separation`: definitions describe work; runtimes execute work.
- `Declarative workspace definitions`: new workspace types are definition packages, not new apps.
- `Durable state and versioning`: artifacts, definitions, runs, and actions can be persisted and audited.

## Platform Layers

```text
Applications
        ↓
Workspace Definition Packages
        ↓
Workspace Interpreter
        ↓
Workspace Runtime
        ↓
Persistence
        ↓
Infrastructure
```

What each layer does:

- `Applications`: product surfaces built on top of the platform
- `Workspace Definition Packages`: declarative workspace, artifact, playbook, and agent definitions
- `Workspace Interpreter`: validates definitions and turns them into component trees and bindings
- `Workspace Runtime`: manages live state, execution, activity, and collaboration
- `Persistence`: stores definitions, instances, artifacts, runs, actions, and events
- `Infrastructure`: the underlying hosting, storage, and service environment

## First-Class Concepts

The current documentation treats these as first-class platform objects:

- `WorkspaceDefinition`
- `WorkspaceInstance`
- `WorkItem`
- `ArtifactDefinition`
- `ArtifactInstance`
- `KnowledgeSource`
- `Action`
- `Thread`
- `Run`
- `PlaybookDefinition`
- `PlaybookInstance`
- `AgentDefinition`
- `AgentSession`
- `SkillDefinition`
- `ToolDefinition`
- `Participant`
- `Event`
- `WorkspaceState`
- shell `Zones`
- `Bindings`
- `Policies`
- `Permissions`

## Definition Vs Runtime

AWP separates what a workspace is from what is happening inside it.

Definition-side objects:

- `WorkspaceDefinition`
- `ArtifactDefinition`
- `PlaybookDefinition`
- `AgentDefinition`
- `SkillDefinition`
- `ToolDefinition`

Runtime-side objects:

- `WorkspaceInstance`
- `WorkItem`
- `ArtifactInstance`
- `KnowledgeSource`
- `Action`
- `Thread`
- `Run`
- `PlaybookInstance`
- `AgentSession`
- `Event`
- `Participant`

This separation matters because:

- definitions can be versioned and reused
- runtimes can execute and persist live work independently
- one runtime can render many workspace types

## Workspace Definition Language (WDL)

`WDL` is the declarative format for describing workspace experiences.

At a minimum, a workspace definition describes:

- workspace identity and version
- zones in the workspace shell
- bindings from zones to object kinds
- artifact types
- action types
- playbook references
- policies and permissions

Minimal example:

```yaml
workspace:
  id: partner-operations-v1
  type: partner
  version: 1
  displayName: Partner Operations Workspace
  layout: operational

zones:
  - key: queue
    component: queue_view
  - key: artifact_surface
    component: artifact_surface

bindings:
  - zone: queue
    objectKind: work_item
    view: renewal_queue
  - zone: artifact_surface
    objectKind: artifact
    view: renewal_analysis

artifacts:
  - type: renewal-analysis

actions:
  - type: schedule-call

playbooks:
  - type: renewal-review

policies: []
permissions: []
```

The interpreter is expected to validate, normalize, and resolve this metadata into a runtime-ready component tree.

## Workspace Shell

The canonical workspace shell is composed from zones such as:

- `Header`
- `Queue`
- `Assistant Surface`
- `Artifact Surface`
- `Knowledge Panel`
- `Agent Panel`
- `Action Panel`
- `Activity Timeline`
- `Modal Surface`

The shell must be able to render multiple workspace types without hard-coded domain pages.

## Vertical Workspace Examples

The repository includes vertical examples that pressure-test the same platform against different business domains:

- [Decision Workspace](docs/verticals/decision-workspace.md)
- [Partner Workspace](docs/verticals/partner-workspace.md)
- [HR Workspace](docs/verticals/hr-workspace.md)
- [Finance Workspace](docs/verticals/finance-workspace.md)

These examples are intended to prove:

- one platform can support both operational and review-heavy work
- vertical language can stay in definitions instead of the platform core
- the same runtime can render different workspace types

## Repository Structure

```text
docs/
  README.md
  architecture/
    diagrams/
    workspace-shell.md
    canonical-domain-model.md
  images/
    diagrams/
    originals/
  posters/
  specification/v1/
  verticals/

schemas/
  agent-definition.schema.json
  agent-session.schema.json
  workspace-definition.schema.json
  workspace-instance.schema.json
  workspace-state.schema.json
  work-item.schema.json
  artifact-definition.schema.json
  artifact-instance.schema.json
  knowledge-source.schema.json
  action.schema.json
  thread.schema.json
  playbook-definition.schema.json
  playbook-instance.schema.json
  run.schema.json
  skill-definition.schema.json
  tool-definition.schema.json
  event.schema.json
  participant.schema.json
  component-tree.schema.json
  policies.schema.json
  permissions.schema.json
  examples/

AGENTS.md
ARCHITECTURE_FREEZE.md
CANONICAL_MODEL.md
DECISIONS.md
GLOSSARY.md
IMPLEMENTATION_CONTRACT.md
README.md
ROADMAP.md
SCHEMA_INVENTORY.md
LICENSE
```

Recommended reading order for a first pass:

1. [docs/README.md](docs/README.md)
2. [docs/specification/v1/README.md](docs/specification/v1/README.md)
3. [docs/specification/v1/metamodel.md](docs/specification/v1/metamodel.md)
4. [docs/specification/v1/interpreter.md](docs/specification/v1/interpreter.md)
5. [docs/specification/v1/runtime-state.md](docs/specification/v1/runtime-state.md)
6. [docs/architecture/README.md](docs/architecture/README.md)
7. [docs/verticals/README.md](docs/verticals/README.md)
8. [CANONICAL_MODEL.md](CANONICAL_MODEL.md)
9. [IMPLEMENTATION_CONTRACT.md](IMPLEMENTATION_CONTRACT.md)
10. [schemas/workspace-definition.schema.json](schemas/workspace-definition.schema.json)

## Development Phases

The current documentation points to this implementation sequence:

1. `Definitions and schemas`
   - validate and refine schemas
   - use `/schemas` as source of truth
2. `Types`
   - generate or author platform types from schemas
3. `Interpreter`
   - accept `WorkspaceDefinition`
   - output a normalized component tree
4. `Runtime state`
   - implement `WorkspaceState` and its sub-state models
5. `Workspace shell`
   - build reusable shell zones and components

The repo is currently architecture-frozen and implementation-ready at the specification level. The next steps are to use the frozen model and schema inventory to implement the interpreter/runtime path without splitting into domain-specific apps.

## Key References

- [Docs Overview](docs/README.md)
- [Specification v1](docs/specification/v1/README.md)
- [Typed Metamodel](docs/specification/v1/metamodel.md)
- [Interpreter Spec](docs/specification/v1/interpreter.md)
- [Runtime State](docs/specification/v1/runtime-state.md)
- [Architecture Overview](docs/architecture/README.md)
- [Vertical Workspaces](docs/verticals/README.md)
- [Architecture Freeze](ARCHITECTURE_FREEZE.md)
- [Canonical Model](CANONICAL_MODEL.md)
- [Implementation Contract](IMPLEMENTATION_CONTRACT.md)
- [Schema Inventory](SCHEMA_INVENTORY.md)

## License

Released under the [Apache License 2.0](LICENSE).

Copyright (c) 2026 DecisionForge LLC
