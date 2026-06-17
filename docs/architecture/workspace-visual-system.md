# Workspace Visual System

## Purpose

This document defines the shared visual system for workspace mockups used in the architecture set.

The goal is not to lock down product design details. The goal is to make the mockups teach the platform model consistently across multiple domains.

When a reader compares partner, HR, finance, and decision workspaces, they should quickly recognize the same platform objects and the same collaboration pattern, even though the case content differs.

## Core Principle

Every workspace mockup should make the platform model legible at a glance.

A viewer should be able to infer that:

1. work is organized around a `Work Item`
2. an `AI Assistant` helps reason over the case
3. the system produces one primary durable `Output`
4. that output is grounded in `Knowledge Sources`
5. specialist `Agents` are visible and inspectable
6. `Actions` follow from the current output and review state

## Default Workspace Shell

The default visual shell for a multi-case workspace uses four primary regions:

1. left: work queue
2. center-left: `AI Assistant` conversation and synthesis surface
3. center-right: primary output plus supporting outputs
4. right: knowledge sources, agents, and actions

This shell is intentionally broad enough to support both operational and review-heavy workflows.

## Shared Zone Map

### 1. Work Queue

The left-most primary column should show a queue of active work items.

It should make the `Work Item` abstraction visible through:

- case titles
- status pills
- lightweight metadata
- queue counts

Recommended title pattern:

- `Work Queue`
- or a domain-specific variant such as `Candidate Review Queue`, `Vendor Review Queue`, `Decision Queue`

### 2. AI Assistant Surface

The center-left column should be explicitly titled `AI Assistant`.

This region should show that the assistant is actively involved in the workflow rather than merely displaying a passive transcript.

Recommended content pattern:

1. AI-authored summary card
2. human follow-up question
3. assistant response
4. suggested next steps or draft offer

This is the clearest place to show the relationship between:

- user request
- agent synthesis
- next-step reasoning

### 3. Primary Output Surface

The center-right region should contain the main durable output.

This region should visually reinforce that the output is the artifact the user reviews, edits, approves, and acts on.

Recommended features:

- strong output title
- section tabs or supporting-output tabs
- structured sections, not only free-form prose
- an explicit sense that this is the durable center of the workspace

### 4. Right Rail

The right rail should keep inspectable context and next-step controls visible.

The default vertical order is:

1. `Knowledge Sources`
2. `Agents (x)`
3. `Actions`

This order should stay consistent across workspace variants unless a mockup is intentionally demonstrating an exception.

## Right Rail Conventions

### Knowledge Sources

The top right panel should be titled `Knowledge Sources`.

It should present:

- source documents
- notes
- prior approvals
- benchmarks
- interview materials
- policy references

The panel should make grounding visible without overwhelming the rest of the workspace.

### Agents

The middle right panel should use the title pattern `Agents (x)`.

This panel should act as the primary visible agent roster or agent-state summary.

Recommended content:

- agent role names
- concise status
- timestamps or freshness markers
- optional count in the title

Avoid duplicating a second full agent roster in another region unless the distinction is explicit.

Allowed exception:

- if a workspace intentionally separates `Agents (x)` from an `Execution Timeline`, the difference should be visually obvious

### Actions

The bottom right panel should be titled `Actions`.

This panel should contain the next-step controls that follow from the current workspace state.

Examples:

- approve
- request revision
- advance candidate
- escalate
- schedule interview
- create follow-up task

This panel should remain anchored and visible.

## Header Conventions

Each workspace should show a clear work-item header above the main output area.

Recommended fields:

- work item title
- work item ID
- owner or requester
- due date
- status

The header should reinforce that the workspace is centered on a real case, not on a free-floating draft.

## Output Conventions

Each workspace should make the primary output title clear and domain-specific while still fitting the shared platform model.

Examples:

- partner: `Renewal Analysis`
- HR: `Evaluation Summary`
- finance: `Recommendation Report`
- decision: `Decision Report`

Supporting outputs should usually appear as tabs or adjacent views rather than fully separate screens.

Examples:

- `Interview Brief`
- `Follow-up Draft`
- `Risk Memo`
- `Approval Brief`
- `Alternatives`

## AI Assistant Conventions

The AI assistant panel should not be generic.

It should show evidence that the model is participating in the workflow by:

- synthesizing case information
- answering a follow-up question
- recommending next steps
- optionally offering a draft artifact or action

This is important because the visuals should communicate AI-native workflow design, not just a traditional app with a chat box added.

## Navigation And Branding

Workspace variants may use a domain-specific letter glyph as the product mark when helpful:

- `P` for partner
- `H` for HR
- `F` for finance
- `D` for decision

These glyphs should signal workspace type while still reading as one platform family.

## Consistency Rules

Across all workspace mockups:

1. keep the same high-level shell
2. keep the same right-rail order
3. make the AI assistant explicit
4. keep the primary output visually central
5. keep the same object categories visible even when domain language changes

This consistency helps the mockups teach the platform abstractions rather than only the domain stories.

## Variation Rules

Domain variation should come through:

- work item type
- output type
- knowledge source types
- action types
- agent role names
- supporting draft names

Domain variation should not usually come through:

- entirely different shell structure
- different right-rail ordering
- disappearance of the AI assistant surface
- disappearance of visible actions

## Current Mockup Set

The current mockup family is expected to align to this visual system:

- [Partner Workspace](../../verticals/partner-workspace.md)
- [HR Workspace](../../verticals/hr-workspace.md)
- [Finance Workspace](../../verticals/finance-workspace.md)
- [Decision Workspace](../../verticals/decision-workspace.md)

## Design Intent

These mockups are architecture artifacts first.

They are meant to show how durable platform concepts can stay stable while domain-specific work varies.

They should feel like members of one product family, not four unrelated product screens.
