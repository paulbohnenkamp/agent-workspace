# Plans

This directory holds active implementation handoff files.

Use plans to answer:

- What work is currently active?
- What is the scope of the slice?
- What are the implementation steps?
- How do we verify completion?

Workflow:

1. Do not start implementation work without creating or updating a plan.
2. Start from [plans/TEMPLATE.md](./TEMPLATE.md).
3. Create or update a plan file for the slice.
4. Track active work in [plans/index.md](./index.md).
5. Mark the plan `done` only after acceptance criteria and verification pass.
6. Update [ROADMAP.md](../ROADMAP.md) when the slice is complete.

How this relates to specs:

- Specs in `docs/specs/` define the intended behavior.
- Plans translate the spec into an execution sequence.
- If the product intent changes, update the spec first.
