# Continuous Integration

## Goal

Run the repository's primary quality checks automatically for every push and pull request.

## Related Roadmap Item

- `ROADMAP.md` tracker entry: repository quality maintenance supporting all implementation phases

## Context

- Root scripts already provide reproducible install, lint, build, and test commands.
- The public repository currently has no GitHub Actions workflow, so those checks are not visible to contributors or reviewers.
- This change does not alter Architecture V3 or runtime behavior.

## Scope

### In scope

- Add a least-privilege GitHub Actions workflow.
- Run clean dependency installation, lint, package builds, workspace build, and tests.

### Out of scope

- Deployment or release automation
- Architecture or product behavior changes
- Dependency upgrades

## Implementation Steps

1. Add a Node.js workflow for pushes and pull requests.
2. Run the existing root verification commands.
3. Verify locally and on a pull request.

## Acceptance Criteria

- GitHub Actions runs on pushes and pull requests.
- The workflow uses the committed lockfile through `npm ci`.
- Lint, package builds, workspace build, and Jest tests pass.
- Workflow permissions are read-only.

## Verification

- `Unit tests:` `npm test`
- `Integration tests:` `npm run build && npm run build:workspace`
- `Manual checks:` `npm ci`, `npm run lint`, `git diff --check`, GitHub PR check

## Status

- `ready to verify`

## Completion Notes

- Added a least-privilege GitHub Actions workflow for clean install, lint, package builds, workspace build, and tests.
- Local verification passed; GitHub pull-request verification remains.

## Outcome Summary

- The repository now has an automated quality gate matching its existing root scripts.

## Tooling / Verification Notes

- Build tool: npm workspaces
- Expected verification command: `npm ci && npm run lint && npm run build && npm run build:workspace && npm test`
- Current blocker, if any: pending GitHub pull-request check
