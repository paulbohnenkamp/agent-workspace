# Finance Workspace

## Goal

Prove that a finance-oriented review workflow with structured analysis, traceability, and approval-heavy decisions can be represented as a workspace configuration on the same platform.

## Visual Reference

- [Finance Workspace Original](../images/originals/finance-workspace.png)

## Platform Reading

For a finance workflow:

1. the `WorkItem` is the budget case, vendor evaluation, forecast review, variance investigation, or a task-shaped work item supporting one of those cases
2. the `Workspace` is the collaboration container around that business case
3. the `Artifacts` are results like financial reviews, recommendation reports, approval memos, or follow-up analyses
4. the `Actions` are next steps such as approve, reject, request revision, escalate, or create follow-up work

## Workspace Definition

```yaml
workspace:
  id: finance-review-v1
  type: finance-review
  version: 1
  displayName: Finance Review Workspace
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
  - key: modal_surface
    component: approval_gate
    placement: modal

bindings:
  - zone: header
    objectKind: work_item
    selectionMode: primary
    view: finance_case_summary
  - zone: queue
    objectKind: work_item
    selectionMode: collection
    view: finance_review_queue
  - zone: assistant_surface
    objectKind: thread
    selectionMode: primary
    view: assistant_thread
  - zone: artifact_surface
    objectKind: artifact
    selectionMode: primary
    view: recommendation_report
  - zone: knowledge_panel
    objectKind: knowledge_source
    selectionMode: collection
    view: financial_evidence
  - zone: agent_panel
    objectKind: run
    selectionMode: collection
    view: agent_runs
  - zone: action_panel
    objectKind: action
    selectionMode: collection
    view: approval_actions

artifacts:
  - type: recommendation-report
    primary: true
  - type: risk-memo
  - type: approval-brief

actions:
  - type: approve
  - type: reject
  - type: request-revision
  - type: escalate
  - type: create-followup-task

playbooks:
  - type: finance-review
```

## Typical Flow

1. A vendor evaluation or budget review is opened as a work item.
2. A coordinator agent creates analysis, risk, and review work items.
3. Agents gather contracts, budgets, prior approvals, metrics, and notes as knowledge sources.
4. The platform produces a recommendation-report artifact as the primary artifact.
5. Supporting artifacts may be generated, such as a risk memo or approval brief.
6. Users review the recommendation, inspect sources, and take approval or follow-up actions.

## Composition Reading

1. `WorkItem` stays the business anchor for the active finance case.
2. `Artifact` stays the durable center for the recommendation report and supporting review artifacts.
3. `KnowledgeSource` grounds the review in numbers, source documents, and prior decisions.
4. `Action` carries the explicit next steps such as approval, escalation, or revision.
5. `Run` explains what agents are doing while gathering, analyzing, and drafting.

## Runtime Interpretation

1. A risk review skill may emit an event that the recommendation requires escalation.
2. The interpreter can surface that as a visible approval or escalation flow.
3. The recommendation report remains an `Artifact`.
4. The escalation or approval remains an `Action`.
5. The execution trace remains a `Run`.
