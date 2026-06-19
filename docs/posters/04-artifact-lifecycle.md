# Artifact Lifecycle and Versioning

```mermaid
graph TB
    subgraph Definition["Artifact Definition"]
        Schema["Schema<br/>(JSON)"]
        Type["Type<br/>(artifact-type)"]
        Schema --> Type
    end
    
    subgraph Creation["Creation"]
        Create["Create"]
        Validate["Validate"]
        Store["Store"]
        Create --> Validate
        Validate --> Store
    end
    
    subgraph Versioning["Version Management"]
        V1["v1"]
        V2["v2"]
        V3["v3"]
        History["History"]
        
        V1 -->|Modified| V2
        V2 -->|Modified| V3
        V1 --> History
        V2 --> History
        V3 --> History
    end
    
    subgraph Publishing["Publishing"]
        Metadata["Metadata<br/>(Editors, Timestamps)"]
        Events["Events<br/>(All Changes)"]
        Shared["Shared<br/>(Available to Threads)"]
        
        Metadata --> Events
        Events --> Shared
    end
    
    Definition --> Creation
    Creation --> Versioning
    Versioning --> Publishing
    
    style V1 fill:#4a90e2,color:#fff
    style V2 fill:#5da3e5,color:#fff
    style V3 fill:#6cb6ec,color:#fff
```

**Key Concepts:**

- **Schema**: Defines artifact structure
- **Versioning**: Full history, never overwrite
- **Metadata**: Track editors, timestamps, source
- **Events**: All modifications recorded
- **Publishing**: Makes artifact available to threads

