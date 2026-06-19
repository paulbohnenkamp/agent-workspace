# Agent Package Model

**Date:** June 19, 2026
**Status:** ✅ COMPLETE - Agent package-first implementation

## Overview

Agent packages are the primary way to define autonomous actors with capabilities, channels, schedules, and constraints.

**Agent Directory Structure:**

```
agent-name/
  agent.yaml                 # Agent definition (required)
  tools/                     # Tool packages
    tool-name.yaml
  skills/                    # Skill packages  
    skill-name.yaml
  channels/                  # Communication interfaces
    channel-name.yaml
  schedules/                 # Automation triggers
    schedule-name.yaml
  sandbox/                   # Execution constraints
    sandbox.yaml
  evals/                     # Evaluation definitions
    eval-name.yaml
```

## Agent Definition (agent.yaml)

Core agent specification:

```yaml
kind: agent
id: decision-analyzer-v1
name: Decision Analyzer
version: 1.0.0
description: Analyzes strategic decisions

model: claude-opus
role: strategic-analyst

instructions: |
  You are an expert strategic decision analyst.
  
  Your responsibilities:
  - Analyze complex business decisions
  - Evaluate options using structured frameworks
  - Identify risks and opportunities
  - Produce detailed analysis artifacts
  
  Process:
  1. Gather decision context
  2. Identify key stakeholders and impacts
  3. Evaluate each option
  4. Synthesize findings
  5. Document analysis

metadata:
  team: strategy
  domain: business-planning
  tags: [decision-support, analysis]
```

**Required Fields:**
- `kind: agent` - Package kind (must be "agent")
- `id` - Unique identifier
- `name` - Display name
- `version` - Semantic version

**Optional Fields:**
- `description` - What the agent does
- `model` - LLM model to use (default: claude-opus)
- `role` - Agent's primary role
- `instructions` - System prompt or behavior guidance
- `metadata` - Custom metadata

## Tool Packages (tools/)

External capabilities the agent can invoke.

```yaml
# tools/search-tool.yaml
kind: tool
id: search-api-v2
name: Web Search
version: 2.0.0
description: Search the internet for information

implementation:
  type: http
  method: POST
  endpoint: https://api.search.example.com/v2/search
  auth:
    type: bearer
    token_env: SEARCH_API_KEY

schema:
  inputs:
    type: object
    properties:
      query:
        type: string
        description: Search query
      limit:
        type: integer
        default: 10
    required: [query]
  
  outputs:
    type: object
    properties:
      results:
        type: array
        items:
          type: object
          properties:
            title: { type: string }
            url: { type: string }
            snippet: { type: string }

timeout_seconds: 30
retry_policy:
  max_attempts: 3
  backoff_seconds: 2
```

**Supported Implementation Types:**
- `http` - HTTP/REST API
- `connector` - Database or SaaS connector
- `mcp` - Model Context Protocol server
- `function` - Native code (Python, JavaScript, etc.)
- `platform_service` - Built-in platform service

## Skill Packages (skills/)

Reusable know-how composed from tools and other skills.

```yaml
# skills/financial-analysis.yaml
kind: skill
id: financial-analysis
name: Financial Analysis
version: 1.0.0
description: Comprehensive financial metrics calculation

tools:
  - id: search-api-v2
    name: Search
  - id: database-query
    name: Company Database

skills:
  - id: data-validation
    name: Data Validation

instructions: |
  Perform comprehensive financial analysis:
  
  1. Gather financial data using search and database tools
  2. Validate data quality
  3. Calculate key metrics (ROI, NPV, CAGR, etc.)
  4. Identify trends and anomalies
  5. Provide recommendations

schema:
  inputs:
    type: object
    properties:
      company_id:
        type: string
      years:
        type: integer
        default: 5
    required: [company_id]
  
  outputs:
    type: object
    properties:
      metrics:
        type: object
      trends:
        type: array
      recommendations:
        type: array
```

## Channel Packages (channels/)

Communication interfaces for agent output.

