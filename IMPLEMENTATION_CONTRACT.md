# Implementation Contract

This document is the implementation contract future code generation and hand-written code MUST follow.

## Contract Scope

This contract governs:

- schema design
- type generation
- interpreter implementation
- runtime state modeling
- shell composition
- vertical definition authoring

If an implementation idea conflicts with this contract, the contract wins unless the architecture is explicitly re-opened.

## Default Implementation Bias

Implementation MUST prefer fewer, more generic platform abstractions.

Implementation MUST NOT introduce a new platform root concept when an existing abstraction can be specialized instead.

Default order of preference:

1. specialize an existing object type
2. specialize a definition
3. specialize a view or binding
4. specialize a playbook or skill
5. only then consider a new platform root

## 1. Canonical Vocabulary

Implementation MUST use:

- `ArtifactDefinition`
- `ArtifactInstance`
- `objectKind: "artifact"`
- `WorkItem`
- `WorkspaceDefinition`
- `WorkspaceInstance`
- `Run`
- `AgentSession`

Implementation MUST treat these as historical or rejected terms only:

- `Output`
- `workspaceType`
- `componentBindings`
- `componentType`
- `zoneKey`
- `viewKey`
- `objectKind: "output"`
- queue root `task`

## 2. Interpreter Input and Output

### Input

The interpreter MUST accept a canonical `WorkspaceDefinition`.

### Output

The interpreter MUST produce a `ComponentTree`.

### Interpreter Stages

The implementation pipeline MUST include:

1. validation
2. normalization
3. binding resolution
4. policy evaluation
5. layout resolution
6. component tree generation
7. runtime state binding

## 3. Canonical Workspace Definition Shape

Implement this structure as canonical:

```yaml
workspace:
  id: string
  type: string
  version: integer
  displayName: string
  layout: string

zones: Zone[]
bindings: Binding[]
artifacts: ArtifactRef[]
actions: ActionRef[]
playbooks: PlaybookRef[]
policies: Policy[]
permissions: Permission[]
```

Implementation MAY support migration of older shapes during normalization.

Implementation MUST NOT treat older shapes as equal canonical forms after normalization.

## 4. Architecture Evolution Handling

The interpreter normalization layer MUST migrate:

- `Output` -> `Artifact`
- `objectKind: "output"` -> `objectKind: "artifact"`
- `workspaceType` -> `workspace.type`
- top-level `id` -> `workspace.id`
- top-level workspace `type` -> `workspace.type`
- `componentBindings` -> `bindings`
- `componentType` -> `component`
- `zoneKey` -> `zone`
- `viewKey` -> `view`
- queue bindings using `task` -> `work_item`

Normalization SHOULD preserve enough provenance for diagnostics and warnings.

## 5. Object Boundaries

### Run

Implementation MUST model `Run` as:

- finite
- execution-oriented
- event-emitting
- referentially linked to playbooks, skills, and tools used during execution

### AgentSession

Implementation MUST model `AgentSession` as:

- long-lived
- spanning multiple runs when needed
- owner of agent continuity and conversation context

### PlaybookDefinition

Implementation MUST treat this as orchestration/process definition.

### SkillDefinition

Implementation MUST treat this as reusable capability invoked by agents or playbooks.

### WorkItem

Implementation MUST treat this as the queue root and business anchor.

`Task` MAY be modeled as a specialization of `WorkItem`.

## 6. Event Model

Implementation MUST:

- represent events with a canonical `Event` schema
- name events using `<object>.<verb>`
- associate events to runs, workspaces, artifacts, actions, and sessions through relationships or references

Implementation MUST NOT introduce a distinct `runtimeEvents` concept beyond `Event[]`.

## 7. Component Model

Implementation MUST preserve these concepts:

- `Zone`
- `ComponentDefinition`
- `View`
- `Binding`
- `ComponentTree`

Expected semantics:

- zones are structural shell regions
- component definitions are renderable primitives
- views specialize components for object kinds
- bindings map object kinds to views within zones
- component tree is interpreter output

## 8. Workspace Shell Contract

Implementation MUST support these canonical zones:

- `Header`
- `Queue`
- `AssistantSurface`
- `ArtifactSurface`
- `KnowledgePanel`
- `AgentPanel`
- `ActionPanel`
- `ActivityTimeline`
- `ModalSurface`

Vertical workspaces SHOULD be implemented using these zones before introducing new shell regions.

## 9. Runtime State Contract

Implementation MUST organize workspace runtime state as:

```text
WorkspaceState
├── BusinessState
├── SelectionState
├── NavigationState
├── ArtifactState
├── AgentState
├── ActionState
├── ActivityState
└── LayoutState
```

### NavigationState

Implementation MUST define fields for:

- current route or active surface
- focused zone
- navigation history or breadcrumb context
- modal target or overlay target

### LayoutState

Implementation MUST only store runtime presentation state, such as:

- visibility
- split sizes
- pinning
- active modal state
- responsive collapse/expand state

Implementation MUST NOT duplicate definition-time layout metadata in `LayoutState`.

## 10. Persistence Contract

Definition-side objects MUST be versioned.

Runtime-side objects MUST be persistable unless explicitly transient.

Implementation SHOULD provide persistence abstractions for:

- definitions
- workspace instances
- work items
- artifact instances and versions
- actions
- runs
- events
- knowledge sources
- agent sessions
- audit trails

## 11. Cross-Vertical Constraint

Implementation MUST NOT build separate applications for:

- Decision
- Finance
- HR
- Partner

These are vertical `WorkspaceDefinitions` rendered by one runtime.

Implementation MUST also avoid separate root models or runtime forks for these verticals unless the architecture is explicitly reopened.

## 12. Default Conflict Resolution

If a legacy doc, example, or schema conflicts with this contract:

1. `CANONICAL_MODEL.md` wins
2. this implementation contract wins
3. legacy material is normalized or migrated

The default implementation posture is:

- prefer generic platform abstractions
- preserve definition/runtime separation
- keep the interpreter domain-neutral
- keep vertical variability in definitions, not platform roots
