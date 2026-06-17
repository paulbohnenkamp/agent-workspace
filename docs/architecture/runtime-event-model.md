# Runtime Event Model

## Purpose

This document defines the transient runtime signals that help the workspace shell render live agent behavior.

It exists to support streaming, approvals, artifacts, retries, and resumable execution without weakening the rule that durable business state belongs in `Output`, `Action`, `Task`, `Knowledge Source`, and `Run`.

## Core Rule

1. Runtime events are operational signals, not the primary business record.
2. Durable state changes should be reflected back into persisted platform objects.
3. The UI may react immediately to runtime events, but the architecture should not depend on hidden event history as the sole system of record.

## Relationship To Core Objects

1. `Run` remains the main persisted record of execution.
2. `Action` remains the persisted record for approvals, execution requests, and business next steps.
3. `Output` remains the persisted record for durable content produced during the run.
4. `Task` remains the persisted record for tracked work assignments and dependencies.
5. `Knowledge Source` remains the persisted record for grounding material and published artifacts.

## Why Runtime Events Exist

1. Agentic workflows often unfold over time rather than completing in one response.
2. Users need inspectable visibility into activity without waiting for final persistence updates.
3. Human-in-the-loop moments such as approvals or clarifications need immediate UI reactions.
4. Artifacts, tool results, and output updates may arrive incrementally.
5. Resumable and branching workflows need a transient event layer that explains what is happening now.

## Runtime Event Families

1. `run.*`: run lifecycle events such as started, updated, paused, resumed, completed, or failed.
2. `task.*`: task creation, assignment, dependency changes, and completion updates.
3. `action.*`: approval requested, approved, rejected, queued, executed, or canceled.
4. `output.*`: section updating, section updated, output version created, or output published.
5. `artifact.*`: artifact available, artifact updated, artifact linked, or artifact failed.
6. `tool_call.*`: tool invocation started, progress updated, completed, or failed.
7. `branch.*`: branch created, branch selected, branch abandoned, or branch merged.
8. `retry.*`: retry scheduled, retry started, retry exhausted.
9. `handoff.*`: work transferred between agents, skills, or human operators.
10. `trace.*`: optional inspectable reasoning or decision trace events subject to policy boundaries.

## Event Envelope

```ts
type RuntimeEventType =
  | "run.started"
  | "run.updated"
  | "run.paused"
  | "run.resumed"
  | "run.completed"
  | "run.failed"
  | "task.created"
  | "task.updated"
  | "action.approval_requested"
  | "action.approved"
  | "action.rejected"
  | "action.executed"
  | "output.section_updating"
  | "output.section_updated"
  | "output.version_created"
  | "artifact.available"
  | "artifact.failed"
  | "tool_call.started"
  | "tool_call.progress"
  | "tool_call.completed"
  | "tool_call.failed"
  | "branch.created"
  | "branch.selected"
  | "branch.abandoned"
  | "retry.scheduled"
  | "retry.started"
  | "retry.exhausted"
  | "handoff.requested"
  | "handoff.accepted"
  | "trace.recorded";

interface RuntimeEventEnvelope {
  id: string;
  type: RuntimeEventType;
  workspaceId: string;
  threadId?: string;
  runId?: string;
  objectKind?: "task" | "action" | "output" | "artifact" | "tool_call" | "knowledge_source";
  objectId?: string;
  actorType?: "agent" | "skill" | "tool" | "user" | "system";
  actorKey?: string;
  occurredAt: string;
  payload: Record<string, unknown>;
}
```

## UI Contract Guidance

1. Events should be structured enough for the workspace shell to render them without workflow-specific screen code.
2. Event payloads should be typed by family rather than carried as opaque free-form text.
3. The shell should be able to route events into generic components such as:
   1. activity feed
   2. tool call inspector
   3. artifact viewer
   4. approval gate
   5. timeline
   6. branch graph
4. The shell should never need access to hidden chain-of-thought to stay functional.

## Approval Events

1. Approval events should point to a durable `Action`.
2. An approval gate may open immediately in response to `action.approval_requested`.
3. Approval completion should update both the runtime UI and the durable action state.

```ts
interface ApprovalRequestedPayload {
  actionId: string;
  actionType: string;
  title: string;
  requestedByAgentKey: string;
  targetRef?: string;
  justification?: string;
}
```

## Tool Call Events

1. Tool call events are useful for inspection, progress visibility, and debugging.
2. A tool call should remain subordinate to the `Run` that invoked it.
3. A failed tool call may trigger retry or branch events, but those follow-on decisions should still be visible as structured events rather than inferred from text.

