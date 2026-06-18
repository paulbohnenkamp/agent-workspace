# AGENTS.md

This file is the starting context for future AI coding agents working in this repository.

Assume no prior project knowledge.

Read this file first.

## Project Thesis

Definitions describe work.
Interpreters compose experiences.
Runtimes execute work.
Artifacts preserve work.
Humans and agents collaborate through shared state.

## Architectural Principles

- Workspace-centric
- Artifact-centric
- Metadata-driven composition
- Definition/runtime separation
- Durable state
- Declarative workspace definitions
- Generic platform abstractions over domain-specific implementations

## Architectural Center of Gravity

```text
WorkspaceDefinition
        ↓
Workspace Interpreter
        ↓
ComponentTree
```

Everything else exists to support this flow.

The interpreter input is a `WorkspaceDefinition`.

The interpreter output is a `ComponentTree`.

## First-Class Objects

### Definition Objects

- `WorkspaceDefinition`
- `ArtifactDefinition`
- `PlaybookDefinition`
- `AgentDefinition`
- `SkillDefinition`
- `ToolDefinition`

Definition objects are declarative, versioned, and portable.

### Runtime Objects

- `WorkspaceInstance`
- `WorkItem`
- `ArtifactInstance`
- `KnowledgeSource`
- `Action`
- `Thread`
- `Run`
- `Event`
- `Participant`
- `AgentSession`
- `PlaybookInstance`

Runtime objects are executable and persistable.

## Canonical Vocabulary

### Durable Result

Canonical term: `Artifact`

### Queue Abstraction

Canonical term: `WorkItem`

`Task` is a specialization of `WorkItem` and is not a platform root.

## Architecture

```text
WorkspaceDefinition
        ↓
Workspace Interpreter
        ↓
Workspace Runtime
        ↓
Workspace Shell
        ↓
Artifacts + Actions + Collaboration
```

The key architectural boundary is:

```text
Definition
        ↓
Interpreter
        ↓
Runtime
```

The same runtime should render multiple workspace types from definitions.

## Workspace Shell

The canonical shell consists of these zones:

- `Header`
- `Queue`
- `AssistantSurface`
- `ArtifactSurface`
- `KnowledgePanel`
- `AgentPanel`
- `ActionPanel`
- `ActivityTimeline`
- `ModalSurface`

Workspace definitions bind object kinds and views into these zones.

## Constraints

Do not introduce new platform root concepts without explicit approval.

Prefer specialization over new abstractions.

Do not build separate applications for:

- Decision Workspace
- Finance Workspace
- HR Workspace
- Partner Workspace

These are `WorkspaceDefinitions` rendered by one runtime.

Vertical language should live in:

- `WorkspaceDefinitions`
- `ArtifactDefinitions`
- `PlaybookDefinitions`
- configuration metadata

and not in platform foundations.

## Implementation Order

1. `Schemas`
2. `Types`
3. `Definitions`
4. `Interpreter`
5. `Runtime State`
6. `Workspace Shell`
7. `Vertical Definitions`
8. `Reference Implementation`

If work is ambiguous, prefer progress in this order.

## Working Rules

Treat the following as the architectural source of truth:

- `README.md`
- `ARCHITECTURE_FREEZE.md`
- `IMPLEMENTATION_CONTRACT.md`
- `SCHEMA_INVENTORY.md`
- `docs/`
- `schemas/`

Prefer schema-backed definitions over ad hoc object shapes.

Keep the interpreter domain-neutral.

Keep runtime state explicit and durable where appropriate.

Avoid hard-coding vertical-specific screens or logic.

Capture reusable platform concepts before introducing workflow-specific language.

## Design Heuristics

When deciding whether something belongs in the platform:

1. Does it appear across multiple workspace types?
2. Does it have a distinct lifecycle?
3. Does it require separate persistence?
4. Does it require separate permissions?
5. Does it require distinct UI treatment?

Keep a concept out of the platform core when it is primarily:

- a vertical term
- a workflow variant
- a view concern
- a prompt concern
- a temporary implementation detail

## Current Intent

The architecture is considered frozen enough to begin implementation.

The immediate goal is not to invent new platform concepts.

The immediate goal is to implement:

```text
WorkspaceDefinition
        ↓
Workspace Interpreter
        ↓
ComponentTree
```

and build the runtime and workspace shell around those shared abstractions.
