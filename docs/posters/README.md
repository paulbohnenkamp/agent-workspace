# Architecture Posters

Visual explanations of Architecture V2 concepts.

These posters teach **how the platform works** (separate from project archetypes, which show **using** the platform).

---

## Posters

### 1. [Project Runtime Architecture](01-project-runtime.md)
How projects are managed at runtime.

**Covers:**
- ProjectState (runtime container)
- Project lifecycle (create, execute, persist, query)
- Registry pattern (package discovery)
- State management (storage, events)

**Why:** Understand the lifecycle and state management of projects.

---

### 2. [Agent Runtime Architecture](02-agent-runtime.md)
How agents execute and integrate tools.

**Covers:**
- Agent core (model, instructions, role)
- Tool integration (5 provider types)
- Skill composition
- AgentInstance (runtime record)

**Why:** Understand how agents work and what they can do.

---

### 3. [Tool Provider Model](03-tool-model.md)
How tools are abstracted and invoked.

**Covers:**
- 5 provider types (API, MCP, Connector, Function, Service)
- Tool routing and invocation
- Provider abstraction
- Extensibility

**Why:** Understand tool capabilities and how to add new tools.

---

### 4. [Artifact Lifecycle and Versioning](04-artifact-lifecycle.md)
How artifacts are created, versioned, and published.

**Covers:**
- Artifact schema and definition
- Version management (v1, v2, v3, ...)
- Metadata and events
- Publishing to threads

**Why:** Understand artifact persistence and collaboration.

---

### 5. [Package Loading and Registry Pattern](05-package-loading.md)
How YAML packages become runtime objects.

**Covers:**
- Filesystem packages (YAML files)
- Discovery and parsing
- Registry pattern (indexes by ID)
- Runtime instantiation

**Why:** Understand the package-first model and how configuration becomes behavior.

---

### 6. [Event Audit Trail and Logging](06-event-audit-trail.md)
How all activities are recorded and audited.

**Covers:**
- Activity types (agent runs, tool calls, artifacts, threads, schedules)
- Event structure (timestamp, actor, action, context, result)
- Event storage and indexing
- Audit trail features (replay, compare, track, compliance)

**Why:** Understand observability and compliance tracking.

---

## Navigation

- **Learning Path:**
  1. Read [ARCHITECTURE_V2.md](../architecture/ARCHITECTURE_V2.md) for concepts
  2. Review these posters to understand mechanisms
  3. Study [project examples](../examples/) to see applied architecture

- **By Role:**
  - **Builders:** Start with Project Runtime (1) and Package Loading (5)
  - **Agent Developers:** Focus on Agent Runtime (2) and Tool Model (3)
  - **Platform Developers:** Study all posters
  - **Operators:** Focus on Event Audit Trail (6)

---

## Viewing Mermaid Diagrams

These posters use Mermaid diagram syntax:

- **GitHub:** Renders automatically in markdown files
- **VS Code:** Requires Markdown Preview Mermaid Support extension
- **Local:** Use any Mermaid renderer (mermaid.live, etc.)

---

## Relationship to Other Documentation

| Document | Purpose | Audience |
|----------|---------|----------|
| **ARCHITECTURE_V2.md** | Authoritative spec | All |
| **Posters** (these) | Visual explanation | Visual learners |
| **Project Archetypes** | Domain applications | Business users |
| **Examples** | Working code | Builders |
| **ADRs** | Decision context | Architects |

