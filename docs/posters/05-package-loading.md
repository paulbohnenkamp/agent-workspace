# Package Loading and Registry Pattern

```mermaid
graph LR
    subgraph FileSystem["Filesystem Packages"]
        YAML["YAML Files<br/>(Definitions)"]
        FS["agents/<br/>tools/<br/>skills/<br/>resources/<br/>artifacts/<br/>schedules/"]
        YAML -->|Stored in| FS
    end
    
    subgraph Loading["Load Phase"]
        Discover["Discover<br/>(find .yaml)"]
        Parse["Parse<br/>(YAML→Object)"]
        Validate["Validate<br/>(against Schema)"]
        
        Discover --> Parse
        Parse --> Validate
    end
    
    subgraph Registry["Registry Pattern"]
        ToolReg["ToolRegistry"]
        SkillReg["SkillRegistry"]
        AgentReg["AgentRegistry"]
        ChanReg["ChannelRegistry"]
        
        subgraph "Registries"
            ToolReg
            SkillReg
            AgentReg
            ChanReg
        end
    end
    
    subgraph Runtime["Runtime"]
        PS["ProjectState"]
        Instances["Instances<br/>(AgentInstance, ToolSet, ...)"]
        
        PS --> Instances
    end
    
    FileSystem --> Loading
    Loading --> Registry
    Registry -->|Build| Runtime
    
    style YAML fill:#f39c12,color:#fff
    style Discover fill:#4a90e2,color:#fff
    style Registry fill:#50c878,color:#fff
    style PS fill:#9b59b6,color:#fff
```

**Key Concepts:**

- **Package-First**: YAML files are source of truth
- **Discovery**: Automatic package discovery
- **Parsing**: Transform YAML to objects
- **Registry**: Index all packages by ID
- **Runtime**: Resolved instances from registered packages

