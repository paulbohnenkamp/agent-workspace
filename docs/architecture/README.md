# Architecture

## Platform Layers

```text
Applications
        ↓
Workspace Definition Packages
        ↓
Workspace Interpreter
        ↓
Workspace Runtime
        ↓
Persistence
        ↓
Infrastructure
```

## Architecture Center

The most important architectural boundary is:

```text
WorkspaceDefinition
        ↓
Interpreter
        ↓
Runtime
```

The same runtime should render decision, finance, HR, and partner workspaces from definitions.
