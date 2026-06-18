# Skill Definition

## Purpose

Declarative description of a capability exposed by an agent.

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

- `skill_definition.created`
- `skill_definition.updated`
- `skill_definition.archived`

## Security Considerations

Access SHOULD be mediated through workspace permissions and object-level policies.

## Example JSON

```json
{
  "id": "example-skill_definition",
  "type": "skill_definition"
}
```
