# Package Loading and Schema Enforcement

## Goal

Make package loading fail clearly and deterministically when supported package
kinds, references, or dependency graphs are invalid.

## Related Roadmap Item

- `ROADMAP.md` tracker entry: Harden package loading and schema enforcement

## Context

- Package-first YAML loading is foundational to the V3 runtime.
- The loader currently provides discovery, basic validation, registries, and
  reference resolution, but schema enforcement and diagnostics are incomplete.
- Relevant sources are `packages/loader`, `packages/schemas`,
  `docs/architecture/ARCHITECTURE_V3.md`, and the package-loading specs.

## Scope

### In scope

- Audit supported package kinds against their JSON Schemas.
- Make requested schema validation fatal with stable source paths and messages.
- Validate references and dependency graphs across the supported package kinds.
- Define deterministic duplicate/version conflict behavior.
- Add valid and intentionally broken fixtures and document the validation path.

### Out of scope

- New package kinds or architecture concepts.
- Runtime execution behavior.
- Live integrations or provider authentication.

## Implementation Steps

1. Audit loader validation, schema registration, and current fixtures.
2. Define the fatal validation and conflict contracts.
3. Implement schema and reference/dependency validation with actionable paths.
4. Add valid/broken fixture coverage and update loader documentation.
5. Verify all examples and existing runtime/workspace checks.

## Acceptance Criteria

- Valid example projects load cleanly with schema validation enabled.
- Broken package fixtures fail deterministically with package and field paths.
- Missing, incompatible, and cyclic references are reported clearly.
- Duplicate/version behavior is covered by tests and documented.
- Existing builds, tests, lint, and workspace smoke remain green.

## Verification

- `Unit tests:` loader/schema/reference and conflict fixtures
- `Integration tests:` valid and broken example project discovery
- `Manual checks:` inspect representative diagnostics and docs links

## Status

`in progress`

## Completion Notes

- Initial slice complete: schema-enabled package loads now fail closed on
  validation errors, report the YAML source and field path, and avoid caching
  invalid packages. Required version validation is now consistent for package
  definitions that expose version metadata.
- Added a broken filesystem fixture covering the fatal validation contract.
- Reference resolution now distinguishes missing IDs from IDs that resolve to
  the wrong package kind, with typed diagnostics and fixture coverage.
- Remaining work is the broader schema inventory and duplicate/version
  conflict behavior.

## Outcome Summary

- The loader now has a deterministic fatal-validation boundary; the remaining
  plan work will make the underlying package schemas and dependency contracts
  complete.

## Tooling / Verification Notes

- Build tool: TypeScript, Jest, and existing loader/schema scripts
- Expected verification command: `npm test -- --runInBand && npm run build && npm run build:workspace && npm run lint`
- Current blocker, if any: none
