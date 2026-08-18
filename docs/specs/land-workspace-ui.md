# Land workspace UI specification

## Purpose

Provide a dedicated, fully populated demo of the land project using the same
metadata-driven workspace composition as the existing project examples.

The UI is educational and hypothetical. West Virginia and Appalachian content
must not be presented as legal advice, a title opinion, a permit determination,
or a payment/accounting decision.

## Agent and view model

Eight agents represent specialized land-department roles. Five workspace views
represent reusable workflow surfaces, not five separate jobs. Multiple agents,
human users, and handoffs may use one view.

| View | Primary coverage |
| --- | --- |
| Acquisition and Rights Queue | Acquisition, title, lease, surface-rights work |
| Title and Curative Review | Title analyst, acquisition, legal/title reviewers |
| Lease Administration Queue | Lease-rights administration and records |
| Division Orders and Owner Relations | Division orders, royalty owners, title changes |
| Integrated Land Portfolio | Operations, development handoffs, management status |

## Shared workspace composition

Every view preserves the project archetype layout:

1. Left work queue with matters, status, ownership, deadlines, and selection.
2. AI Assistant column with summaries, findings, blockers, and next steps.
3. Central artifact or primary work surface for the selected matter.
4. Right context rail with Knowledge Sources, Agents, and Actions.

The layout is shared. View-specific content comes from `view.json` metadata,
bindings, projected state, and artifacts. No view-specific renderer branches or
land-specific component aliases are allowed.

## Demo behavior

The dedicated land demo exposes routes for all five views and uses
representative projected state covering both land-management and land-
administration work. It includes acquisition, title, curative, lease, surface,
pooling, division-order, royalty-owner, records, compliance, deadlines,
artifacts, sources, agent activity, threads, and handoffs.

Local simulated actions append in-memory events and update projections. They
may assign work, request missing records, escalate for professional review,
mark a handoff ready, acknowledge an owner response, or record administrative
follow-up. They must not decide title, legal sufficiency, regulatory outcome,
payment entitlement, or accounting treatment.

## Acceptance criteria

- All five views render through the shared workspace shell and registered component aliases.
- Each view visibly contains queue, assistant, primary artifact/work content, and context-rail content.
- Routes and navigation work for all five views.
- Representative state covers both tracks and shows cross-agent handoffs.
- Local actions append in-memory events and update projected state without persistence.
- Existing hiring workspace behavior remains unchanged.
- YAML, view, registry, tests, and build verification pass.
