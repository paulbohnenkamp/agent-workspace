# Decision Project Example

This example shows how Architecture V2 supports strategic decision-making without adding any domain-specific ontology.

## Archetype

- [Decision Project image](../../images/projects/decision-project.png)

## Structure

```text
decision-project/
  project.yaml
  agents/
    decision-analyzer/
      agent.yaml
      tools/
      skills/
      channels/
    options-synthesizer/
      agent.yaml
    risk-assessor/
      agent.yaml
  resources/
    company-strategy.yaml
    decision-criteria.yaml
    historical-decisions.yaml
    stakeholder-list.yaml
  artifacts/
    decision-analysis.yaml
    risk-assessment.yaml
  schedules/
    daily-review.yaml
    monthly-review.yaml
    weekly-synthesis.yaml
```

## What It Demonstrates

- Multi-agent decision analysis
- Shared project context through resources
- Artifact-centric outputs with durable schemas
- Scheduled review and synthesis work

## See Also

- [Architecture V2](../../architecture/ARCHITECTURE_V2.md)
- [Project Archetypes](../../project-archetypes/README.md)
- [Finance Project](../finance-project/README.md)
- [Hiring Project](../hiring-project/README.md)
- [Partner Project](../partner-project/README.md)
