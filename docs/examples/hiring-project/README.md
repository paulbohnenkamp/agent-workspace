# Hiring Project Example

This example shows how Architecture V2 supports hiring, policy review, and onboarding as one project-centric system.

## Archetype

- [Hiring Project image](../../images/projects/hiring-project.png)

## Structure

```text
hiring-project/
  project.yaml
  agents/
    hr-coordinator/
      agent.yaml
    hiring-assistant/
      agent.yaml
    policy-reviewer/
      agent.yaml
  resources/
    company-structure.yaml
    compliance-requirements.yaml
    employee-database.yaml
    hiring-policies.yaml
  artifacts/
    hiring-plan.yaml
    job-description.yaml
    candidate-evaluation.yaml
    onboarding-checklist.yaml
    employee-record.yaml
    policy-compliance-report.yaml
  schedules/
    weekly-hiring-review.yaml
    monthly-onboarding.yaml
    quarterly-policy-review.yaml
```

## What It Demonstrates

- Human-agent collaboration around hiring work
- Policy and compliance resources shared across agents
- Hiring and onboarding artifacts as durable outcomes
- Recurring governance and onboarding checks

## See Also

- [Architecture V2](../../architecture/ARCHITECTURE_V2.md)
- [Project Archetypes](../../project-archetypes/README.md)
- [Decision Project](../decision-project/README.md)
- [Finance Project](../finance-project/README.md)
- [Partner Project](../partner-project/README.md)
