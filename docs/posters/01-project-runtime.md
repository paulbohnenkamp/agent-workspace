# Project Runtime Architecture

```mermaid
graph TB
    subgraph Project["Project Runtime"]
        PS["ProjectState<br/>(Runtime Container)"]
        PS --> PA["Project"]
        PS --> PS_agents["Agents"]
        PS --> PS_runs["Runs"]
        PS --> PS_artifacts["Artifacts"]
        PS --> PS_threads["Threads"]
        PS --> PS_events["Events"]
    end
    
    subgraph Lifecycle["Project Lifecycle"]
        Create["Create"]
        Execute["Execute"]
        Persist["Persist"]
        Query["Query"]
        Create -->|Initialize| Execute
        Execute -->|Track| Persist
        Persist -->|Load| Query
    end
    
    subgraph State["State Management"]
        Registry["Registry<br/>(Package Index)"]
        Loader["Loader<br/>(YAML→Runtime)"]
        Storage["Storage<br/>(Persistence)"]
        EventLog["Event Log<br/>(Audit Trail)"]
        Registry --> Loader
        Loader --> Storage
        Storage --> EventLog
    end
    
    Project Lifecycle
    State
    style PS fill:#4a90e2,color:#fff
    style Project fill:#e8f4f8
```

**Key Concepts:**

- **ProjectState**: Runtime wrapper around project definition
- **Registry**: Package discovery and indexing
- **Loader**: Transforms YAML packages into runtime objects
- **Storage**: Persists project state and history
- **Event Log**: Complete audit trail of all activities

