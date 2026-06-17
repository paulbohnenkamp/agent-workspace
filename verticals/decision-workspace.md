# Decision Workspace

## Goal

Prove that a decision-oriented product can be represented as a workspace configuration on the platform rather than as a separate architecture.

This workspace now serves as the second vertical validation after the partner workspace. Its role is to confirm that the same platform nouns still hold when the experience becomes more review-heavy, document-centric, and approval-oriented.

## Visual Reference

- [Decision Workspace Original](../images/originals/decision-workspace.png)

## Platform Reading

For a decision workflow:

1. the `Work Item` is the decision case under active review
2. the `Workspace` is the collaboration container around that case
3. the `Outputs` are results like decision reports, risk analyses, option comparisons, or follow-up briefs
4. the `Actions` are next steps such as approve, request revision, export, or create follow-up work

## Workspace Definition

```json
{
  "workspaceType": "decision",
  "workItemType": "decision-case",
  "primaryOutputType": "decision-report",
  "agentRoles": ["research", "analyst", "risk", "editor"],
  "actionTypes": ["approve", "request-revision", "export", "create-followup-task"]
}
```

## Typical Flow

1. A user opens a decision workspace around a decision case.
2. A coordinator or research agent creates initial tasks.
3. Agents collect knowledge, synthesize evidence, and draft output sections.
4. The AI assistant answers follow-up questions and recommends next steps as the case evolves.
5. The output is reviewed by users and optionally other agents.
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

## Interaction Notes

- the decision case should stay fixed as the top-level context
- the AI assistant surface should act as the request and synthesis layer, not the system of record
- the output should remain the visual center of gravity
- approval actions should stay anchored and visible
- knowledge sources, agents, and actions should remain visible in a stable right rail

## Composition Reading

1. `Work Item` stays the business anchor for the active decision case.
2. `Output` stays the durable center for the decision report and related analyses.
3. `Knowledge Source` grounds the report in documents, models, and supporting evidence.
4. `Action` carries the review and approval next steps.
5. `Run` explains what agents are actively doing while collecting, synthesizing, and drafting.

## Why This Workspace Matters

This workspace is valuable because it pressure-tests the platform around:

1. review-heavy work
2. structured recommendations
3. evidence-driven conclusions
4. explicit approval decisions

It confirms that the platform does not need a special foundational `decision` object in order to support consequential decision workflows.

## Example Composition Definition

```json
{
  "workspaceType": "decision",
  "version": 1,
  "zones": [
    { "key": "header", "componentType": "work_item_header", "priority": "primary", "placement": "top" },
    { "key": "work_queue", "componentType": "queue_view", "priority": "secondary", "placement": "left" },
    { "key": "assistant_surface", "componentType": "assistant_surface", "priority": "secondary", "placement": "left" },
    { "key": "primary_output", "componentType": "output_editor", "priority": "primary", "placement": "center" },
    { "key": "supporting_output", "componentType": "artifact_tabs", "priority": "secondary", "placement": "center" },
    { "key": "knowledge_panel", "componentType": "source_inspector", "priority": "supporting", "placement": "right", "collapsible": true },
    { "key": "agent_panel", "componentType": "agent_roster", "priority": "supporting", "placement": "right", "collapsible": true },
    { "key": "action_bar", "componentType": "action_strip", "priority": "primary", "placement": "right" }
  ],
  "componentBindings": [
    { "zoneKey": "header", "objectKind": "work_item", "selectionMode": "primary", "viewKey": "decision_case_summary" },
    { "zoneKey": "work_queue", "objectKind": "task", "selectionMode": "collection", "viewKey": "decision_queue" },
    { "zoneKey": "assistant_surface", "objectKind": "thread", "selectionMode": "primary", "viewKey": "assistant_thread" },
    { "zoneKey": "primary_output", "objectKind": "output", "selectionMode": "primary", "viewKey": "decision_report" },
    { "zoneKey": "supporting_output", "objectKind": "output", "selectionMode": "related", "viewKey": "decision_artifacts" },
    { "zoneKey": "knowledge_panel", "objectKind": "knowledge_source", "selectionMode": "collection", "viewKey": "decision_evidence" },
    { "zoneKey": "agent_panel", "objectKind": "run", "selectionMode": "collection", "viewKey": "agent_runs" },
    { "zoneKey": "action_bar", "objectKind": "action", "selectionMode": "collection", "viewKey": "decision_actions" }
  ]
}
```

## Runtime Interpretation

1. A risk or research agent may surface uncertainty or a recommendation change while the case is under review.
2. The AI assistant can answer follow-up questions without becoming the durable record itself.
3. The decision report remains an `Output`.
4. The approval or revision request remains an `Action`.
5. The execution trace remains a `Run`.

## Why This Works As A Workspace Type

Nothing in the flow above requires `decision` to be a foundational platform object.

The workspace is expressed through:

- workspace type
- work item type
- output type
- agent mix
- action set
- section definitions

That is the test the platform needs to pass.

As a second vertical, it is especially useful because it checks that the platform does not overfit to operational queue-driven work. If the same model still works here, the architecture is holding at the right level of abstraction.

## Failure Condition

If we discover that decision work requires unique foundational objects that cannot be generalized, then the platform abstraction is too thin or incorrectly named.
