# Runtime State Model

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

## State Categories

### BusinessState

Persistent business objects such as work items, artifacts, actions, and knowledge sources.

### SelectionState

Current work item, selected artifact, selected source, active tab, and current thread.

### ArtifactState

Artifact content, versions, sections, status, dirty state, and review state.

### AgentState

Active agent sessions, runs, tool calls, progress, and errors.

### ActionState

Available actions, pending approvals, authorization state, and completed actions.

### ActivityState

Timeline events, run events, comments, notifications, and audit entries.

### LayoutState

Panel visibility, responsive layout, pinned regions, modal state, and workspace shell configuration.
