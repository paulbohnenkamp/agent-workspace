# Tool Provider Model

```mermaid
graph LR
    subgraph Tool["Tool Definition"]
        TID["id"]
        TName["name"]
        TDesc["description"]
        TImpl["implementation"]
    end
    
    subgraph Providers["Provider Types"]
        API["API Provider<br/>HTTP Endpoints"]
        MCP["MCP Provider<br/>Model Context Protocol"]
        Connector["Connector Provider<br/>External Systems"]
        Function["Function Provider<br/>Native Code"]
        Service["Service Provider<br/>Platform Services"]
    end
    
    subgraph Routing["Tool Invocation"]
        Invoke["Agent Invokes"]
        Route["Route by Provider"]
        Execute["Execute"]
        Return["Return Result"]
        
        Invoke --> Route
        Route --> Execute
        Execute --> Return
    end
    
    Tool -->|Specifies| Providers
    Providers -->|Implement| Routing
    
    style API fill:#4a90e2,color:#fff
    style MCP fill:#50c878,color:#fff
    style Connector fill:#f39c12,color:#fff
    style Function fill:#9b59b6,color:#fff
    style Service fill:#e74c3c,color:#fff
```

**Key Concepts:**

- **5 Provider Types**: Abstract backing mechanisms
- **Tool Providers**: Uniform interface, different backends
- **Routing**: Framework handles provider-specific details
- **Abstraction**: Agents don't know provider type
- **Extensibility**: Add new providers without changing agent code