```ts
interface ToolCallProgressPayload {
  toolCallId: string;
  toolKey: string;
  status: "started" | "in_progress" | "completed" | "failed";
  summary?: string;
  percentComplete?: number;
  artifactIds?: string[];
}
```

## Artifact Events

1. Artifacts are runtime-visible outputs such as files, logs, generated tables, drafts, or intermediate research bundles.
2. An artifact may remain transient, or it may later be promoted into an `Output` or `Knowledge Source`.
3. Artifact visibility should not require redefining every artifact as a durable first-class object before the product needs it.

```ts
interface ArtifactAvailablePayload {
  artifactId: string;
  artifactType: string;
  title: string;
  sourceRunId: string;
  viewerHint?: string;
  relatedOutputId?: string;
}
```

## Branch And Retry Guidance

1. Branch events explain conditional or parallel paths in the live workflow.
2. Retry events explain recovery behavior without requiring users to infer it from activity text.
3. When a branch or retry materially changes business state, the resulting decision should still be reflected in `Run`, `Task`, `Action`, or `Output`.

## Resumability Guidance

1. Resumability should be modeled as a combination of durable run state and transient runtime events.
2. The user should be able to see:
   1. what was in progress
   2. what is blocked
   3. what needs approval
   4. what can be resumed safely
3. A resumed workflow should continue from persisted state rather than only from cached UI memory.

## Reasoning Trace Boundary

1. The platform may expose reasoning-adjacent traces such as rationale summaries, policy checks, or decision checkpoints.
2. The platform should not assume unrestricted exposure of hidden internal reasoning.
3. Trace visibility should be policy-controlled and designed for inspection, trust, and debugging rather than raw model-thought dumping.

## Minimal Example

```json
[
  {
    "id": "evt_001",
    "type": "run.started",
    "workspaceId": "ws_123",
    "runId": "run_456",
    "actorType": "agent",
    "actorKey": "coordinator",
    "occurredAt": "2026-06-09T15:02:00Z",
    "payload": {
      "goal": "produce renewal analysis"
    }
  },
  {
    "id": "evt_002",
    "type": "tool_call.started",
    "workspaceId": "ws_123",
    "runId": "run_456",
    "objectKind": "tool_call",
    "objectId": "tool_001",
    "actorType": "tool",
    "actorKey": "crm_lookup",
    "occurredAt": "2026-06-09T15:02:02Z",
    "payload": {
      "toolKey": "crm_lookup",
      "status": "started"
    }
  },
  {
    "id": "evt_003",
    "type": "artifact.available",
    "workspaceId": "ws_123",
    "runId": "run_456",
    "objectKind": "artifact",
    "objectId": "art_778",
    "actorType": "system",
    "occurredAt": "2026-06-09T15:02:06Z",
    "payload": {
      "artifactId": "art_778",
      "artifactType": "usage_snapshot",
      "title": "Usage Snapshot",
      "sourceRunId": "run_456",
      "viewerHint": "table"
    }
  },
  {
    "id": "evt_004",
    "type": "action.approval_requested",
    "workspaceId": "ws_123",
    "runId": "run_456",
    "objectKind": "action",
    "objectId": "act_889",
    "actorType": "agent",
    "actorKey": "pricing",
    "occurredAt": "2026-06-09T15:02:12Z",
    "payload": {
      "actionId": "act_889",
      "actionType": "approve-discount",
      "title": "Approve Discount Exception",
      "requestedByAgentKey": "pricing"
    }
  }
]
```

## Design Tests

1. If losing the event history would destroy the business record, the concept is insufficiently persisted.
2. If the UI cannot explain a live workflow without special-case code, the event contract is too weak.
3. If an event type only mirrors text already stored elsewhere, it may not deserve its own event family.
4. If an event materially changes user-facing work, its result should be reflected in the core persisted objects.

## Relationship To Existing Docs

1. [Workspace Composition Model](workspace-composition-model.md) defines the interpreter layer that consumes runtime events.
2. [Workspace Model](workspace-model.md) defines where runtime activity is surfaced in the workspace shell.
3. [Action Model](action-model.md) defines the durable approval and next-step record.
4. [Output Model](output-model.md) defines the durable result model that runtime events may update incrementally.
5. [Agent Model](agent-model.md) defines the agent, skill, and tool boundaries that runtime activity should respect.

## Open Questions

1. Which runtime events deserve durable retention versus short-lived streaming only?
2. Should artifact become a first-class persisted object, or remain a transitional presentation concept for now?
3. Which trace events are safe and useful to expose by default across enterprise workflows?
