# Workspace Composition Model

## Purpose

This document defines the metadata-driven interpreter layer for workspace UI composition and runtime presentation.

It exists to capture the value of schema-driven rendering without weakening the platform rule that the architecture remains centered on `Output`.

## Core Thesis

1. The platform core is still the persisted business model: `Workspace`, `Work Item`, `Output`, `Agent`, `Skill`, `Tool`, `Knowledge Source`, `Action`, `Task`, `Thread`, and `Run`.
2. Workspace composition is a separate layer that decides how those objects are presented, arranged, and inspected in a runtime UI.
3. Metadata-driven rendering belongs in workspace configuration and interpreter logic, not in the core object model.
4. Agent-emitted runtime state may influence the UI shell, but it must not replace durable platform objects as the architectural center.

## Why This Layer Exists

1. Different workspace types need different shells even when they share the same core objects.
2. Operational workspaces often need multiple coordinated panels such as work queue, AI assistant, output, knowledge inspection, agents, and actions.
3. Agentic systems benefit from dynamic UI updates that can be driven by metadata rather than hard-coded screens.
4. A component registry and workspace interpreter make it possible to reuse the same rendering engine across decision, partner, incident, and research workflows.

## Layer Separation

### Layer 1: Core Domain Model

1. Persists the business truth of the system.
2. Owns lifecycle, permissions, identity, and traceability.
3. Includes `Output` as the durable center of user-facing work.

### Layer 2: Workspace Composition Model

1. Defines zones, panels, component bindings, and layout behavior.
2. Chooses how core objects surface in a particular workspace type.
3. May vary by workspace type without changing the core model.

### Layer 3: Runtime Presentation State

1. Reflects transient execution signals such as active agent, in-progress step, approval waits, or streaming events.
2. May be emitted by agents or orchestration services at runtime.
3. Should link back to persisted `Run`, `Task`, `Action`, and `Output` objects where applicable.

## Conceptual Mapping From Wizard Systems

The platform extends the wizard framework pattern (metadata-driven UI composition) to agent-orchestrated workflows:

1. **Wizard schema → Workspace composition schema**: Rather than hard-coded screens for each workflow type, workspace UI is defined declaratively via metadata.
2. **Field registry → Component registry**: A reusable library of UI components (queue view, assistant surface, output editor, action panel, agent roster, etc.) is bound to domain objects via configuration, not code.
3. **Wizard JSON → Workspace + runtime metadata**: Durable workspace composition definitions drive shell layout and binding; runtime event metadata drives transient state (active run, streaming section, pending approval).
4. **Step layout → Workspace zones and panel rules**: What the wizard calls "steps" become zones (header, navigation, assistant surface, output, knowledge panel, agent panel, action bar) with composition rules that vary by workspace type.
5. **Wizard runtime → Agent-aware interpreter**: A metadata-driven interpreter renders the workspace shell, binds components to core objects, and responds to agent runtime signals without embedding business logic in the UI.

**Why this matters for agents**: Different workspace types (decision, partner operations, incident, research) need different shells but share the same core domain model. Metadata-driven composition means you define `Output` structure once, then render it differently in different workspaces. A research agent's output and a partner operations agent's output are both `Output` objects—the difference is zones, panel layouts, and which components are visible. This eliminates duplicate UI code, enables skill and agent reuse across workspace types, and keeps the architecture stable as new workflow types are added.

## Design Rule

1. Do not treat agent workflow JSON as the primary platform object.
2. Do treat metadata as the composition mechanism that helps the UI render and adapt around stable platform objects.
3. When a runtime concept needs a durable lifecycle, separate permissions, or traceable linkage, promote it into an existing core object or add a new core object deliberately through architecture review.

## Composition Responsibilities

1. Define the workspace shell for a workspace type.
2. Declare which zones are visible by default.
3. Bind UI regions to one or more core objects.
4. Select components from a registry using metadata instead of hard-coded page logic.
5. Support dynamic runtime updates without making the UI dependent on opaque prompt text.
6. Keep approvals, actions, and output updates visible and traceable.

## Workspace Zones

1. `header`: stable work-item context and top-level status.
2. `navigation`: task queue, workspace queue, or object switching surface.
3. `assistant_surface`: user questions, assistant synthesis, and follow-up interactions.
4. `primary_output`: the main durable result under active review or editing.
5. `supporting_output`: secondary drafts, analyses, or linked deliverables.
6. `knowledge_panel`: grounding material and provenance inspection.
7. `agent_panel`: agent roster or run-derived agent-state summary.
8. `action_bar`: approvals, escalations, exports, and other next steps.
9. `modal_surface`: interruptive flows such as approval gates or conflict resolution.

