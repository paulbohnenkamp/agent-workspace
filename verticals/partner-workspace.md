# Partner Workspace

## Goal

Prove that an operational, high-frequency workflow can be expressed on the same platform as the decision workspace.

This workspace is also the clearest proof point for metadata-driven composition because the UI shell needs to stay flexible while the underlying domain model stays stable.

## Visual Reference

- [Partner Workspace Original](../images/originals/partner-workspace.png)

## Platform Reading

For a partner or renewal workflow:

1. the `Work Item` is the partner case or renewal case
2. the `Workspace` is the collaboration container
3. the `Outputs` are results like analysis, proposal draft, outreach draft, and resolution package
4. the `Actions` are business next steps such as apply recommendation, create proposal, or schedule outreach

## Workspace Definition

```json
{
  "workspaceType": "partner-operations",
  "workItemType": "partner-renewal",
  "primaryOutputType": "renewal-analysis",
  "relatedOutputTypes": ["outreach-draft", "proposal-draft"],
  "agentRoles": ["renewal", "licensing", "support", "knowledge", "coordinator"],
  "actionTypes": [
    "apply-recommendation",
    "create-proposal",
    "schedule-call",
    "open-support-ticket",
    "add-internal-note"
  ]
}
```

## Why This Vertical Matters For Metadata-Driven UI

1. Partner operations work is repetitive in shape but variable in detail.
2. The shell needs to handle queue navigation, live agent progress, approval gates, output editing, and quick actions at the same time.
3. That makes hard-coded page logic expensive and brittle.
4. A metadata-driven interpreter lets the platform vary layout, component choice, and visibility rules without redefining the core objects.

## Typical Flow

1. A renewal case enters the queue as a work item.
2. A workspace opens around that work item.
3. Agents gather account, product, support, and usage context.
4. The AI assistant synthesizes the case, answers follow-up questions, and recommends next steps.
5. The platform produces a renewal-analysis output.
6. Additional outputs may be generated, such as proposal and outreach drafts.
7. Users review recommendations and execute actions.

## Composition Reading

1. `Work Item` stays the business anchor for the active renewal case.
2. `Output` stays the durable center for the renewal analysis, proposal draft, or outreach draft.
3. `Action` carries the business next steps such as proposal approval or outreach scheduling.
4. `Run` explains what agents are actively doing behind the scenes.
5. Composition metadata decides where each of those objects shows up on screen.

## Why This Workspace Matters

This is the pressure test for the architecture because it is not centered on a single polished report.

It is centered on a live business case with:

1. many tasks
2. multiple outputs
3. rapid back-and-forth
4. direct operational actions

That is why `Work Item` needs to exist alongside `Output`.

## Example Composition Definition

```json
{
  "workspaceType": "partner-operations",
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
    { "zoneKey": "header", "objectKind": "work_item", "selectionMode": "primary", "viewKey": "partner_summary" },
    { "zoneKey": "work_queue", "objectKind": "task", "selectionMode": "collection", "viewKey": "renewal_queue" },
    { "zoneKey": "assistant_surface", "objectKind": "thread", "selectionMode": "primary", "viewKey": "assistant_thread" },
    { "zoneKey": "primary_output", "objectKind": "output", "selectionMode": "primary", "viewKey": "renewal_analysis" },
    { "zoneKey": "supporting_output", "objectKind": "output", "selectionMode": "related", "viewKey": "draft_tabs" },
    { "zoneKey": "knowledge_panel", "objectKind": "knowledge_source", "selectionMode": "collection", "viewKey": "account_evidence" },
    { "zoneKey": "agent_panel", "objectKind": "run", "selectionMode": "collection", "viewKey": "agent_runs" },
    { "zoneKey": "action_bar", "objectKind": "action", "selectionMode": "collection", "viewKey": "recommended_actions" }
  ]
}
```

## Runtime Interpretation

1. A coordinator agent may emit a runtime event that pricing approval is required.
2. The interpreter can open `modal_surface` with an approval component.
3. The durable recommendation still remains in the relevant `Output`.
4. The approval request still remains an `Action`.
5. The execution trace still remains a `Run`.

This is the important separation: the UI can react dynamically without turning runtime workflow metadata into the platform’s source of truth.

## UI Mapping

A partner workspace usually presents:

1. left: work queue
2. center-left: AI assistant synthesis and follow-up conversation
3. center-right: work item overview, primary output, and supporting draft
4. right: knowledge sources, agents, and actions

## Generic Framing

1. This vertical is a strong match for organizations that need agents to assemble UI from metadata around a live operational case.
2. The reusable insight is not just that agents can drive steps.
3. The more durable pattern is that agents can drive a workspace interpreter that composes outputs, actions, approvals, artifacts, and activity around a stable business object model.
4. That makes metadata-driven workspace composition a practical evolution of earlier wizard-style UI patterns rather than a separate architectural category.

## Success Condition

If the operational workspace fits the same domain model as the decision workspace, the platform abstraction is on the right track.
