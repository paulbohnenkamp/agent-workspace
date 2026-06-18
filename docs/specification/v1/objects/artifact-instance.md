# Artifact Instance

## Purpose

Durable artifact produced or edited within a workspace.

## Responsibilities

- define identity
- define relationships
- participate in lifecycle
- emit events where appropriate

## Relationships

TBD during implementation.

## Lifecycle

See `docs/specification/v1/lifecycles/README.md`.

## Persistence Rules

This object SHOULD be persistable unless explicitly marked transient.

## Events

Recommended events:

- `artifact.created`
- `artifact.updated`
- `artifact.archived`

## Security Considerations

Access SHOULD be mediated through workspace permissions and object-level policies.

## Example JSON

```json
{
  "id": "artifact-123",
  "type": "decision-report",
  "workspaceId": "workspace-123",
  "status": "draft"
}
```
