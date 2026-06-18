# Work Item

## Purpose

Business anchor for an active unit of work.

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

- `work_item.created`
- `work_item.updated`
- `work_item.archived`

## Security Considerations

Access SHOULD be mediated through workspace permissions and object-level policies.

## Example JSON

```json
{
  "id": "example-work_item",
  "type": "work_item"
}
```
