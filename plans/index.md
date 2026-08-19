# Plans index

This file is the durable entry point for active implementation work.

Workflow:

1. Before starting implementation work, create or update an active plan.
2. Start from `plans/TEMPLATE.md`.
3. Create or update a plan file under `plans/`.
4. Work the plan until the acceptance criteria are met.
5. Mark the plan `done` here.
6. Check off the matching item in `ROADMAP.md`.

## Active Plans

| Roadmap Item | Status | Plan | Notes |
| --- | --- | --- | --- |
| Documentation story and release flow cleanup | in progress | [plans/docs-story-and-release-flow-cleanup.md](./docs-story-and-release-flow-cleanup.md) | Shortens the README, adds changelog/release entry points, and makes the docs read like a product story. |
| Tighten loader/schema validation for `views/` | in progress | [plans/view-metadata-validation.md](./view-metadata-validation.md) | Active next slice: fail-fast view structure, field, region, and renderer-overlay validation. |
| Dynamic Workspace UI | in progress | [plans/dynamic-workspace-ui.md](./dynamic-workspace-ui.md) | Next.js/Prisma land workspace foundation and professional dynamic shell; persistence, auth, and live LLM phases remain. |
## Completed

- [Land Workspace UI Milestone](./land-workspace-ui-milestone.md) - done, all five land views render through the shared workspace composition with in-memory actions

- [Continuous integration](./continuous-integration.md) - done, clean install/build/lint/test workflow verified on GitHub
- [Workspace UI slice milestone](./workspace-ui-slice-milestone.md) - done, outcome summary captured in the plan file
- [Root `src/` source layout migration](./src-layout-migration.md) - done, source code now lives under `src/`
- [Package Types Lint Cleanup](./package-types-lint-cleanup.md) - done, shared type declarations are lint-clean
- [Package Lint Cleanup](./package-lint-cleanup.md) - done, repo lint passes from the root
- [ESLint Config and Generated Artifacts Cleanup](./eslint-config-and-generated-artifacts-cleanup.md) - done, warning removed and generated schema outputs ignored
- [Workspace Component Alias Standard](./workspace-component-alias-standard.md) - done, workspace view aliases are now generic and validated
- [Workspace Component Catalog](./workspace-component-catalog.md) - done, registry now exposes generic primitives and composites
- [Workspace Primitive Catalog Expansion](./workspace-primitive-catalog-expansion.md) - done, registry is thin and components live one per file
- [Durable Authorized Workspace Slice](./durable-authorized-workspace.md) - done, PostgreSQL migration/seed and authenticated authorization E2E verification passed
