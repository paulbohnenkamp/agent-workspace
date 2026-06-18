# Event

## Purpose

Canonical runtime event record for execution and collaboration activity.

## Responsibilities

- define identity
- capture event name and timestamp
- carry event payload
- support audit and replay

## Relationships

TBD during implementation.

## Lifecycle

Events are append-only records once emitted.

## Persistence Rules

This object SHOULD be persistable unless explicitly marked transient.

## Events

Event names SHOULD follow:

- `workspace.created`
- `artifact.updated`
- `run.completed`
- `action.requested`

## Security Considerations

Access SHOULD be mediated through workspace permissions and object-level policies.

## Example JSON

```json
{
  "id": "event-123",
  "name": "run.started",
  "timestamp": "2026-06-18T12:00:00Z",
  "workspaceId": "workspace-123"
}
```
