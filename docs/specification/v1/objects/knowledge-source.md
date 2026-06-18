# Knowledge Source

## Purpose

Evidence, context, document, system, or data source used to ground work.

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

- `knowledge_source.created`
- `knowledge_source.updated`
- `knowledge_source.archived`

## Security Considerations

Access SHOULD be mediated through workspace permissions and object-level policies.

## Example JSON

```json
{
  "id": "example-knowledge_source",
  "type": "knowledge_source"
}
```
