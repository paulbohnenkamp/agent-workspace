# Plans Index

This file is the durable entry point for active implementation work.

Workflow:

1. Do not start implementation work without an active plan.
2. Start from `plans/TEMPLATE.md`.
3. Create or update a plan file under `plans/`.
4. Work the plan until the acceptance criteria are met.
5. Mark the plan `done` here.
6. Check off the matching item in `ROADMAP.md`.

## Active Plans

| Roadmap Item | Status | Plan | Notes |
| --- | --- | --- | --- |
| Tighten loader/schema validation for `views/` | planned | [plans/view-metadata-validation.md](./view-metadata-validation.md) | Next slice after the workspace UI milestone. |
| ESLint Config and Generated Artifacts Cleanup | planned | [plans/eslint-config-and-generated-artifacts-cleanup.md](./eslint-config-and-generated-artifacts-cleanup.md) | Removes the remaining lint warning and narrows generated-file scope. |
| Package Lint Cleanup | planned | [plans/package-lint-cleanup.md](./package-lint-cleanup.md) | Clears the remaining package source lint backlog. |
## Completed

- [Workspace UI slice milestone](./workspace-ui-slice-milestone.md) - done, outcome summary captured in the plan file
- [Root `src/` source layout migration](./src-layout-migration.md) - done, source code now lives under `src/`
- [Package Types Lint Cleanup](./package-types-lint-cleanup.md) - done, shared type declarations are lint-clean
- [Package Lint Cleanup](./package-lint-cleanup.md) - done, repo lint passes from the root
- [ESLint Config and Generated Artifacts Cleanup](./eslint-config-and-generated-artifacts-cleanup.md) - done, warning removed and generated schema outputs ignored
- [Workspace Component Alias Standard](./workspace-component-alias-standard.md) - done, workspace view aliases are now generic and validated
- [Workspace Component Catalog](./workspace-component-catalog.md) - done, registry now exposes generic primitives and composites