## Component Registry

1. The registry maps `componentType` to a renderable UI component.
2. The registry should stay generic and reusable across workspace types.
3. Registry entries should declare the object kinds or view models they expect.

```ts
interface ComponentRegistryEntry {
  key: string;
  supportedObjectKinds: string[];
  description: string;
  runtimeCapabilities: string[];
}
```

## Suggested Composition Shape

```ts
interface WorkspaceCompositionDefinition {
  workspaceType: string;
  version: number;
  description?: string;
  zones: WorkspaceZoneDefinition[];
  componentBindings: ComponentBinding[];
  componentRegistryKeys?: string[];
  outputViewBindings?: OutputViewBinding[];
  approvalFlows?: ApprovalFlowDefinition[];
  runtimePolicies: RuntimePresentationPolicy[];
}

interface WorkspaceZoneDefinition {
  key: string;
  title?: string;
  componentType: string;
  priority: "primary" | "secondary" | "supporting";
  collapsible?: boolean;
  defaultState?: "expanded" | "collapsed" | "hidden";
  placement?: "top" | "left" | "center" | "right" | "bottom" | "modal";
}

interface ComponentBinding {
  zoneKey: string;
  objectKind: "workspace" | "work_item" | "output" | "thread" | "knowledge_source" | "action" | "run" | "task";
  selectionMode: "primary" | "related" | "collection";
  viewKey: string;
}

interface OutputViewBinding {
  outputType: string;
  componentType: string;
  sectionViewMap: Record<string, string>;
}

interface ApprovalFlowDefinition {
  key: string;
  actionType: string;
  componentType: string;
  targetZoneKey: string;
}

interface RuntimePresentationPolicy {
  trigger: string;
  effect: string;
}
```

## Schema Appendix

1. `WorkspaceCompositionDefinition` is the durable definition for how a workspace type should render.
2. `componentRegistryKeys` allows composition definitions to declare their allowed component surface explicitly.
3. `outputViewBindings` keeps output rendering aligned with the output type registry rather than mixing section logic into arbitrary page code.
4. `approvalFlows` captures which business actions trigger approval-specific UI patterns.
5. `runtimePolicies` governs presentational behavior in response to runtime signals, but should avoid embedding hidden business logic.

```ts
type WorkspaceObjectKind =
  | "workspace"
  | "work_item"
  | "output"
  | "thread"
  | "knowledge_source"
  | "action"
  | "run"
  | "task";

interface RuntimeViewState {
  workspaceId: string;
  activeRunId?: string;
  highlightedOutputId?: string;
  waitingApprovalActionId?: string;
  openModalKey?: string;
  zoneStates: Record<string, "expanded" | "collapsed" | "hidden">;
  streamStates: Record<string, "idle" | "streaming" | "complete" | "error">;
}

interface RuntimeEventEnvelope {
  type:
    | "run.started"
    | "run.updated"
    | "run.completed"
    | "output.section_updating"
    | "output.section_updated"
    | "action.approval_requested"
    | "action.approved"
    | "artifact.available";
  workspaceId: string;
  objectKind?: WorkspaceObjectKind;
  objectId?: string;
  payload: Record<string, unknown>;
  occurredAt: string;
}
```

## Registry Guidance

1. Keep the component registry generic enough to survive vertical changes.
2. Bind domain-specific differences through `viewKey`, metadata, and output-type configuration rather than one-off components for every workflow.
3. Separate rendering capability from business permission. A component being able to render an `Action` does not mean the user can execute that action.

```ts
interface ComponentRegistryEntry {
  key: string;
  supportedObjectKinds: WorkspaceObjectKind[];
  supportedViews?: string[];
  acceptsCollections?: boolean;
  requiresStreaming?: boolean;
  supportsInspection?: boolean;
  description: string;
  runtimeCapabilities: string[];
}
```

## Output Rendering Appendix

1. Output rendering should be coordinated with the output type registry, not reinvented per workspace.
2. A workspace may choose different components for the same output type depending on context, but the output type still owns the durable section structure.
3. This preserves the rule that metadata helps present outputs without redefining what an output is.

```ts
interface OutputTypeDefinition {
  name: string;
  key: string;
  description: string;
  sectionDefinitions: SectionDefinition[];
  knowledgeSourceTypes: string[];
  actionTypes: string[];
  agentRoles: string[];
  metadataSchema: Record<string, unknown>;
  defaultViewKey?: string;
}

interface OutputSectionViewDefinition {
  viewKey: string;
  supportedKinds: Array<"text" | "table" | "list" | "score" | "timeline" | "custom">;
  componentType: string;
}
```

