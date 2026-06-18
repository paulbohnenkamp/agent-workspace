# Workspace Interpreter Specification

The interpreter turns declarative workspace definitions into a rendered workspace shell.

```text
Definition
      ↓
Normalization
      ↓
Binding Resolution
      ↓
Policy Evaluation
      ↓
Layout Resolution
      ↓
Component Tree Generation
      ↓
Workspace Runtime
```

## Responsibilities

The interpreter MUST:

- load a `WorkspaceDefinition`
- validate the definition against schema
- normalize aliases and defaults
- resolve bindings between zones and object kinds
- evaluate policies and permissions
- select components for zones
- produce a component tree
- bind runtime state to rendered components

The interpreter SHOULD remain domain-neutral.
