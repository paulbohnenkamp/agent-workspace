# Canonical Domain Model

```text
Workspace
├── WorkItems
├── Artifacts
├── Participants
├── Threads
├── KnowledgeSources
├── Actions
├── Runs
└── Events
```

## Key Rule

Vertical concepts such as decision cases, finance reviews, HR cases, and partner renewals SHOULD be modeled as `WorkItem` specializations, not new platform roots.
