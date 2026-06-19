# Partner Project Example

**Domain:** Partner Relationship Management  
**Complexity:** High  
**Demonstrates:** External communication, document analysis, relationship tracking, multi-party collaboration

---

## About This Example

This example shows how the Agent Platform manages complex partner relationships. Partner teams need to coordinate with external organizations, manage agreements, and track performance—the platform makes this structured and auditable.

**Archetype Image:** [View Partner Project Archetype](../../images/projects/partner-project.png)

---

## Problem Domain

Organizations manage complex partner relationships (vendors, resellers, strategic partners). They need:

- Structured partner onboarding
- Contract analysis and compliance
- Relationship management
- Performance tracking
- Communication coordination

**With Agent Platform:** Agents manage relationship workflows, analyze contracts, and track partner performance.

---

## Project Structure

```
partner-project/
├── README.md                    # This file
├── project/
│   ├── project.yaml            # Project definition
│   └── agents/                 # Agent definitions
│       ├── partner-manager.yaml
│       ├── contract-reviewer.yaml
│       └── relationship-analyst.yaml
├── resources/                  # Partnership resources
│   ├── partner-database.yaml
│   ├── contract-templates.yaml
│   ├── kpi-definitions.yaml
│   └── communication-protocols.yaml
├── artifacts/                  # Partnership documents
│   ├── partner-agreement.yaml
│   ├── contract-analysis.yaml
│   ├── relationship-status-report.yaml
│   └── performance-report.yaml
└── schedules/                  # Partnership automation
    ├── monthly-review.yaml
    ├── quarterly-review.yaml
    └── annual-strategy.yaml
```

---

## Participating Agents

### Partner Manager
- Oversees partnership lifecycle
- Coordinates communication
- Manages relationship status

### Contract Reviewer
- Analyzes partner agreements
- Checks legal compliance
- Flags risks and issues

### Relationship Analyst
- Monitors partner performance
- Tracks KPIs
- Identifies issues and opportunities

---

## Resources (Shared Context)

| Resource | Purpose |
|----------|---------|
| partner-database.yaml | Partner information system |
| contract-templates.yaml | Standard agreement templates |
| kpi-definitions.yaml | Performance metrics definitions |
| communication-protocols.yaml | Partner communication guidelines |

---

## Expected Artifacts

- Partner Agreement (versioned)
- Contract Analysis (versioned)
- Relationship Status Report (versioned)
- Performance Report (versioned)
- Communication Plan (versioned)

---

## Schedules

| Schedule | Frequency | Purpose |
|----------|-----------|---------|
| Monthly Review | 1st of month, 10 AM | Relationship status review |
| Quarterly Business Review | Quarterly, 2 PM | Formal QBR with partner |
| Annual Strategy | January 1st | Annual strategic discussion |

---

## Example Workflow

### New Partnership Onboarding
```
1. Partner Manager creates partnership plan
   ├─ Identifies partnership goals
   ├─ Plans onboarding steps
   └─ Creates partnership artifact (v1)

2. Contract Reviewer analyzes agreement
   ├─ Reviews legal terms
   ├─ Checks compliance
   ├─ Flags risks
   └─ Updates agreement artifact (v2)

3. Relationship Analyst sets up tracking
   ├─ Defines performance metrics
   ├─ Sets up KPI tracking
   └─ Finalizes agreement (v3)

4. Partnership Discussion Thread
   ├─ Both parties contribute feedback
   ├─ Issues identified and addressed
   ├─ Agents provide analysis
   └─ Updates artifact (v4)

5. Quarterly Business Review
   ├─ Both parties review performance
   ├─ Performance Report generated
   └─ Strategic planning conducted
```

---

## Architecture V2 Mapping

| Concept | Usage | Behind-the-Scenes |
|---------|-------|-------------------|
| **Project** | Container for partnership work | "Partner Project" |
| **Agent** | Partner Manager, Contract Reviewer, Analyst | Partnership team |
| **Tool** | Partner database, contract analysis | Agent capabilities |
| **Skill** | Contract analysis, performance tracking | Specializations |
| **Channel** | Email communication with partners | External communication |
| **Schedule** | Monthly reviews, quarterly QBR, annual strategy | Periodic interactions |
| **Resource** | Database, templates, policies, protocols | Partnership context |
| **Artifact** | Agreements, reports, analyses | Partnership documents |
| **Thread** | Partnership discussion and decisions | Conversation history |
| **Run** | Each interaction with partner | Invisible tracking |

---

## Key Takeaway

Partner management is one domain. The same architecture supports:
- Decision projects (strategic choices)
- Finance projects (financial management)
- Hiring projects (talent management)

Same 10 concepts. Different relationships. No new ontology.

---

## See Also

- [Architecture V2 Documentation](../../architecture/ARCHITECTURE_V2.md)
- [Decision Project Example](../decision-project/)
- [Finance Project Example](../finance-project/)
- [Hiring Project Example](../hiring-project/)
