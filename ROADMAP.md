# Roadmap

This document describes the next implementation step after the v1 architecture freeze.

The architecture is frozen enough to begin building.

The next phase is not more documentation work. The next phase is implementation pressure against the frozen model.

## Current State

The repository has completed:

- architecture discovery
- terminology consolidation
- canonical model freeze
- implementation contract freeze
- schema inventory definition
- vertical definition normalization

Primary references for the frozen state:

- [ARCHITECTURE_FREEZE.md](ARCHITECTURE_FREEZE.md)
- [CANONICAL_MODEL.md](CANONICAL_MODEL.md)
- [DECISIONS.md](DECISIONS.md)
- [IMPLEMENTATION_CONTRACT.md](IMPLEMENTATION_CONTRACT.md)
- [SCHEMA_INVENTORY.md](SCHEMA_INVENTORY.md)

## Next Step

The immediate next step is implementation with only:

- `packages/schemas`
- `packages/types`
- `packages/definitions`
- `packages/interpreter`

This is the narrowest useful implementation slice.

## Why This Is The Next Step

These packages are enough to begin testing whether the frozen architecture actually holds under implementation pressure.

They allow us to:

- formalize the schema set
- derive or author stable platform types
- define reusable definition packages
- implement the first-pass interpreter from `WorkspaceDefinition` to `ComponentTree`

They do not yet require:

- runtime execution code
- shell component implementation
- application-specific behavior
- infrastructure decisions

## What To Build In This Step

### `packages/schemas`

- move or mirror the canonical JSON schemas into implementation-ready package form
- validate schema completeness against [SCHEMA_INVENTORY.md](SCHEMA_INVENTORY.md)

### `packages/types`

- generate or author TypeScript types from the frozen schemas
- preserve the canonical object boundaries from [CANONICAL_MODEL.md](CANONICAL_MODEL.md)

### `packages/definitions`

- establish the package shape for workspace, artifact, playbook, and agent definitions
- include canonical definition examples for vertical workspaces

### `packages/interpreter`

- accept canonical `WorkspaceDefinition`
- validate input against schema
- normalize historical variants into canonical shape
- resolve bindings
- generate a first-pass `ComponentTree`

## What Not To Do Yet

Do not start with:

- `packages/runtime`
- `packages/state`
- `packages/components`
- separate vertical applications
- speculative architecture expansion
- new platform root concepts

## Guiding Constraint

Decision Workspace, Finance Workspace, HR Workspace, and Partner Workspace are `WorkspaceDefinitions` rendered by one runtime.

Do not build separate applications for them.

Prefer fewer, more generic platform abstractions.

Do not introduce new platform root concepts when an existing abstraction can be specialized.

## Discovery Rule For The Next Phase

Let implementation pressure, not more documentation work, drive the next architectural discoveries.

If implementation reveals gaps, capture only the minimum necessary decisions to keep the model coherent.

The default posture is:

1. implement against the frozen model
2. observe where the model resists implementation
3. adjust only when the pressure is concrete

## Success Condition

This phase is successful when:

- the schema set is implementation-ready
- the type layer reflects the canonical model
- definitions can be represented in package form
- the interpreter can consume canonical workspace definitions and emit a normalized component tree

At that point, runtime state and shell implementation can begin with materially better guidance than further speculative documentation would provide.
