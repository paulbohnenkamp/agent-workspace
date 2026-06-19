# Agent Runtime Architecture

```mermaid
graph TB
    subgraph AgentExecution["Agent Execution Model"]
        AI["Agent<br/>(AI Core)"]
        Tools["Tools<br/>(Capabilities)"]
        Skills["Skills<br/>(Compositions)"]
        Memory["Memory<br/>(Context)"]
        
        AI --> Tools
        AI --> Skills
        AI --> Memory
    end
    
    subgraph ToolModel["Tool Integration"]
        API["API Tools"]
        MCP["MCP Tools"]
        Connector["Connector Tools"]
        Function["Function Tools"]
        Service["Platform Service Tools"]
        
        subgraph "5 Provider Types"
            API
            MCP
            Connector
            Function
            Service
        end
    end
    
    subgraph AgentInstance["AgentInstance<br/>(Runtime)"]
        State["State"]
        Invocations["Invocations"]
        Responses["Responses"]
    end
    
    AgentExecution -->|Uses| ToolModel
    ToolModel -->|Creates| AgentInstance
    
    style AI fill:#4a90e2,color:#fff
    style AgentInstance fill:#f0e8f8
```

**Key Concepts:**

- **Agent**: AI core with model, instructions, role
- **Tools**: 5 provider types (API, MCP, Connector, Function, Service)
- **Skills**: Compositions of tools and other skills
- **AgentInstance**: Runtime execution record
- **Invocations**: Each agent call tracked and versioned

