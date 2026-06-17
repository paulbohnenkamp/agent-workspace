# HR Workspace

## Goal

Prove that a people-operations workflow with sensitive inputs, human review, and approval gates can be expressed on the same platform as other workspace types.

This vertical matters because HR work combines structured case handling with nuanced judgment. It is a good test of whether the platform can support grounded, reviewable agent workflows without collapsing into a chat-only or form-only model.

## Visual Reference

- [HR Workspace Original](../images/originals/hr-workspace.png)

## Platform Reading

For an HR workflow:

1. the `Work Item` is the candidate case, promotion case, onboarding case, or manager-support case
2. the `Workspace` is the collaboration container around that case
3. the `Outputs` are results like evaluation summaries, promotion briefs, onboarding plans, or manager guidance drafts
4. the `Actions` are next steps such as approve, request revision, advance candidate, schedule follow-up, or create a task

## Workspace Definition

```json
{
  "workspaceType": "hr-operations",
  "workItemType": "candidate-review",
  "primaryOutputType": "evaluation-summary",
  "relatedOutputTypes": ["interview-brief", "follow-up-draft"],
  "agentRoles": ["research", "review", "policy", "editor", "coordinator"],
  "actionTypes": [
    "advance-candidate",
    "request-revision",
    "schedule-interview",
    "create-followup-task",
    "archive-case"
  ]
}
```

## Why This Vertical Matters

1. HR workflows are high-context and often involve multiple reviewers, but still need durable outputs and clear next steps.
2. The system must keep source grounding and approval behavior visible without exposing sensitive internal reasoning as the main record.
3. The platform needs to support both narrative outputs and operational actions in the same workspace.
4. This is a strong test of human-in-the-loop design because the user is not simply asking for a draft; they are moving a consequential case forward.

## Typical Flow

1. A candidate review case is opened as a work item.
2. A coordinator agent assigns research, review, or policy-check tasks.
3. Agents gather interview notes, job requirements, feedback, and policy context as knowledge sources.
4. The platform produces an evaluation summary as the primary output.
5. Additional outputs may be created, such as an interview brief or follow-up draft.
6. Users review the case, request revisions if needed, and take next-step actions.

## Composition Reading

1. `Work Item` stays the business anchor for the hiring or people case.
2. `Output` stays the durable center for the evaluation summary or briefing artifact.
3. `Knowledge Source` grounds claims in interviews, notes, job criteria, or policy materials.
4. `Action` carries the operational next steps such as advancing, revising, scheduling, or closing the case.
5. `Run` explains which agents or skills are currently gathering, checking, or drafting.

## Why This Workspace Matters

This workspace is a good pressure test because it blends:

1. sensitive context
2. multiple reviewers
3. structured outputs
4. explicit approval and follow-up actions

That combination checks whether the platform can support consequential internal workflows without introducing domain-specific foundational objects for HR.

## Example Composition Definition

```json
{
  "workspaceType": "hr-operations",
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
    { "zoneKey": "header", "objectKind": "work_item", "selectionMode": "primary", "viewKey": "candidate_summary" },
    { "zoneKey": "work_queue", "objectKind": "task", "selectionMode": "collection", "viewKey": "review_queue" },
    { "zoneKey": "assistant_surface", "objectKind": "thread", "selectionMode": "primary", "viewKey": "assistant_thread" },
    { "zoneKey": "primary_output", "objectKind": "output", "selectionMode": "primary", "viewKey": "evaluation_summary" },
    { "zoneKey": "supporting_output", "objectKind": "output", "selectionMode": "related", "viewKey": "case_artifacts" },
    { "zoneKey": "knowledge_panel", "objectKind": "knowledge_source", "selectionMode": "collection", "viewKey": "review_evidence" },
    { "zoneKey": "agent_panel", "objectKind": "run", "selectionMode": "collection", "viewKey": "agent_runs" },
    { "zoneKey": "action_bar", "objectKind": "action", "selectionMode": "collection", "viewKey": "case_actions" }
  ]
}
```

## Runtime Interpretation

1. A policy-check skill may emit a runtime event that the evaluation summary needs clarification before advancement.
2. The interpreter can surface that as a visible approval or revision step without changing the durable case model.
3. The evaluation summary remains an `Output`.
4. The advancement or revision request remains an `Action`.
5. The execution trace remains a `Run`.

## Success Condition

If an HR case can be modeled through the existing workspace, work item, output, knowledge source, action, and run abstractions, then the platform is holding at the right level of generality for internal people workflows.
