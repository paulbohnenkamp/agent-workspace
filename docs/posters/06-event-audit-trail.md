# Event Audit Trail and Logging

```mermaid
graph TB
    subgraph Activities["Activities"]
        AgentRun["Agent Run"]
        ToolCall["Tool Call"]
        Artifact["Artifact Modify"]
        Thread["Thread Message"]
        Schedule["Schedule Trigger"]
        
        AgentRun
        ToolCall
        Artifact
        Thread
        Schedule
    end
    
    subgraph EventCapture["Event Capture"]
        Timestamp["Timestamp"]
        Actor["Actor<br/>(Agent/User/System)"]
        Action["Action<br/>(what happened)"]
        Context["Context<br/>(parameters)"]
        Result["Result<br/>(outcome)"]
        
        Timestamp
        Actor
        Action
        Context
        Result
    end
    
    subgraph Storage["Event Storage"]
        EventLog["Event Log<br/>(Complete History)"]
        Index["Index<br/>(by time, actor, type)"]
        Query["Query Interface"]
        
        EventLog --> Index
        Index --> Query
    end
    
    subgraph Audit["Audit Trail Features"]
        Replay["Replay<br/>(Reconstruct State)"]
        Compare["Compare<br/>(Versions)"]
        Track["Track<br/>(Who Changed What)"]
        Compliance["Compliance<br/>(Regulatory)"]
        
        Replay
        Compare
        Track
        Compliance
    end
    
    Activities -->|Generate| EventCapture
    EventCapture -->|Stored in| Storage
    Storage -->|Enable| Audit
    
    style EventLog fill:#e74c3c,color:#fff
    style Compliance fill:#27ae60,color:#fff
```

**Key Concepts:**

- **Complete Audit Trail**: Every action recorded
- **Event Structure**: Timestamp, actor, action, context, result
- **Immutable History**: Events never deleted, only appended
- **Queryable**: Search by time, actor, type
- **Compliance**: Regulatory requirements met through audit trail

