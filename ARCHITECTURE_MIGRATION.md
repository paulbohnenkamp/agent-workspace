# Architecture Migration: From Custom to Industry-Standard

This document explains the evolution of the platform architecture and the intentional alignment with emerging industry patterns.

## Executive Summary

The platform underwent a significant architecture simplification:

**Old Model**: Custom vocabulary (Workspace, WorkItem, Playbook, Definition/Instance) designed around workspace UI composition.

**New Model**: Project-centered, package-first architecture using industry-standard agent platform nouns (Project, Agent, Tool, Skill, Run, Artifact, Thread).

This was **intentional**. We studied how the industry is building agent systems and aligned the platform vocabulary and structure with emerging patterns from:

- **Claude Projects** - Anthropic's project-based execution model
- **Claude Artifacts** - Versioned, collaborative outcomes
- **Claude Scheduled Tasks** - Time and event-triggered execution
- **Vercel Eve** - Agent package structure and tool composition
- **Microsoft Agent YAML** - Declarative agent configuration
- **Model Context Protocol (MCP)** - Tool/resource provider abstraction

## Why the Change

### Problem with Old Model

The original architecture was designed around a specific use case: workspace UI composition.

```
Workspace (UI container)
  ├─ WorkItems (queue)
  ├─ Artifacts (outputs)
  └─ Playbooks (processes)
```

This created friction:

1. **Custom terminology** - Had to explain what "WorkItem" means
2. **UI-centric** - Vocabulary implied visual workspace, not headless execution
3. **Unclear concepts** - "Playbook" + "Definition/Instance" pattern was verbose
4. **Integration friction** - Different from how other agent frameworks discuss execution

### Solution: Align with Industry

Study how emerging agent platforms think about these concepts:

- **Claude Projects** - "Projects" organize execution context
- **Vercel Eve** - Agents defined in YAML packages with tools
- **Microsoft Copilot** - Agents configured with skills and tools
- **LangGraph** - Agents with defined capabilities
- **AutoGen** - Multi-agent orchestration with tools

Pattern: **Projects contain Agents that use Tools to create Artifacts.**

This is the lingua franca of modern agent systems.

## Mapping: Old to New

### Container Concepts

| Old | New | Why |
|-----|-----|-----|
| `Workspace` | `Project` | Clearer name; "Workspace" implies UI |
| `WorkspaceDefinition` | `ProjectDefinition` | Consistency |
| `WorkspaceInstance` | `Project` (runtime) | Simpler; no def/instance split for runtime |
| (none) | Filesystem package | First-class organizational concept |

### Execution Concepts

| Old | New | Why |
|-----|-----|-----|
| `WorkItem` | (removed) | Ambiguous; use Agent + Run instead |
| `Playbook` + `Activities` | `Agent` + `Tools/Skills` | More specific; clearer what's executing |
| `Run` | `Run` | Kept; already standard in agent platforms |
| `Definition/Instance` | `Definition` / `Run` | Simpler naming; no split for runtime |

### Capability Concepts

| Old | New | Why |
|-----|-----|-----|
| `Capability` | `Tool` or `Skill` | Industry standard; Tool = external, Skill = composed |
| `Integration` | `Tool` | Integrations ARE tools (backed by connectors) |
| (not explicit) | Tool backing mechanism | API, connector, MCP, code, service are implementation details |

### Output Concepts

| Old | New | Why |
|-----|-----|-----|
| `ArtifactDefinition/Instance` | `Artifact` (with type, version) | Aligned with Claude Artifacts |
| `Output` | `Artifact` | Standard term |
| `Session` | `Thread` | More concrete; threads are conversations |

### Context Concepts

| Old | New | Why |
|-----|-----|-----|
| `KnowledgeSource` | `Resource` | More general; covers all context types |
| (implicit) | `Channel` | Explicit communication interfaces |
| (implicit) | `Schedule` | Explicit trigger/automation |

## Industry Pattern Alignment

### 1. Claude Projects Pattern

**How Claude Projects work:**
- Projects organize execution context
- Artifacts preserve and version outcomes
- Scheduled Tasks trigger execution
- Conversations (Threads) provide collaboration

**How we aligned:**
```yaml
# Claude Projects pattern
Project
  ├─ Agents (explicit execution actors)
  ├─ Artifacts (outcomes with versions)
  ├─ Schedules (automated triggers)
  └─ Threads (collaboration context)
```

### 2. Vercel Eve Agent Packages

**How Vercel structures agents:**
- Agent as directory with configuration
- Tools defined in YAML
- Skills compose tools
- Environment-specific constraints

**How we aligned:**
```
agents/agent-name/
  ├─ agent.yaml (with instructions)
  ├─ tools/
  │   └─ tool.yaml
  └─ skills/
      └─ skill.yaml
```

Same structure. Familiar to Eve users.

### 3. Microsoft Agent YAML Configuration

**How Microsoft structures agents:**
- Declarative YAML configuration
- Agents have instructions (not separate files)
- Tools are first-class capabilities
- Execution is explicit and traceable

**How we aligned:**
```yaml
agent:
  id: decision-analyzer
  instructions: |
    [Full instructions in YAML]
  
  tools:
    - path: tools/search.yaml
  
  skills:
    - path: skills/analysis.yaml
```

Same declarative approach. Familiar to Microsoft users.

### 4. Model Context Protocol (MCP)

**How MCP works:**
- Servers provide capabilities to clients
- Standard protocol for tool/resource provision
- Decouples capability definition from execution

