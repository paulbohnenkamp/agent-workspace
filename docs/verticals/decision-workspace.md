# Decision Workspace

## Goal

Prove that a decision-oriented product can be represented as a workspace configuration on the platform rather than as a separate architecture.

This workspace validates that the same platform nouns still hold when the experience becomes review-heavy, document-centric, and approval-oriented.

## Visual Reference

- [Decision Workspace Original](../images/originals/decision-workspace.png)

## Platform Reading

For a decision workflow:

1. the `WorkItem` is the decision case under active review
2. the `Workspace` is the collaboration container around that case
3. the `Artifacts` are results like decision reports, risk analyses, option comparisons, or follow-up briefs
4. the `Actions` are next steps such as approve, request revision, export, or create follow-up work

## Workspace Definition

```yaml
workspace:
  id: decision-workspace-v1
  type: decision
  version: 1
  displayName: Decision Workspace
  layout: review

zones:
  - key: header
    component: work_item_header
    placement: top
  - key: queue
    component: queue_view
    placement: left
  - key: assistant_surface
    component: assistant_surface
    placement: left
  - key: artifact_surface
    component: artifact_surface
    placement: center
  - key: knowledge_panel
    component: knowledge_panel
    placement: right
    collapsible: true
  - key: agent_panel
    component: agent_panel
    placement: right
    collapsible: true
  - key: action_panel
    component: action_panel
    placement: right

bindings:
  - zone: header
    objectKind: work_item
    selectionMode: primary
    view: decision_case_summary
  - zone: queue
    objectKind: work_item
    selectionMode: collection
    view: decision_queue
  - zone: assistant_surface
    objectKind: thread
    selectionMode: primary
    view: assistant_thread
  - zone: artifact_surface
    objectKind: artifact
    selectionMode: primary
    view: decision_report
  - zone: knowledge_panel
    objectKind: knowledge_source
    selectionMode: collection
    view: decision_evidence
  - zone: agent_panel
    objectKind: run
    selectionMode: collection
    view: agent_runs
  - zone: action_panel
    objectKind: action
    selectionMode: collection
    view: decision_actions

artifacts:
  - type: decision-report
    primary: true
  - type: risk-analysis
  - type: follow-up-brief

actions:
  - type: approve
  - type: request-revision
  - type: export
  - type: create-followup-task

playbooks:
  - type: decision-review
```

## Typical Flow

1. A user opens a decision workspace around a decision case.
2. A coordinator or research agent creates initial work items, including task-shaped work items where needed.
3. Agents collect knowledge, synthesize evidence, and draft artifact sections.
4. The AI assistant answers follow-up questions and recommends next steps as the case evolves.
5. The primary artifact is reviewed by users and optionally other agents.
6. The workspace produces actions such as approval, export, or follow-up work.

## Decision Report Shape

Suggested sections:

- summary
- framing
- options
- recommendation
- risks
- knowledge sources
- next steps

## Composition Reading

1. `WorkItem` stays the business anchor for the active decision case.
2. `Artifact` stays the durable center for the decision report and related analyses.
3. `KnowledgeSource` grounds the report in documents, models, and supporting evidence.
4. `Action` carries the review and approval next steps.
5. `Run` explains what agents are actively doing while collecting, synthesizing, and drafting.

## Runtime Interpretation

1. A risk or research agent may surface uncertainty or a recommendation change while the case is under review.
2. The AI assistant can answer follow-up questions without becoming the durable record itself.
3. The decision report remains an `Artifact`.
4. The approval or revision request remains an `Action`.
5. The execution trace remains a `Run`.
