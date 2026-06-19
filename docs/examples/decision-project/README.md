# Decision Project Example

**Domain:** Strategic Decision-Making  
**Complexity:** Medium  
**Demonstrates:** Multi-agent collaboration, artifact versioning, resource usage, thread-based discussion

---

## About This Example

This example shows how the Agent Platform supports complex organizational decision-making. The same architecture that works for financial analysis also works for strategic decisions—different domain, same 10 core concepts.

**Archetype Image:** [View Decision Project Archetype](../../images/projects/decision-project.png)

---

## Problem Domain

Organizations make complex strategic decisions daily (market entry, product launches, partnerships, investments). These require:

- Gathering information from multiple sources
- Evaluating diverse options against established criteria
- Assessing risks and opportunities
- Building consensus across stakeholders
- Documenting reasoning for audit trails

**Without Agent Platform:** Manual processes, siloed analysis, inconsistent frameworks, poor auditability

**With Agent Platform:** Structured, agent-driven analysis with versioned artifacts and complete audit trails

---

## Project Structure

```
decision-project/
├── README.md                    # This file
├── project/
│   ├── project.yaml            # Project definition (name, agents, resources, schedules)
│   └── agents/                 # Agent definitions
│       ├── decision-analyzer.yaml
│       ├── risk-assessor.yaml
│       └── options-synthesizer.yaml
├── resources/                  # Shared resources
│   ├── company-strategy.yaml
│   ├── decision-criteria.yaml
│   ├── stakeholder-list.yaml
│   └── historical-decisions.yaml
├── artifacts/                  # Artifact type definitions
│   ├── decision-analysis.yaml
│   └── risk-assessment.yaml
└── schedules/                  # Scheduled automation
    ├── daily-review.yaml
    ├── weekly-synthesis.yaml
    └── monthly-review.yaml
```

---

## Participating Agents

### Decision Analyzer
**Role:** Primary decision analysis agent

**Responsibilities:**
- Gather decision context and stakeholder inputs
- Identify and structure decision options
- Establish evaluation framework
- Coordinate analysis workflow

**Tools Used:**
- information-search (research options)
- stakeholder-interview (gather requirements)
- decision-framework (structure analysis)

**Skills Used:**
- option-evaluation (evaluate each option)

### Risk Assessor
**Role:** Risk identification and mitigation

**Responsibilities:**
- Identify potential risks in each option
- Assess probability and impact
- Recommend mitigation strategies

### Options Synthesizer
**Role:** Integrate analysis into recommendation

**Responsibilities:**
- Synthesize findings from all agents
- Create final recommendation
- Propose implementation timeline

---

## Resources (Shared Context)

| Resource | Purpose |
|----------|---------|
| company-strategy.yaml | Corporate strategic priorities, market positioning |
| decision-criteria.yaml | Decision evaluation framework, weighting, thresholds |
| stakeholder-list.yaml | Stakeholders involved, their interests, sign-off requirements |
| historical-decisions.yaml | Past decisions and outcomes for pattern learning |

---

## Expected Artifacts

### Decision Analysis (Versioned)
- Executive Summary
- Decision Context
- Options Evaluated (with pros/cons)
- Risk Assessment
- Recommendation
- Implementation Timeline
- Stakeholder Sign-off

### Risk Assessment (Versioned)
- Risk Inventory
- Probability/Impact Matrix
- Top Risks
- Mitigation Strategies

---

## Schedules

| Schedule | Frequency | Purpose |
|----------|-----------|---------|
| Daily Review | 9 AM daily | Review all open decisions, provide status updates |
| Weekly Synthesis | 5 PM Fridays | Synthesize weekly findings, prepare executive briefing |
| Monthly Review | Last business day | Deep review of major decisions, strategic impact |

---

## Example Workflow

### New Decision
```
1. Decision Analyzer receives request
   ├─ Gathers stakeholder inputs
   ├─ Frames decision options
   └─ Creates initial analysis artifact (v1)

2. Risk Assessor evaluates risks
   ├─ Uses risk-database tool
   ├─ Identifies mitigation strategies
   └─ Updates decision artifact (v2)

3. Options Synthesizer integrates findings
   ├─ Creates final recommendation
   ├─ Proposes timeline
   └─ Finalizes decision artifact (v3)

4. Thread: Stakeholder Review
   ├─ Humans discuss artifact
   ├─ Agents respond to questions
   └─ Updates artifact (v4)

5. Final: Decision Approved
   └─ Artifact status: active
```

---

## Architecture V2 Mapping

| Concept | Usage in Decision Project | Behind-the-Scenes |
|---------|--------------------------|-------------------|
| **Project** | Container for decision work | What user sees as "Decision Project" |
| **Agent** | Decision Analyzer, Risk Assessor, Synthesizer | "Team members" helping with analysis |
| **Tool** | Search, database, framework tools | Capabilities agents use to work |
| **Skill** | Option evaluation skill | Agents' specialized abilities |
| **Channel** | Slack notifications to stakeholders | How updates reach people |
| **Schedule** | Daily review, weekly synthesis, monthly review | Automatic periodic work |
| **Resource** | Company strategy, criteria, stakeholder list | Shared context and knowledge |
| **Artifact** | Decision Analysis, Risk Assessment | The documents being created |
| **Thread** | Stakeholder discussion about decision | Conversation history |
| **Run** | Each agent invocation | Execution records (invisible) |

---

## Key Takeaway

**The Decision Project is NOT unique.** The exact same architecture supports:
- Finance projects (reports, forecasts, budgets)
- Hiring projects (candidates, onboarding, compliance)
- Partner projects (agreements, performance, relationships)

Same 10 core concepts. Different domains. No new ontology needed.

---

## How to Use This Example

1. **Understand the domain:** Read "Problem Domain" and "Project Structure" above
2. **Study the YAML:** Examine project.yaml and agent definitions
3. **See the architecture in action:** Compare this project to the other 3 examples
4. **Learn the mapping:** See how Architecture V2 concepts apply to real work

---

## Files

- `project/project.yaml` - Project definition (agents, resources, schedules)
- `project/agents/` - Agent definitions (what agents participate)
- `resources/` - Shared resources (data sources, policies, context)
- `artifacts/` - Artifact type definitions (what gets created)
- `schedules/` - Scheduled automation triggers

---

## See Also

- [Architecture V2 Documentation](../../architecture/ARCHITECTURE_V2.md)
- [Finance Project Example](../finance-project/)
- [Hiring Project Example](../hiring-project/)
- [Partner Project Example](../partner-project/)
