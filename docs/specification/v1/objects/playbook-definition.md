# Playbook Definition

## Purpose

Reusable process definition for structured work.

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

- `playbook_definition.created`
- `playbook_definition.updated`
- `playbook_definition.archived`

## Security Considerations

Access SHOULD be mediated through workspace permissions and object-level policies.

## Example JSON

```json
{
  "id": "example-playbook_definition",
  "type": "playbook_definition"
}
```
