# Artifact Definition

## Purpose

Template describing a durable artifact type.

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
  "id": "decision-report",
  "type": "decision-report",
  "version": 1
}
```
