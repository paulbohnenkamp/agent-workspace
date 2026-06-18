# Action

## Purpose

Executable or reviewable next step in a workspace.

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

- `action.created`
- `action.updated`
- `action.archived`

## Security Considerations

Access SHOULD be mediated through workspace permissions and object-level policies.

## Example JSON

```json
{
  "id": "example-action",
  "type": "action"
}
```