**How we aligned:**
```yaml
tool:
  implementation:
    type: mcp  # Or: http, connector, function, platform_service
    server: claude-document-server
```

MCP is one tool backing mechanism. Also support API, connectors, code.

### 5. LangGraph & AutoGen Patterns

**How LangGraph structures execution:**
- Agents with defined tools
- Graph-based orchestration
- Explicit state management
- Run-based execution records

**How we aligned:**
```
Agent
  ├─ Tools (capabilities)
  ├─ Skills (compositions)
  └─ Runs (execution records)
```

Same mental model. Familiar to LangGraph users.

## Architectural Benefits

### 1. Reduced Cognitive Load

**Old:** "What's the difference between Workspace and WorkItem? Why is it Definition/Instance?"

**New:** "Projects contain Agents that use Tools to create Artifacts."

Standard industry terminology. No proprietary concepts to learn.

### 2. Better Integration

**Old:** Had to translate between our model and other frameworks.

**New:** Uses same vocabulary as Claude, Vercel, Microsoft, AutoGen, LangGraph.

Easier integration and interoperability.

### 3. Clearer Execution Model

**Old:** Playbook + Activity + Workflow was verbose and unclear.

**New:** Agent uses Tool in a Run, produces Artifact.

Explicit, simple, observable.

### 4. First-Class Packages

**Old:** Configuration in abstract objects and registries.

**New:** Projects and Agents are filesystem packages.

Discoverable, portable, version-controllable, natural fit with git.

### 5. Tool Abstraction

**Old:** Didn't clearly separate "what" (capability) from "how" (implementation).

**New:** Tools are what Agents invoke. API/MCP/connector/code are implementation details.

Cleaner separation of concerns.

## Migration Path

### For Users

1. **Phase 1 (Now)**: Read documentation in new vocabulary
2. **Phase 2 (Phase 2 implementation)**: New code uses new vocabulary
3. **Phase 2 (same)**: Backward compatibility layer translates old → new
4. **Phase 3**: Gradual deprecation of old terminology
5. **Phase 4**: Remove old terminology entirely

### For Developers

1. **Phase 1**: Understand new model
2. **Phase 2**: Implement Phase 2 runtime with new vocabulary
3. **Phase 2**: Add normalization layer for old format → new format
4. **Phase 3**: Update all examples to new format
5. **Phase 4**: Remove old code paths

## Historical Context: Why the Old Model?

The original model was designed for a specific constraint: **building a reusable workspace UI that could render multiple business domains without domain-specific code.**

```
WorkspaceDefinition
  ├─ Zones (UI regions)
  └─ Bindings (zone → object kind → view)
```

This was correct for that goal. It enabled:
- Same runtime rendering Decision Workspace, Partner Workspace, HR Workspace
- Declarative UI composition
- Component tree generation

But it imposed a vocabulary cost:
- "Workspace" implied visual/interactive context, not suitable for headless agents
- "WorkItem" was an abstract queue concept that didn't map to agent execution
- "Definition/Instance" pattern was a meta-pattern not needed for headless execution
- Integration with other agent frameworks was awkward

## Current Intent

The platform is now:

1. **Agent-first** - Agents are explicit execution actors
2. **Package-based** - Projects and Agents are filesystem packages
3. **Industry-aligned** - Uses vocabulary consistent with Claude, Vercel, Microsoft, AutoGen
4. **Tool-composable** - Clear separation between Tool (what agent uses) and Tool implementation (how it works)
5. **Durable-outcome-focused** - Artifacts are versioned, collaborative outcomes (like Claude Artifacts)

This makes the platform:
- More accessible to people familiar with agent frameworks
- Easier to integrate with other systems
- More focused on execution and outcome than UI composition
- Clearer about what's platform concept vs implementation detail

## References

### Industry Patterns Consulted

- **Claude Projects** - docs.anthropic.com/en/docs/build-a-system-with-claude/agents
- **Claude Artifacts** - Versioned outcomes in multi-turn conversations
- **Claude Scheduled Tasks** - Time and event-triggered execution
- **Vercel Eve** - Agent packages and tool composition (vercel.com/ai)
- **Microsoft Copilot Studio** - Agent YAML configuration
- **Model Context Protocol (MCP)** - Tool/resource provider abstraction (modelcontextprotocol.io)
- **LangGraph** - Agent state graphs and tool use (langchain-ai.github.io/langgraph)
- **AutoGen** - Multi-agent orchestration with skills and tools (microsoft.github.io/autogen)

### Key Documents

- [AGENTS.md](AGENTS.md) - Complete model with new vocabulary
- [TOOL_MODEL.md](TOOL_MODEL.md) - Tool backing mechanisms
- [VOCABULARY_TRANSITION.md](VOCABULARY_TRANSITION.md) - Old to new mapping
- [FILESYSTEM_STRUCTURE.md](FILESYSTEM_STRUCTURE.md) - Package organization

## Summary

This migration represents a **strategic alignment with industry patterns**, not a fundamental architectural break.

The core insight remains unchanged: **Separate definition from runtime, use metadata-driven composition, support durable human-agent collaboration.**

What changed: **The vocabulary and structure now align with how the industry is building agent systems.**

This makes the platform:
- **More accessible** - Familiar terminology
- **More integrable** - Compatible with other frameworks
- **More focused** - Clear separation of concerns
- **More observable** - Explicit execution actors and outcomes

The old model was correct for its constraint. The new model is correct for the emerging agent platform landscape.
