# Glossary

This glossary defines the canonical vocabulary for implementation.

## A

### Action

Executable or reviewable next step in a workspace.

### AgentDefinition

Declarative description of an agent role, behavior, and capabilities.

### AgentPanel

Canonical shell zone for agent and run visibility.

### AgentSession

Long-lived participation context for an agent in a workspace. May span multiple runs.

### Artifact

Canonical term for the durable result of work.

Historical term:

- `Output`

### ArtifactDefinition

Declarative description of a durable artifact type.

### ArtifactInstance

Runtime artifact created, edited, reviewed, or published inside a workspace.

### ArtifactSurface

Canonical shell zone where primary and related artifacts are rendered.

## B

### Binding

Mapping between a zone, an object kind, and the view that should render there.

### BusinessState

Runtime state branch that holds durable business objects and their relationships.

## C

### ComponentDefinition

Renderable component type known to the interpreter and shell.

### ComponentTree

Normalized interpreter output describing the shell structure, selected components, bindings, and runtime-ready metadata.

## E

### Event

Canonical runtime event object. Events are named with `<object>.<verb>`.

## K

### KnowledgePanel

Canonical shell zone for grounding sources and supporting evidence.

### KnowledgeSource

Document, dataset, note, system, or evidence source used to ground work.

## L

### LayoutState

Runtime state branch for current shell presentation such as visibility, splits, modals, and pinning.

## M

### Metadata-driven composition

Architectural principle that workspace experiences are assembled from definitions rather than hard-coded page logic.

### ModalSurface

Canonical shell zone for overlays, approval steps, and interruptive flows.

## N

### NavigationState

Runtime state branch describing current path, focus, navigation history, and active surface within the shell.

## P

### Participant

Human or agent actor participating in a workspace.

### Permission

Declarative rule describing access or allowed operations for workspace capabilities or objects.

### PlaybookDefinition

Declarative orchestration and process definition made of activities and transitions.

### PlaybookInstance

Runtime execution context for a playbook inside a workspace.

### Policy

Declarative rule evaluated by the interpreter or runtime to shape behavior, visibility, or execution constraints.

## Q

### Queue

Canonical shell zone for collections of `WorkItem` records.

## R

### Run

Finite execution instance. Emits events and represents an auditable unit of work.

### Runtime

Live execution layer that manages state, collaboration, activity, and persistence-aware behavior.

## S

### SelectionState

Runtime state branch for the currently selected work item, artifact, source, thread, tab, or related object.

### SkillDefinition

Declarative reusable capability that can be invoked by agents or playbooks.

## T

### Thread

Conversation or discussion attached to workspace context.

### ToolDefinition

Declarative description of an external or bounded callable capability.

## V

### View

Specialized rendering profile for a component when bound to a specific object kind.

## W

### WorkItem

Canonical business anchor for active work in a workspace.

`Task` is a specialization of `WorkItem`, not a platform root.

### WorkspaceDefinition

Declarative description of a workspace type, its zones, bindings, artifacts, actions, playbooks, policies, and permissions.

### WorkspaceInstance

Runtime realization of a workspace definition.

### Workspace Shell

Canonical zone-based UI frame rendered by the interpreter and runtime.

### WorkspaceState

Top-level runtime state tree for a workspace.

## Z

### Zone

Named region in the canonical workspace shell.
