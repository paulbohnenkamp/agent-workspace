# Persistence Architecture

```text
Workspace Store
Artifact Store
Knowledge Store
Event Store
Search Index
Vector Store
```

## Persisted

- Workspace definitions
- Workspace instances
- Work items
- Artifact instances
- Artifact versions
- Knowledge sources
- Actions
- Runs
- Events
- Audit trails

## Transient

- Streaming token chunks
- Typing indicators
- Hover state
- Temporary tool progress
- Uncommitted UI buffers

## Persistence Concerns

The platform SHOULD support:

- versioning
- snapshots
- replay
- search indexing
- audit history
- resumability
