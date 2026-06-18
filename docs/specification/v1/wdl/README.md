# Workspace Definition Language

Workspace Definition Language, or WDL, is the declarative format for describing workspace experiences.

## Minimal Shape

```yaml
workspace:
  id: partner-operations-v1
  type: partner
  version: 1
  displayName: Partner Operations Workspace
  layout: operational

zones:
  - key: queue
    component: queue_view
  - key: artifact_surface
    component: artifact_surface

bindings:
  - zone: queue
    objectKind: work_item
    view: renewal_queue
  - zone: artifact_surface
    objectKind: artifact
    view: renewal_analysis

artifacts:
  - type: renewal-analysis
  - type: proposal-draft

actions:
  - type: schedule-call
  - type: create-proposal

playbooks:
  - type: renewal-review

policies: []
permissions: []
```

## Validation Rules

A valid `WorkspaceDefinition` MUST:

- include a workspace `id`
- include a workspace `type`
- include a `version`
- define at least one `zone`
- define unique zone keys
- define unique artifact type identifiers
- ensure all binding zone references resolve
- ensure all component references are known to the interpreter
