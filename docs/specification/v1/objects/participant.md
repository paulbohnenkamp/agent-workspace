# Participant

## Purpose

Human or agent actor participating in a workspace.

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

- `participant.added`
- `participant.updated`
- `participant.removed`

## Security Considerations

Access SHOULD be mediated through workspace permissions and object-level policies.

## Example JSON

```json
{
  "id": "participant-123",
  "type": "human",
  "workspaceId": "workspace-123",
  "role": "reviewer"
}
```
