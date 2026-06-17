# 0003 Use Metadata-Driven Workspace Composition

## Status

Accepted

## Context

The architecture already supports multiple workspace types, multiple output types, and multiple agent roles.

The remaining design question was how to support flexible, reusable, and potentially dynamic UI shells without hard-coding each workspace screen.

A metadata-driven approach offers clear advantages:

1. workspace types can vary without changing the core model
2. component reuse becomes practical across multiple verticals
3. runtime agent activity, approvals, and artifacts can be surfaced through a shared interpreter pattern

The main risk is architectural drift.

If workflow metadata becomes the center of the system, the platform could accidentally collapse into a step-runner model where durable outputs, actions, and grounded business objects become secondary.

That would conflict with [0002 Center The Model On Output](0002-center-the-model-on-output.md).

## Decision

The platform will use metadata-driven workspace composition as a presentation and runtime interpretation layer.

This means:

1. core business objects remain the source of truth
2. workspace shells are composed from metadata rather than hard-coded per-screen logic
3. component registries are allowed and encouraged
4. agent-emitted runtime metadata may influence UI presentation
5. runtime metadata must not replace durable `Output`, `Action`, `Task`, `Knowledge Source`, or `Run` objects

## Consequences

1. The platform gains a reusable interpreter pattern for workspace UI composition.
2. Prior wizard-style framework experience can be reused at the composition layer.
3. The architecture can support real-time agentic behaviors such as approvals, activity feeds, artifact viewers, and resumable flows without changing the core model.
4. The team must stay disciplined about promoting durable concepts into the core model instead of leaving them trapped inside transient workflow metadata.

## References

1. [0002 Center The Model On Output](0002-center-the-model-on-output.md)
2. [Workspace Composition Model](../architecture/workspace-composition-model.md)
3. [Workspace Model](../architecture/workspace-model.md)
4. [Output Model](../architecture/output-model.md)
5. [UI Domain Mapping](../architecture/ui-domain-mapping.md)
