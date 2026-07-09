# Workspace UI Guardrails

This document defines the implementation guardrails for workspace UI in this repository.

It exists to prevent a repeat of the most common failure mode: treating a sample workspace as a one-off page redesign instead of a composable metadata-driven UI system.

## Why These Guardrails Exist

The platform model in this repository is package-first and metadata-driven. Workspace UI should reflect that:

- projects define context
- views define structure
- registries resolve component types
- renderers compose reusable primitives

The neighboring `emwizard` model is the right mental reference:

- `FieldRegistry` maps field types to components
- layout builders compose configured nodes
- the wizard container stays generic
- metadata owns structure

Workspace UI in this repo should follow the same pattern in spirit.

When a suitable pattern already exists in `emwizard`, prefer copying and adapting the TypeScript structural pattern while implementing new UI code in React with functional components.

## Non-Negotiable Rules

### 1. Handwritten UI source must be TypeScript

Do not add new handwritten JavaScript for:

- workspace renderers
- component registries
- layout builders
- view interpreters
- demo/runtime UI entrypoints

Generated JavaScript output is fine. Source of truth is not.

Existing handwritten JavaScript in these paths should be treated as temporary migration debt. The default action is to convert it to TypeScript, not to keep layering new behavior onto JavaScript files.

## 2. Registries must stay generic

A future `ComponentRegistry.tsx` should be conceptually equivalent to `FieldRegistry.tsx` in `emwizard`.

That means:

- map `component` type ids to reusable renderers
- do not embed page-specific logic
- do not embed candidate-specific logic
- do not embed route-specific layout assumptions
- do not special-case one workspace in registry code
- keep `src/ComponentRegistry.tsx` thin and keep component implementations in `src/components/*.tsx`

Canonical component aliases:

| Alias | Purpose |
| --- | --- |
| `shell` | Shell-level hero or frame content |
| `rail` | Side rail content or narrow support panel |
| `canvas` | Main workspace canvas or broad body |
| `section` | Reusable labeled section block |
| `stack` | Vertical stack of related content |
| `grid` | Responsive grid of cards or cells |
| `toolbar` | Compact action bar or control strip |
| `badge` | Inline status pill or tone label |
| `panel` | Generic bordered container for a block of content |
| `card` | Compact summary card for a record or metric |
| `list` | Generic item list or record list |
| `document` | Sectioned document or record view |
| `text` | Plain text or prose block |
| `divider` | Separator line, optionally labeled |
| `header` | Hero/header area for a view or shell slot |
| `queue` | Ordered list of work items or review items |
| `summaryCard` | Compact summary panel for a person, artifact, or assistant |
| `timeline` | Message or event timeline |
| `composer` | Input surface for drafting or replying |
| `tabs` | Tabbed artifact or document sections |
| `sources` | Evidence or knowledge source list |
| `statusList` | Runtime or agent status list |
| `actions` | Action button stack |

When to use each alias:

- `badge`: use for inline status pills or short tone labels.
- `panel`: use for a generic bordered content block.
- `list`: use for a generic item list or record list.
- `document`: use for a sectioned document or record view.
- `header`: use for the primary hero block at the top of a view, such as a candidate summary header or shell header slot.
- `queue`: use for ordered work lists, review queues, or board columns.
- `summaryCard`: use for a compact summary of a person, artifact, or assistant state.
- `timeline`: use for threaded discussion, activity history, or event streams.
- `composer`: use for a reply box, draft input, or inline action-entry surface.
- `tabs`: use for switching between artifact sections or document panels.
- `sources`: use for evidence, citations, or linked knowledge sources.
- `statusList`: use for agent/runtime status rows or operational health lists.
- `actions`: use for a small stack of call-to-action buttons.

Good:

- `"shell" -> ShellComponent`
- `"rail" -> RailComponent`
- `"canvas" -> CanvasComponent`
- `"section" -> SectionComponent`
- `"stack" -> StackComponent`
- `"grid" -> GridComponent`
- `"toolbar" -> ToolbarComponent`
- `"badge" -> BadgeComponent`
- `"panel" -> PanelComponent`
- `"card" -> CardComponent`
- `"list" -> ListComponent`
- `"document" -> DocumentComponent`
- `"text" -> TextComponent`
- `"divider" -> DividerComponent`
- `"header" -> HeaderComponent`
- `"queue" -> QueueComponent`
- `"summaryCard" -> SummaryCardComponent`
- `"timeline" -> TimelineComponent`
- `"composer" -> ComposerComponent`
- `"tabs" -> TabsComponent`
- `"sources" -> SourcesComponent`
- `"statusList" -> StatusListComponent`
- `"actions" -> ActionsComponent`

Example nodes:

