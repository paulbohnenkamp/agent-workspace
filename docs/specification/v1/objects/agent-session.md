# Agent Session

## Purpose

Runtime session for an agent participating in a workspace.

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

- `agent.created`
- `agent.updated`
- `agent.archived`

## Security Considerations

Access SHOULD be mediated through workspace permissions and object-level policies.

## Example JSON

```json
{
  "id": "agent-session-123",
  "agentDefinitionId": "research-agent",
  "workspaceId": "workspace-123",
  "status": "running"
}
```
