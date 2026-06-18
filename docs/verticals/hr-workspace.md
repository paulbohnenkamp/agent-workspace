# HR Workspace

## Goal

Prove that a people-operations workflow with sensitive inputs, human review, and approval gates can be expressed on the same platform as other workspace types.

This vertical matters because HR work combines structured case handling with nuanced judgment.

## Visual Reference

- [HR Workspace Original](../images/originals/hr-workspace.png)

## Platform Reading

For an HR workflow:

1. the `WorkItem` is the candidate case, promotion case, onboarding case, manager-support case, or a task-shaped work item derived from those cases
2. the `Workspace` is the collaboration container around that case
3. the `Artifacts` are results like evaluation summaries, promotion briefs, onboarding plans, or manager guidance drafts
4. the `Actions` are next steps such as approve, request revision, advance candidate, schedule follow-up, or create another work item

## Workspace Definition

```yaml
workspace:
  id: hr-operations-v1
  type: hr-operations
  version: 1
  displayName: HR Operations Workspace
  layout: operational

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
    view: candidate_summary
  - zone: queue
    objectKind: work_item
    selectionMode: collection
    view: review_queue
  - zone: assistant_surface
    objectKind: thread
    selectionMode: primary
    view: assistant_thread
  - zone: artifact_surface
    objectKind: artifact
    selectionMode: primary
    view: evaluation_summary
  - zone: knowledge_panel
    objectKind: knowledge_source
    selectionMode: collection
    view: review_evidence
  - zone: agent_panel
    objectKind: run
    selectionMode: collection
    view: agent_runs
  - zone: action_panel
    objectKind: action
    selectionMode: collection
    view: case_actions

artifacts:
  - type: evaluation-summary
    primary: true
  - type: interview-brief
  - type: follow-up-draft

actions:
  - type: advance-candidate
  - type: request-revision
  - type: schedule-interview
  - type: create-followup-task
  - type: archive-case

playbooks:
  - type: candidate-review
```

## Typical Flow

1. A candidate review case is opened as a work item.
2. A coordinator agent assigns research, review, or policy-check work items.
3. Agents gather interview notes, job requirements, feedback, and policy context as knowledge sources.
4. The platform produces an evaluation-summary artifact as the primary artifact.
5. Additional artifacts may be created, such as an interview brief or follow-up draft.
6. Users review the case, request revisions if needed, and take next-step actions.

## Composition Reading

1. `WorkItem` stays the business anchor for the hiring or people case.
2. `Artifact` stays the durable center for the evaluation summary or briefing artifact.
3. `KnowledgeSource` grounds claims in interviews, notes, job criteria, or policy materials.
4. `Action` carries the operational next steps such as advancing, revising, scheduling, or closing the case.
5. `Run` explains which agents or skills are currently gathering, checking, or drafting.

## Runtime Interpretation

1. A policy-check skill may emit an event that the evaluation summary needs clarification before advancement.
2. The interpreter can surface that as a visible approval or revision step without changing the durable case model.
3. The evaluation summary remains an `Artifact`.
4. The advancement or revision request remains an `Action`.
5. The execution trace remains a `Run`.