```json
[
  { "component": "shell", "bind": { "title": "Workspace", "body": "Overview and status" } },
  { "component": "rail", "bind": { "items": "$fields.workspaceRail" } },
  { "component": "canvas", "bind": { "items": "$fields.workspaceCards" } },
  { "component": "section", "bind": { "body": "Reusable section block" } },
  { "component": "stack", "bind": { "items": "$fields.workspaceStack" } },
  { "component": "grid", "bind": { "items": "$fields.workspaceGrid" } },
  { "component": "toolbar", "actions": ["refresh", "advance"] },
  { "component": "header", "bind": { "candidate": "$fields.selectedCandidate" } },
  { "component": "queue", "bind": { "projection": "item_queue" } },
  { "component": "summaryCard", "bind": { "artifact": "$fields.candidateEvaluation" } },
  { "component": "panel", "bind": { "body": "Reusable content block" } },
  { "component": "card", "bind": { "title": "Quick summary", "value": "42" } },
  { "component": "list", "bind": { "items": "$fields.candidateSources" } },
  { "component": "document", "bind": { "sections": "$fields.candidateEvaluation.sections" } },
  { "component": "text", "bind": { "body": "Short prose block" } },
  { "component": "divider", "bind": { "label": "Next section" } },
  { "component": "badge", "bind": { "label": "Approved" } },
  { "component": "timeline", "bind": { "thread": "$fields.candidateThread" } },
  { "component": "composer", "bind": { "thread": "$fields.candidateThread" } },
  { "component": "tabs", "bind": { "artifact": "$fields.candidateEvaluation" } },
  { "component": "sources", "bind": { "sources": "$fields.candidateSources" } },
  { "component": "statusList", "bind": { "runs": "$fields.candidateRuns" } },
  { "component": "actions", "actions": ["advance_candidate", "request_revision"] }
]
```

Bad:

- "if this is candidate review, render it differently"
- "if selected candidate exists, swap to a special layout"
- adding styling branches that only make sense for one sample page

## 3. Layout composition must be metadata-driven

Workspace layout should be assembled from reusable layout primitives.

Prefer the same builder and composition shape used by `emwizard` layout builders wherever that model fits, but implement new UI code in React rather than Preact or Oracle JET.

Examples:

- shell
- rail
- canvas
- section
- stack
- grid
- tabs
- toolbar

The renderer may interpret layout metadata, but it must not invent view structure in code.

Good:

- metadata declares regions and component nodes
- metadata chooses shell/layout variant
- builder composes declared nodes into the workspace

Bad:

- renderer hard-codes an entire bespoke page for one view
- CSS structure only works for one named sample
- layout meaning lives in code instead of metadata

## 4. UI must be composable across views

Any workspace UI system must support more than one view.

Before heavy polish, prove that the same shell and component system can serve:

- `candidate-review`
- `open-roles-board`
- `approval-queue`

If a renderer improvement cannot be reused across at least two views, it is probably the wrong abstraction.

## 5. Styling must be class-based and role-based

Styling should describe workspace roles, not one-off pages.

Prefer reusable classes and tokens for:

- shell
- top bar
- primary canvas
- left rail
- right rail
- panel density
- section separators
- status treatments
- action styles

Avoid styling patterns that only make sense for one page instance.

Good:

- `.workspace-shell`
- `.workspace-rail`
- `.workspace-canvas`
- `.workspace-panel`
- `.workspace-panel--dense`
- `.status-badge`

Bad:

- classes named after a specific sample scenario
- inline CSS logic that encodes one layout only
- visual rules that cannot be reused elsewhere

## 6. View-specific structure belongs in metadata

If a view has a unique arrangement, expose that in metadata.

Do not bury it in renderer conditionals.

Good:

- metadata selects a shell type
- metadata configures region widths or layout intent
- metadata declares component order

Bad:

- renderer checks `view.id === "candidate-review-workspace"`
- component registry branches on route or artifact type for layout

## 7. Borrow from proven systems before inventing new ones

Before altering workspace composition, inspect existing systems such as `emwizard`.

The goal is not to copy Oracle JET or Preact APIs literally. The goal is to borrow the proven structural ideas:

- registry-based component mapping
- config-driven layout builders
- generic containers
- composable field/component nodes
- TypeScript registry and builder patterns
- React functional component composition

If we invent a new workspace UI model, we should do it intentionally and document why it is better than the borrowed pattern.

## 8. No visual redesign before renderer contract

Do not start with colors, surfaces, or polish.

First define:

- registry contract
- layout builder contract
- shell roles
- metadata responsibilities
- reusable component boundaries

Only then should visual design be layered on.

Otherwise the result becomes a one-off mock implementation that cannot scale.

## Recommended Implementation Shape

The likely end-state should look something like this:

1. `ComponentRegistry.tsx`
   - thin registry that maps metadata component ids to reusable renderers

2. `src/components/*.tsx`
   - one React component per file
   - component bodies stay easy to find, reuse, and extend

3. layout builder layer
   - interprets view layout metadata into shell/rail/canvas composition

4. generic workspace shell
   - shared frame for top bar, rails, canvas, actions, and density

5. typed component renderers
   - reusable implementations for queue, summary, discussion, artifact, knowledge, agent status, actions

6. metadata-defined views
   - each view composes the same building blocks differently

## PR / Review Checklist

Before shipping workspace UI changes, ask:

- Is the source handwritten TypeScript?
- Does the registry stay generic?
- Is the layout driven by metadata instead of hard-coded view branches?
- Can the same shell support at least two views?
- Are styling classes role-based rather than sample-specific?
- Did we inspect adjacent proven systems such as `emwizard` before inventing something new?
- Would this still make sense if `candidate-review` were removed and another workspace replaced it?

If the answer to several of these is no, stop and refactor before polishing.
