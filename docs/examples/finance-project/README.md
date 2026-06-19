# Finance Project Example

**Domain:** Financial Planning and Analysis  
**Complexity:** Medium-High  
**Demonstrates:** Data integration, multi-agent analysis, scheduled reporting, metrics tracking

---

## About This Example

This example shows how the Agent Platform automates financial management. Financial teams manage complex data flows, generate reports, and track performance—the platform makes this consistent and auditable.

**Archetype Image:** [View Finance Project Archetype](../../images/projects/finance-project.png)

---

## Problem Domain

Finance teams manage budgets, forecasts, and financial reports. They need:

- Automated financial data gathering and analysis
- Consistent reporting standards
- Budget vs. actual tracking
- Scenario planning and forecasting
- Audit-ready documentation

**With Agent Platform:** Agents handle data gathering, analysis, and report generation. All work is versioned and auditable.

---

## Project Structure

```
finance-project/
├── README.md                    # This file
├── project/
│   ├── project.yaml            # Project definition
│   └── agents/                 # Agent definitions
│       ├── financial-analyst.yaml
│       ├── budget-reviewer.yaml
│       └── forecaster.yaml
├── resources/                  # Financial resources
│   ├── financial-data-sources.yaml
│   ├── budget-structure.yaml
│   ├── historical-financials.yaml
│   └── financial-policies.yaml
├── artifacts/                  # Reports and analysis
│   ├── monthly-report.yaml
│   ├── budget-analysis.yaml
│   ├── financial-forecast.yaml
│   └── variance-report.yaml
└── schedules/                  # Automation
    ├── daily-sync.yaml
    ├── monthly-report.yaml
    ├── quarterly-review.yaml
    └── annual-forecast.yaml
```

---

## Participating Agents

### Financial Analyst
- Gathers financial data from systems
- Analyzes trends and variances
- Creates financial analysis artifacts

### Budget Reviewer
- Reviews budget performance
- Identifies variances and anomalies
- Recommends adjustments

### Forecaster
- Creates financial projections
- Analyzes scenarios
- Generates forecast reports

---

## Resources (Shared Context)

| Resource | Purpose |
|----------|---------|
| financial-data-sources.yaml | Data system connections |
| budget-structure.yaml | Chart of accounts |
| historical-financials.yaml | Prior year data |
| financial-policies.yaml | Corporate policies |

---

## Expected Artifacts

- Monthly Financial Report (versioned)
- Budget Analysis (versioned)
- Financial Forecast (versioned)
- Variance Report (versioned)

---

## Schedules

| Schedule | Frequency | Purpose |
|----------|-----------|---------|
| Daily Data Sync | 8 AM daily | Gather latest financial data |
| Monthly Report | 1st of month, 9 AM | Generate monthly report |
| Quarterly Review | 1st of quarters | Comprehensive financial review |
| Annual Forecast | January 1st | Annual projection |

---

## Example Workflow

### Month-End Financial Close
```
1. Daily Data Sync runs automatically
   └─ Financial Analyst pulls latest data

2. Month End: Financial Analyst runs
   ├─ Compiles financial data
   └─ Creates monthly report (v1)

3. Budget Reviewer analyzes
   ├─ Analyzes budget vs. actual
   └─ Identifies variances (v2)

4. Forecaster updates
   ├─ Updates financial projections
   └─ Finalizes report (v3)

5. Internal Review Thread
   ├─ CFO reviews and comments
   ├─ Agents respond to questions
   └─ Final updates (v4)

6. Report Published
   └─ Distributed to stakeholders
```

---

## Architecture V2 Mapping

| Concept | Usage | Behind-the-Scenes |
|---------|-------|-------------------|
| **Project** | Container for financial work | "Finance Project" |
| **Agent** | Analyst, Reviewer, Forecaster | Finance team members |
| **Tool** | Data query, report generation | How agents gather/create data |
| **Skill** | Analysis, forecasting, reporting | Agent specializations |
| **Channel** | Email reports to executives | How reports reach recipients |
| **Schedule** | Daily sync, monthly reports, quarterly reviews | Periodic automation |
| **Resource** | Financial data, models, policies | Shared financial context |
| **Artifact** | Reports, forecasts, analyses | Financial documents |
| **Thread** | Finance team review discussion | Conversation about reports |
| **Run** | Each analysis execution | Invisible tracking |

---

## Key Takeaway

Finance is just one domain. The same architecture works for:
- Decision projects (analysis, risk assessment)
- Hiring projects (candidates, onboarding)
- Partner projects (contracts, performance)

Same 10 concepts. Different applications. No new ontology.

---

## See Also

- [Architecture V2 Documentation](../../architecture/ARCHITECTURE_V2.md)
- [Decision Project Example](../decision-project/)
- [Hiring Project Example](../hiring-project/)
- [Partner Project Example](../partner-project/)
