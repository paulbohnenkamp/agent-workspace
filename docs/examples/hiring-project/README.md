# Hiring Project Example

**Domain:** Talent Management and Hiring  
**Complexity:** Medium  
**Demonstrates:** Process orchestration, policy enforcement, human collaboration, pipeline tracking

---

## About This Example

This example shows how the Agent Platform manages complex hiring workflows. HR teams coordinate candidates, maintain compliance, and manage onboarding—the platform makes this consistent and traceable.

**Archetype Image:** [View Hiring Project Archetype](../../images/projects/hiring-project.png)

---

## Problem Domain

HR teams manage hiring, onboarding, policies, and employee relations. They need:

- Consistent hiring processes
- Policy compliance checking
- Onboarding coordination
- Employee information management
- Regulatory documentation

**With Agent Platform:** Agents coordinate workflows, maintain compliance, and document procedures.

---

## Project Structure

```
hiring-project/
├── README.md                    # This file
├── project/
│   ├── project.yaml            # Project definition
│   └── agents/                 # Agent definitions
│       ├── hr-coordinator.yaml
│       ├── policy-reviewer.yaml
│       └── hiring-assistant.yaml
├── resources/                  # HR resources
│   ├── company-structure.yaml
│   ├── hiring-policies.yaml
│   ├── compliance-requirements.yaml
│   └── employee-database.yaml
├── artifacts/                  # HR documents
│   ├── hiring-plan.yaml
│   ├── job-description.yaml
│   ├── candidate-evaluation.yaml
│   ├── onboarding-checklist.yaml
│   └── employee-record.yaml
└── schedules/                  # HR automation
    ├── weekly-hiring-review.yaml
    ├── monthly-onboarding.yaml
    └── quarterly-policy-review.yaml
```

---

## Participating Agents

### HR Coordinator
- Manages hiring workflows
- Coordinates onboarding
- Maintains employee records

### Policy Reviewer
- Checks policy compliance
- Flags compliance issues
- Recommends corrective actions

### Hiring Manager Assistant
- Evaluates candidates
- Creates interview feedback
- Tracks hiring pipeline

---

## Resources (Shared Context)

| Resource | Purpose |
|----------|---------|
| company-structure.yaml | Organizational chart |
| hiring-policies.yaml | Hiring standards and requirements |
| compliance-requirements.yaml | Legal/regulatory requirements |
| employee-database.yaml | System access and schema |

---

## Expected Artifacts

- Hiring Plan (versioned)
- Job Description (versioned)
- Candidate Evaluation (versioned per candidate)
- Onboarding Checklist (versioned)
- Employee Record (versioned)
- Policy Compliance Report (versioned)

---

## Schedules

| Schedule | Frequency | Purpose |
|----------|-----------|---------|
| Weekly Hiring Review | Mondays, 10 AM | Review pipeline and progress |
| Monthly Onboarding Check | 1st of month, 9 AM | Verify onboarding completion |
| Quarterly Policy Review | Quarterly | Review hiring policy compliance |

---

## Example Workflow

### New Hiring Request
```
1. HR Coordinator creates hiring plan
   ├─ Documents position requirements
   ├─ Identifies hiring timeline
   └─ Creates hiring plan artifact (v1)

2. Policy Reviewer checks compliance
   ├─ Verifies against hiring policies
   ├─ Checks regulatory compliance
   └─ Updates hiring plan (v2)

3. Job Description created
   └─ Published to candidates

4. Candidates apply
   └─ Tracked in hiring pipeline

5. Hiring Manager Assistant evaluates
   ├─ Reviews candidates
   ├─ Creates evaluation artifacts
   └─ Provides recommendations

6. Selection Thread
   ├─ Hiring managers discuss candidates
   ├─ Agents provide summaries
   └─ Decision documented

7. Onboarding
   ├─ HR Coordinator prepares onboarding
   ├─ Checklists created
   └─ Employee record created
```

---

## Architecture V2 Mapping

| Concept | Usage | Behind-the-Scenes |
|---------|-------|-------------------|
| **Project** | Container for all hiring work | "Hiring Project" |
| **Agent** | HR Coordinator, Policy Reviewer, Hiring Assistant | HR team members |
| **Tool** | Database query, policy search, candidate tools | How agents access information |
| **Skill** | Hiring skill, compliance skill | Agent specializations |
| **Channel** | Slack notifications to managers | How alerts are sent |
| **Schedule** | Weekly reviews, monthly onboarding, quarterly policy | Periodic checks |
| **Resource** | Policies, requirements, org chart, database | Hiring context |
| **Artifact** | Plans, evaluations, checklists, records | HR documents |
| **Thread** | Team discussion on candidates | Conversation history |
| **Run** | Each process step | Invisible tracking |

---

## Key Takeaway

Hiring is one domain pattern. The same architecture handles:
- Decision projects (evaluating options)
- Finance projects (managing data)
- Partner projects (relationship tracking)

Same 10 concepts. Different work. No new ontology.

---

## See Also

- [Architecture V2 Documentation](../../architecture/ARCHITECTURE_V2.md)
- [Decision Project Example](../decision-project/)
- [Finance Project Example](../finance-project/)
- [Partner Project Example](../partner-project/)
