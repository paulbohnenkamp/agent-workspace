# Typed Metamodel

```text
WorkspaceDefinition 1 ────> * ArtifactDefinition
WorkspaceDefinition 1 ────> * PlaybookDefinition
WorkspaceDefinition 1 ────> * AgentDefinition

WorkspaceDefinition 1 ────> * WorkspaceInstance

WorkspaceInstance   1 ────> * WorkItem
WorkspaceInstance   1 ────> * ArtifactInstance
WorkspaceInstance   1 ────> * Participant
WorkspaceInstance   1 ────> * Run
WorkspaceInstance   1 ────> * Action
WorkspaceInstance   1 ────> * Thread
WorkspaceInstance   1 ────> * Event

Run                 1 ────> * Event
ArtifactInstance    * <───> * KnowledgeSource
Participant          * <───> * ArtifactInstance
```

## Definition Objects

Definition objects are templates. They are versioned, portable, and declarative.

- `WorkspaceDefinition`
- `ArtifactDefinition`
- `PlaybookDefinition`
- `AgentDefinition`
- `SkillDefinition`

## Runtime Objects

Runtime objects are live or persisted instances.

- `WorkspaceInstance`
- `WorkItem`
- `ArtifactInstance`
- `PlaybookInstance`
- `AgentSession`
- `Run`
- `Event`
- `Participant`

## Work Item Specialization

`Task` is not a separate platform root.

It is a specialization of `WorkItem`.