```yaml
# channels/slack-notifications.yaml
kind: channel
id: slack-notifications
name: Slack Notifications
version: 1.0.0
type: slack
description: Send notifications to Slack

config:
  workspace_id: T123456
  channel: "#analysis"
  auth:
    type: oauth
    token_env: SLACK_BOT_TOKEN

metadata:
  rate_limit: 10
  batching: true
```

**Supported Channel Types:**
- `slack` - Slack workspace messaging
- `email` - Email notifications
- `http` - HTTP webhooks
- `webhook` - Generic webhooks
- (extensible to others)

## Schedule Packages (schedules/)

Automation triggers for agent execution.

```yaml
# schedules/daily-analysis.yaml
kind: schedule
id: daily-analysis
name: Daily Analysis
version: 1.0.0
type: cron
description: Run analysis every day at 9 AM

trigger:
  expression: "0 9 * * *"  # 9 AM daily
  timezone: "America/New_York"

action:
  agent_id: decision-analyzer-v1
  input:
    task: "Daily strategic analysis"
  channels:
    - slack-notifications

metadata:
  enabled: true
  retry_on_failure: true
  max_retries: 3
```

**Supported Schedule Types:**
- `cron` - Time-based (cron expressions)
- `event` - Event-based triggers
- `manual` - Manual trigger only
- (extensible to others)

## Sandbox Package (sandbox/)

Execution environment constraints.

```yaml
# sandbox/sandbox.yaml
kind: sandbox
id: agent-sandbox
name: Agent Execution Sandbox
version: 1.0.0

limits:
  memory_mb: 2048
  cpu_shares: 1024
  timeout_seconds: 300
  disk_mb: 10240

allow:
  - network.http
  - file.read
  - file.write

deny:
  - network.tcp
  - system.exec
  - kernel.module

env:
  ISOLATION_LEVEL: strict
  LOG_LEVEL: info

metadata:
  type: strict
  audit_enabled: true
```

## Evaluation Packages (evals/)

Quality and performance evaluation definitions.

```yaml
# evals/analysis-quality.yaml
kind: eval
id: analysis-quality
name: Analysis Quality Eval
version: 1.0.0

criteria:
  - name: completeness
    weight: 0.3
    rubric: |
      1 - Missing key sections
      3 - Has most sections
      5 - Comprehensive coverage
  
  - name: accuracy
    weight: 0.4
    rubric: |
      1 - Multiple factual errors
      3 - Minor errors or omissions
      5 - Factually accurate
  
  - name: usefulness
    weight: 0.3
    rubric: |
      1 - Not actionable
      3 - Some useful insights
      5 - Highly actionable recommendations

dataset: evaluation_set_v1
```

## Loading Agents

### Using AgentLoader

```typescript
import { AgentLoader } from '@awp/loader';

const loader = new AgentLoader('./agents/decision-analyzer');

// Load with all registries
const { agentDefinition, registries } = await loader.loadWithRegistries();

console.log(agentDefinition.name);
console.log(registries.tools.count());        // Tool count
console.log(registries.skills.count());       // Skill count
console.log(registries.channels.count());     // Channel count
console.log(registries.schedules.count());    // Schedule count
```

### Using Registries

```typescript
// Get all tools
const tools = registries.tools.getAll();

// Get tools by type
const httpTools = registries.tools.getHttpTools();
const connectorTools = registries.tools.getConnectorTools();

// Get skills and their tools
const skills = registries.skills.getAll();
const skill = skills[0];
const skillTools = registries.skills.getToolsForSkill(skill.id);

// Get transitive tools (skill → nested skills → tools)
const allTools = registries.skills.getAllToolsForSkill(skill.id);

// Find what uses a tool
const skillsUsingTool = registries.skills.getSkillsUsingTool('search-api-v2');

// Get channels
const slackChannels = registries.channels.getSlackChannels();
const emailChannels = registries.channels.getEmailChannels();

// Get schedules
const cronSchedules = registries.schedules.getCronSchedules();
const eventSchedules = registries.schedules.getEventSchedules();

// Statistics
const stats = registries.getStats();
// { tools: 5, skills: 3, channels: 2, schedules: 1, sandboxes: 1 }
```

