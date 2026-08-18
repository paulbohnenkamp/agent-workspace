# Specifications

This directory contains intended behavior and acceptance criteria.

Use specifications to answer these questions:

- What should exist?
- What should the slice do?
- How do we know the behavior is complete?

Specifications and plans serve different purposes:

- Specs define the target behavior.
- Plans in `plans/` describe the execution handoff.
- If behavior changes, update the spec first, then the matching plan.

Rule of thumb:

- Update specs when intended behavior, structure, or user-facing behavior changes.
- Update plans when you are executing work against a stable spec.

## Current specifications

- [Dynamic workspace UI](./dynamic-workspace-ui.md): Next.js application,
  Prisma/PostgreSQL persistence, grounded assistant behavior, and the shared
  professional workspace visual system.
- [Land workflow](./land-workflow.md): repeatable five-view, eight-agent land
  workflow with event-backed state, deterministic/live assistant modes, and
  seed/reset operations.
- [Land project](./land-project.md): the eight-agent land-management and
  land-administration example.
- [Land workspace UI](./land-workspace-ui.md): the current metadata-driven
  five-view land workspace and its transitional renderer behavior.
