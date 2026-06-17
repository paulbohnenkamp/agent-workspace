# Finance Workspace

## Goal

Prove that a finance-oriented review workflow with structured analysis, traceability, and approval-heavy decisions can be represented as a workspace configuration on the same platform.

This vertical matters because finance work depends on durable outputs, explicit evidence, and clearly auditable next steps. It tests whether the platform can support structured business review without needing finance-specific foundational objects.

## Visual Reference

- [Finance Workspace Original](../images/originals/finance-workspace.png)

## Platform Reading

For a finance workflow:

1. the `Work Item` is the budget case, vendor evaluation, forecast review, or variance investigation
2. the `Workspace` is the collaboration container around that business case
3. the `Outputs` are results like financial reviews, recommendation reports, approval memos, or follow-up analyses
4. the `Actions` are next steps such as approve, reject, request revision, escalate, or create follow-up work

## Workspace Definition

```json
{
  "workspaceType": "finance-review",
  "workItemType": "vendor-evaluation",
  "primaryOutputType": "recommendation-report",
  "relatedOutputTypes": ["risk-memo", "approval-brief"],
  "agentRoles": ["analyst", "risk", "review", "editor", "coordinator"],
  "actionTypes": [
    "approve",
    "reject",
    "request-revision",
    "escalate",
    "create-followup-task"
  ]
}
```

## Why This Vertical Matters

1. Finance workflows often require structured evidence, explicit recommendations, and human approval before action.
2. The workspace needs to support both analysis and execution readiness without treating a spreadsheet or chat thread as the sole system of record.
3. This is a strong test of traceability because claims need visible grounding in documents, metrics, or policy references.
4. The domain is different from HR or partner operations, so it helps validate that the platform abstractions are genuinely reusable.

## Typical Flow

1. A vendor evaluation or budget review is opened as a work item.
2. A coordinator agent creates analysis, risk, and review tasks.
3. Agents gather contracts, budgets, prior approvals, metrics, and notes as knowledge sources.
4. The platform produces a recommendation report as the primary output.
5. Supporting outputs may be generated, such as a risk memo or approval brief.
6. Users review the recommendation, inspect sources, and take approval or follow-up actions.

## Composition Reading

1. `Work Item` stays the business anchor for the active finance case.
2. `Output` stays the durable center for the recommendation report and supporting review artifacts.
3. `Knowledge Source` grounds the review in numbers, source documents, and prior decisions.
4. `Action` carries the explicit next steps such as approval, escalation, or revision.
5. `Run` explains what agents are doing while gathering, analyzing, and drafting.

## Why This Workspace Matters

This workspace pressure-tests the architecture around:

1. structured evidence
2. auditable recommendations
3. approval-heavy workflows
4. multiple related outputs

It is useful because the same platform nouns should still work even when the user expects a more formal, traceable review process.

## Example Composition Definition

```json
{
  "workspaceType": "finance-review",
  "version": 1,
  "zones": [
    { "key": "header", "componentType": "work_item_header", "priority": "primary", "placement": "top" },
    { "key": "work_queue", "componentType": "queue_view", "priority": "secondary", "placement": "left" },
    { "key": "assistant_surface", "componentType": "assistant_surface", "priority": "secondary", "placement": "left" },
    { "key": "primary_output", "componentType": "output_editor", "priority": "primary", "placement": "center" },
    { "key": "supporting_output", "componentType": "artifact_tabs", "priority": "secondary", "placement": "center" },
    { "key": "knowledge_panel", "componentType": "source_inspector", "priority": "supporting", "placement": "right", "collapsible": true },
    { "key": "agent_panel", "componentType": "agent_roster", "priority": "supporting", "placement": "right", "collapsible": true },
    { "key": "action_bar", "componentType": "action_strip", "priority": "primary", "placement": "right" },
    { "key": "modal_surface", "componentType": "approval_gate", "priority": "supporting", "placement": "modal" }
  ],
  "componentBindings": [
    { "zoneKey": "header", "objectKind": "work_item", "selectionMode": "primary", "viewKey": "finance_case_summary" },
    { "zoneKey": "work_queue", "objectKind": "task", "selectionMode": "collection", "viewKey": "finance_review_queue" },
    { "zoneKey": "assistant_surface", "objectKind": "thread", "selectionMode": "primary", "viewKey": "assistant_thread" },
    { "zoneKey": "primary_output", "objectKind": "output", "selectionMode": "primary", "viewKey": "recommendation_report" },
    { "zoneKey": "supporting_output", "objectKind": "output", "selectionMode": "related", "viewKey": "review_artifacts" },
    { "zoneKey": "knowledge_panel", "objectKind": "knowledge_source", "selectionMode": "collection", "viewKey": "financial_evidence" },
    { "zoneKey": "agent_panel", "objectKind": "run", "selectionMode": "collection", "viewKey": "agent_runs" },
    { "zoneKey": "action_bar", "objectKind": "action", "selectionMode": "collection", "viewKey": "approval_actions" }
  ]
}
```

## Runtime Interpretation

1. A risk review skill may emit a runtime event that the recommendation requires escalation.
2. The interpreter can surface that as a visible approval or escalation flow.
3. The recommendation report remains an `Output`.
4. The escalation or approval remains an `Action`.
5. The execution trace remains a `Run`.

This keeps the finance workflow inspectable and auditable without turning live workflow events into the primary system of record.

## Success Condition

If a finance review can be represented through the same core workspace and output abstractions as the other verticals, then the platform is flexible enough for structured internal business workflows beyond a single domain.