## Integration with Runtime

### From ProjectRuntime

```typescript
import { ProjectRuntime } from '@awp/runtime';
import { AgentLoader } from '@awp/loader';

// Load agent
const agentLoader = new AgentLoader('./agents/my-agent');
const { agentDefinition, registries } = await agentLoader.loadWithRegistries();

// Initialize project
const context = await runtime.initializeProject({
  project: { ... },
});

// Add agent to runtime
// (Runtime will use registries to resolve tools/skills)

// Execute agent
const result = await runtime.executeRun(projectId, {
  targetKind: 'agent',
  targetId: agentDefinition.id,
  triggeredBy: 'user-001',
});
```

## Best Practices

### 1. Package Naming

- Use lowercase kebab-case for package names
- Use semantic versioning (major.minor.patch)
- Prefer descriptive IDs (e.g., `search-api-v2` not just `search`)

### 2. Documentation

- Always include `description` field
- Include `instructions` for agents and skills
- Document tool implementation in comments

### 3. Capability Composition

- Create skills to compose related tools
- Create skills that compose other skills
- Prefer composition over large monolithic agents

### 4. Constraints

- Set appropriate `timeout_seconds` for tools
- Define `retry_policy` for unreliable tools
- Configure `sandbox` limits based on needs

### 5. Metadata

- Tag agents by domain/team/purpose
- Track versions carefully
- Use metadata for filtering/organization

## Schema Validation

All agent packages are validated:

```typescript
const loader = new AgentLoader('./agents/my-agent');
const structure = await loader.load();

// Check for errors
if (structure.errors.length > 0) {
  structure.errors.forEach(err => {
    console.error(`${err.directory}: ${err.error}`);
  });
}
```

## Example: Complete Agent

```
decision-analyzer/
├── agent.yaml
│   kind: agent
│   id: decision-analyzer
│   model: claude-opus
│   instructions: "You are a strategic decision analyst..."
│
├── tools/
│   ├── search-api.yaml       (HTTP-backed)
│   ├── database-query.yaml   (Connector-backed)
│   └── financial-calc.yaml   (Function-backed)
│
├── skills/
│   ├── market-analysis.yaml       (uses search-api)
│   ├── financial-analysis.yaml    (uses financial-calc, database-query)
│   └── option-evaluation.yaml     (uses market-analysis, financial-analysis)
│
├── channels/
│   ├── slack-output.yaml
│   └── email-summary.yaml
│
├── schedules/
│   ├── daily-analysis.yaml     (cron: 9 AM daily)
│   └── on-message.yaml         (event: when message received)
│
├── sandbox/
│   └── sandbox.yaml            (2GB memory, 5min timeout)
│
└── evals/
    └── analysis-quality.yaml   (criteria and rubrics)
```

## API Summary

### AgentLoader

```typescript
const loader = new AgentLoader(agentPath);

// Load complete structure
const structure = await loader.load();
// Returns: agentDefinition, toolResults, skillResults, channelResults, 
//          scheduleResults, sandboxResults, evals, errors

// Load with registries
const { agentDefinition, registries } = await loader.loadWithRegistries();
// Returns: agent, registries (ToolRegistry, SkillRegistry, ChannelRegistry, etc.)
```

### Registries

All registries have:
- `register(pkg)` - Register a package
- `get(id)` - Get by ID
- `getAll()` - Get all packages
- `has(id)` - Check existence
- `count()` - Package count
- `clear()` - Clear registry
- `resolve(references)` - Resolve references

Specialized query methods per registry type.

## What's Next

### Phase 3 Integration
- Wire up AgentCapabilityRegistry with ProjectRuntime
- Implement agent execution with tool invocation
- Handle channel output

### Phase 4 Advanced
- Schedule execution engine (cron, event-based)
- Evaluation framework (quality scoring)
- Agent performance tracking

## Conclusion

The agent package model provides:

✅ Organized capability management
✅ Clear composition patterns
✅ Reusable tools and skills
✅ Multi-channel output
✅ Execution automation
✅ Scalable architecture

Agents are now first-class filesystem packages with full capability management.
