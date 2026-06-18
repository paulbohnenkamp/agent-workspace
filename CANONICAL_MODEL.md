# Canonical Model

This document freezes the canonical architecture for implementation of the Agent Workspace Platform.

If earlier docs, examples, or schemas disagree with this file, this file wins.

## Thesis

Definitions describe work.  
Interpreters compose experiences.  
Runtimes execute work.  
Artifacts preserve work.  
Humans and agents collaborate through shared state.

## Core Architecture

```text
WorkspaceDefinition
        ↓
Interpreter
        ↓
Runtime
        ↓
Workspace Shell
        ↓
Artifacts + Actions + Collaboration
```

## Platform Principles

- `Workspace-centric`
- `Artifact-centric`
- `Metadata-driven composition`
- `Definition/runtime separation`
- `Durable state`
- `Declarative workspace definitions`

## Abstraction Bias

Prefer fewer, more generic platform abstractions.

Do not introduce a new platform root when an existing abstraction can be specialized.

Preferred pattern:

- specialize `WorkItem` rather than create a new business root
- specialize `ArtifactDefinition` rather than create a new durable-result root
- specialize views and bindings rather than create a new application shell
- specialize playbooks, skills, and definitions rather than fork the runtime

## Canonical Object Model

### Definition-side Objects

These objects are declarative, portable, and versioned.

- `WorkspaceDefinition`
- `ArtifactDefinition`
- `PlaybookDefinition`
- `AgentDefinition`
- `SkillDefinition`
- `ToolDefinition`

### Runtime-side Objects

These objects are executable, inspectable, and persistable.

- `WorkspaceInstance`
- `WorkItem`
- `ArtifactInstance`
- `KnowledgeSource`
- `Action`
- `Thread`
- `Run`
- `Event`
- `AgentSession`
- `Participant`
- `PlaybookInstance`

## Durable Result

Canonical term:

- `Artifact`

Historical term:

- `Output`

Canonical names:

- `ArtifactDefinition`
- `ArtifactInstance`
- `objectKind: "artifact"`

Architecture evolution note:

- any existing reference to `Output` in docs, examples, bindings, or UI thinking should be read as `Artifact`
- any existing `objectKind: "output"` should migrate to `objectKind: "artifact"`
- any older conceptual phrasing about the “primary output” should become “primary artifact”

Rationale:

- the specification, persistence model, and schema set are easier to unify around `Artifact`
- `Artifact` is broad enough to cover reports, briefs, drafts, plans, analyses, and published work products

## Work Queue Modeling

Canonical term:

- `WorkItem`

Non-root specialization:

- `Task`

Examples of `WorkItem` specializations:

- `DecisionCase`
- `PartnerRenewal`
- `HRCase`
- `FinanceReview`
- `Task`

Canonical queue binding:

- `objectKind: "work_item"`

Architecture evolution note:

- queue-oriented bindings that currently point at `task` should migrate to `work_item`
- `Task` remains valid as a type of work item, but not as a platform root

## Run vs AgentSession

### Run

- execution instance
- finite lifecycle
- emits events
- references playbooks, skills, and tools used during execution
- suitable for audit, replay, progress tracking, and activity rendering

### AgentSession

- long-lived participation context
- may span multiple runs
- owns agent state
- owns conversation context and continuity
- represents an agent’s presence in a workspace rather than one execution burst

## Playbook vs Skill

### PlaybookDefinition

- orchestration and process definition
- sequence of activities
- coordinates work across steps and participants
- may invoke skills

### SkillDefinition

- reusable capability
- smaller-grained than a playbook
- invoked by agents or playbooks
- encapsulates a bounded workflow behavior

## Event Model

Canonical event naming:

```text
<object>.<verb>
```

Examples:

- `workspace.created`
- `workspace.updated`
- `artifact.created`
- `artifact.updated`
- `run.started`
- `run.completed`
- `action.requested`
- `action.completed`

Avoid:

- `workspace_definition.created`
- `artifact_instance.created`

unless a future implementation finds a truly unavoidable need for subtype-specific names.

Canonical event representation:

- `runtimeEvents` is not a separate concept
- event collections are simply `Event[]`
- `Run` references `Event` instances

## Canonical Workspace Definition Shape

The canonical structure is:

```yaml
workspace:
  id: decision-workspace
  type: decision
  version: 1
  displayName: Decision Workspace
  layout: review

zones: []
bindings: []
artifacts: []
actions: []
playbooks: []
policies: []
permissions: []
```

Canonical fields:

- `workspace`
  - `id`
  - `type`
  - `version`
  - `displayName`
  - `layout`
- `zones`
- `bindings`
- `artifacts`
- `actions`
- `playbooks`
- `policies`
- `permissions`

Historical examples:

- `workspaceType`
- `componentBindings`
- `componentType`
- `zoneKey`
- `viewKey`

Architecture evolution note:

- `workspaceType` -> `workspace.type`
- top-level `id` -> `workspace.id`
- top-level `type` -> `workspace.type` when it is workspace identity, not object identity
- `componentBindings` -> `bindings`
- `componentType` -> `component`
- `zoneKey` -> `zone`
- `viewKey` -> `view`
- `objectKind: "output"` -> `objectKind: "artifact"`
- queue bindings using `task` -> `work_item`

## Component Model

Canonical concepts:

- `Zone`
- `ComponentDefinition`
- `Binding`
- `View`
- `ComponentTree`

### Zone

- named region in the workspace shell
- stable structural slot in the UI

### ComponentDefinition

- renderable component type
- interpreter-known component primitive

### View

- specialization of a component for an object kind
- can vary by workspace type without changing component primitives

### Binding

- maps object kinds to views in zones
- describes what a zone should render for a given kind of object

### ComponentTree

- interpreter output
- normalized and runtime-ready description of the rendered shell

## Canonical Workspace Shell

Canonical zones:

- `Header`
- `Queue`
- `AssistantSurface`
- `ArtifactSurface`
- `KnowledgePanel`
- `AgentPanel`
- `ActionPanel`
- `ActivityTimeline`
- `ModalSurface`

These zones are assumed sufficient for all current vertical workspace definitions.

## Runtime State

Canonical runtime state tree:

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

Purpose:

- track where the user is within the workspace experience

Minimum responsibilities:

- active route or surface
- active zone focus
- history stack or navigation breadcrumbs
- active modal or overlay target
- back/forward navigation context if the shell supports it

### LayoutState vs WorkspaceDefinition Layout Metadata

`WorkspaceDefinition` owns:

- intended shell structure
- zone presence
- placement defaults
- component and binding metadata
- layout mode definitions such as `review` or `operational`

`LayoutState` owns:

- current panel visibility
- user-driven collapse or expansion
- current split sizes
- pinned regions
- active modal state
- responsive adjustments at runtime

Rule:

- `WorkspaceDefinition` defines allowed structure
- `LayoutState` defines current runtime presentation within that structure

## Vertical Validation Rule

Decision, Finance, HR, and Partner are not separate applications.

They are `WorkspaceDefinitions` rendered by one interpreter and one runtime.

This is a mandatory implementation constraint, not just a design preference.

Vertical concepts belong in:

- workspace definitions
- work item specializations
- artifact definitions
- playbook definitions
- view and component configuration

They do not belong in the platform root object model unless they recur across multiple workspace types and require distinct lifecycle or persistence treatment.
