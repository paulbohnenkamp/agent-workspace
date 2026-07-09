# Systems Project Example

This example shows how Architecture V3 supports systems management, operational review, provisioning, and incident response as one project-centric workflow.

It is closest to enterprise control-plane work:

- operators review target health, incidents, and maintenance windows
- agents summarize monitoring signals and runbook context
- provisioning and remediation work is captured as durable artifacts
- approvals, retries, and escalations can arrive asynchronously

## Archetype

- [Systems Project image](../../images/projects/systems-project.png)

## Structure

```text
systems-project/
  project.yaml
  agents/
    systems-operator/
      agent.yaml
      tools/
      connectors/
      skills/
    provisioning-agent/
      agent.yaml
    reliability-reviewer/
      agent.yaml
  resources/
    target-inventory.yaml
    monitoring-policies.yaml
    runbooks.yaml
    change-calendar.yaml
  artifacts/
    system-health-report.yaml
    provisioning-plan.yaml
    incident-summary.yaml
    maintenance-plan.yaml
    change-approval.yaml
  schedules/
    daily-health-review.yaml
    weekly-maintenance-planning.yaml
    monthly-capacity-review.yaml
```

## What It Demonstrates

- Control-plane workflows for systems, databases, services, and operational targets
- Monitoring, provisioning, maintenance, and incident work inside one project
- Shared runbooks, target inventory, policies, and change-calendar context
- AI-assisted summaries that remain grounded in resources and durable artifacts
- Human approval, escalation, and retry flows around operational actions
- One featured V3 agent package with nested connector, tools, and skills

## See Also

- [Architecture V3](../../architecture/ARCHITECTURE_V3.md)
- [Project Archetypes](../../project-archetypes/README.md)
- [Decision Project](../decision-project/README.md)
- [Finance Project](../finance-project/README.md)
- [Hiring Project](../hiring-project/README.md)
- [Partner Project](../partner-project/README.md)
