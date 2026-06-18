# Partner Workspace

## Goal

Prove that an operational, high-frequency workflow can be expressed on the same platform as the decision workspace.

This workspace is the clearest proof point for metadata-driven composition because the shell needs to stay flexible while the underlying domain model stays stable.

## Visual Reference

- [Partner Workspace Original](../images/originals/partner-workspace.png)

## Platform Reading

For a partner or renewal workflow:

1. the `WorkItem` is the partner case or renewal case
2. the `Workspace` is the collaboration container
3. the `Artifacts` are results like analysis, proposal draft, outreach draft, and resolution package
4. the `Actions` are business next steps such as apply recommendation, create proposal, or schedule outreach

## Workspace Definition

```yaml
workspace:
  id: partner-operations-v1
  type: partner-operations
  version: 1
  displayName: Partner Operations Workspace
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
    view: partner_summary
  - zone: queue
    objectKind: work_item
    selectionMode: collection
    view: renewal_queue
  - zone: assistant_surface
    objectKind: thread
    selectionMode: primary
    view: assistant_thread
  - zone: artifact_surface
    objectKind: artifact
    selectionMode: primary
    view: renewal_analysis
  - zone: knowledge_panel
    objectKind: knowledge_source
    selectionMode: collection
    view: account_evidence
  - zone: agent_panel
    objectKind: run
    selectionMode: collection
    view: agent_runs
  - zone: action_panel
    objectKind: action
    selectionMode: collection
    view: recommended_actions

artifacts:
  - type: renewal-analysis
    primary: true
  - type: proposal-draft
  - type: outreach-draft

actions:
  - type: apply-recommendation
  - type: create-proposal
  - type: schedule-call
  - type: open-support-ticket
  - type: add-internal-note

playbooks:
  - type: renewal-review
```

## Typical Flow

1. A renewal case enters the queue as a work item.
2. A workspace opens around that work item.
3. Agents gather account, product, support, and usage context.
4. The AI assistant synthesizes the case, answers follow-up questions, and recommends next steps.
5. The platform produces a renewal-analysis artifact.
6. Additional artifacts may be generated, such as proposal and outreach drafts.
7. Users review recommendations and execute actions.

## Composition Reading

1. `WorkItem` stays the business anchor for the active renewal case.
2. `Artifact` stays the durable center for the renewal analysis, proposal draft, or outreach draft.
3. `Action` carries the business next steps such as proposal approval or outreach scheduling.
4. `Run` explains what agents are actively doing behind the scenes.
5. Composition metadata decides where each of those objects shows up on screen.

## Runtime Interpretation

1. A coordinator agent may emit an event that pricing approval is required.
2. The interpreter can open `modal_surface` with an approval component.
3. The durable recommendation still remains in the relevant `Artifact`.
4. The approval request still remains an `Action`.
5. The execution trace still remains a `Run`.