## Runtime State Guidance

1. Runtime metadata may describe in-progress orchestration such as active phase, waiting approval, artifact produced, or handoff pending.
2. Runtime metadata should be treated as inspectable operational state, not as the sole record of business progress.
3. If an agent says a recommendation is complete, the durable result should be reflected in `Output`, `Action`, `Task`, or `Run` rather than living only inside transient metadata.

## Minimal Example

```json
{
  "workspaceType": "partner-operations",
  "version": 1,
  "zones": [
    { "key": "header", "componentType": "work_item_header", "priority": "primary", "placement": "top" },
    { "key": "assistant_surface", "componentType": "assistant_surface", "priority": "secondary", "placement": "left" },
    { "key": "primary_output", "componentType": "output_editor", "priority": "primary", "placement": "center" },
    { "key": "knowledge_panel", "componentType": "source_inspector", "priority": "supporting", "placement": "right", "collapsible": true },
    { "key": "agent_panel", "componentType": "agent_roster", "priority": "supporting", "placement": "right", "collapsible": true },
    { "key": "action_bar", "componentType": "action_strip", "priority": "primary", "placement": "right" }
  ],
  "componentBindings": [
    { "zoneKey": "header", "objectKind": "work_item", "selectionMode": "primary", "viewKey": "partner_summary" },
    { "zoneKey": "assistant_surface", "objectKind": "thread", "selectionMode": "primary", "viewKey": "assistant_thread" },
    { "zoneKey": "primary_output", "objectKind": "output", "selectionMode": "primary", "viewKey": "renewal_plan" },
    { "zoneKey": "knowledge_panel", "objectKind": "knowledge_source", "selectionMode": "collection", "viewKey": "evidence_list" },
    { "zoneKey": "agent_panel", "objectKind": "run", "selectionMode": "collection", "viewKey": "agent_runs" },
    { "zoneKey": "action_bar", "objectKind": "action", "selectionMode": "collection", "viewKey": "recommended_actions" }
  ],
  "outputViewBindings": [
    {
      "outputType": "renewal-analysis",
      "componentType": "output_editor",
      "sectionViewMap": {
        "summary": "summary_card",
        "recommendations": "recommendation_list",
        "risks": "risk_grid",
        "next_steps": "action_link_list"
      }
    }
  ],
  "approvalFlows": [
    {
      "key": "proposal_approval",
      "actionType": "create-proposal",
      "componentType": "approval_gate",
      "targetZoneKey": "modal_surface"
    }
  ]
}
```

## Partner Operations Interpretation

This is a concrete example of how metadata-driven composition enables reuse:

1. Partner, HR, finance, and decision workspaces all use the same core objects (`Output`, `Action`, `Run`, `Task`, `Thread`) but render them differently.
2. The partner renewal workspace binds zones to objects like this: header shows work item, left queue shows active cases, center-left assistant surface shows agent/user synthesis, center shows renewal-analysis output, right rail shows knowledge sources, agents, and actions.
3. An HR or finance workspace uses the same component registry but rearranges emphasis: the output type changes, the knowledge sources change, and the agent roster highlights different specialist roles.
4. Agents emit the same runtime signals (`run.started`, `output.section_updated`, `action.approval_requested`) into each workspace; the interpreter applies the workspace-specific composition rules to render them appropriately.
5. Because the core objects and skill definitions are stable, each workspace can invoke the same research agent or risk assessment agent without code changes. The UI shell adapts; the orchestration stays the same.
6. This is where the wizard pattern delivers its value: different experiences, same underlying model and components.

## Boundary Tests

1. If the concept is a durable result, it belongs in `Output`, not only in composition metadata.
2. If the concept is a business next step, it belongs in `Action` or `Task`, not only in workflow JSON.
3. If the concept is an execution instance, it belongs in `Run`, even if the UI also renders it in an activity feed.
4. If the concept only changes presentation, zoning, or rendering behavior, keep it in workspace composition.

## Relationship To Existing Docs

1. [Workspace Model](workspace-model.md) defines the collaboration container and its responsibilities.
2. [Output Model](output-model.md) defines the durable result model that remains central.
3. [UI Domain Mapping](ui-domain-mapping.md) shows how different surfaces can expose the same stable objects.
4. This document adds the interpreter layer that sits between stable objects and variable UI shells.

## Open Questions

1. Should workspace composition definitions be versioned independently from workspace instances?
2. Which runtime presentation events deserve persistence for auditability versus transient display only?
3. How much agent-emitted UI metadata should be accepted directly versus normalized by a server-side orchestration layer?
