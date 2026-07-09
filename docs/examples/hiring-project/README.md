# Hiring Project Example

This example shows how Architecture V3 supports hiring, policy review, and onboarding as one project-centric system.

It is the clearest example of long-running collaborative work that starts, stops, and resumes over time:

- a recruiter opens the hiring request
- an agent drafts candidate materials
- hiring managers and coordinators review asynchronously
- another agent revises after comments or policy findings
- approval arrives later through a new event or scheduled review

If you are continuing the current workspace UI slice, start with [`plans/index.md`](../../../plans/index.md). This example documents the target shape; the plan index tracks the live work.

## Archetype

- [Hiring Project image](../../images/projects/hiring-project.png)

## Structure

```text
hiring-project/
  project.yaml
  agents/
    hr-coordinator/
      agent.yaml
      tools/
      connectors/
      skills/
    hiring-assistant/
      agent.yaml
    policy-reviewer/
      agent.yaml
  resources/
    company-structure.yaml
    compliance-requirements.yaml
    employee-database.yaml
    hiring-policies.yaml
  artifacts/
    hiring-plan.yaml
    job-description.yaml
    candidate-evaluation.yaml
    onboarding-checklist.yaml
    employee-record.yaml
    policy-compliance-report.yaml
  views/
    open-roles-board/
      view.json
    candidate-review/
      view.json
      react/
        view.json
    approval-queue/
      view.json
  schedules/
    weekly-hiring-review.yaml
    monthly-onboarding.yaml
    quarterly-policy-review.yaml
```

## What It Demonstrates

- Multi-human and multi-agent collaboration around hiring work
- Work that pauses and resumes across many events, reviews, and handoffs
- Canonical event history with queryable current-state projections
- Policy and compliance resources shared across agents
- Hiring and onboarding artifacts as durable outcomes
- Multiple named workspace views over the same project state
- View metadata that can use `fields` plus `layout` composition in the same spirit as metadata-driven wizard UIs
- Optional renderer-specific overrides under a shared view identity
- Canonical workspace component aliases grouped as:
  - Shell and layout roles: `shell`, `rail`, `canvas`, `section`, `stack`, `grid`, `toolbar`
  - Content primitives: `badge`, `panel`, `card`, `list`, `document`, `text`, `divider`
  - Composite workspace surfaces: `header`, `queue`, `summaryCard`, `timeline`, `composer`, `tabs`, `sources`, `statusList`, and `actions`
- The registry is the alias map; implementations live one per file under `src/components/`
- A working React workspace slice that loads `view.json`, interprets projected state, and renders the example views through the `src/` pipeline
- Recurring governance and onboarding checks
- Evaluation kept outside the main execution and wake-up loop
- One featured V3 agent package with nested tools and skills

How the candidate review view is composed:

1. `views/candidate-review/view.json` declares the shell, layout, regions, and component nodes.
2. The loader validates those nodes against the registry-backed alias catalog.
3. The layout builder places the regions into the workspace shell.
4. The React components in `src/components/*.tsx` render each node one at a time.

Quick alias cheat sheet:

- `shell`: shell-level hero or frame content
- `rail`: side rail content or support panel
- `canvas`: main workspace canvas
- `section`: reusable section block
- `stack`: vertical stack of related content
- `grid`: responsive grid of cards or cells
- `toolbar`: compact action bar
- `badge`: inline status pill
- `panel`: generic content block
- `card`: compact summary card
- `list`: generic record list
- `document`: sectioned record or artifact view
- `text`: plain text or prose block
- `divider`: separator line
- `header`: candidate or shell hero
- `queue`: review or intake list
- `summaryCard`: candidate, artifact, or assistant summary
- `timeline`: discussion or event history
- `composer`: reply or draft input surface
- `tabs`: section switcher for artifact content
- `sources`: supporting evidence and references
- `statusList`: agent or runtime status rows
- `actions`: approval, revision, or next-step buttons

## See Also

- [Architecture V3](../../architecture/ARCHITECTURE_V3.md)
- [Project Archetypes](../../project-archetypes/README.md)
- [Decision Project](../decision-project/README.md)
- [Finance Project](../finance-project/README.md)
- [Partner Project](../partner-project/README.md)
- [Systems Project](../systems-project/README.md)
