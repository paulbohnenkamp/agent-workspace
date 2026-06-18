# Workspace Definition

## Purpose

Template describing a workspace type and how it should be composed.

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

- `workspace.created`
- `workspace.updated`
- `workspace.archived`

## Security Considerations

Access SHOULD be mediated through workspace permissions and object-level policies.

## Example JSON

```json
{
  "workspace": {
    "id": "example-workspace",
    "type": "generic",
    "version": 1
  },
  "zones": [],
  "bindings": []
}
```
