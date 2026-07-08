# Example Projects

These examples turn the archetype dashboards into filesystem-first Architecture V3 projects.

If you are here to continue an active implementation slice, start with [`plans/index.md`](../../plans/index.md). These examples are reference material and working samples, not the current handoff.

Each example directory is itself the project root:

```text
example-project/
  project.yaml
  agents/
  resources/
  artifacts/
  views/
    candidate-review/
      view.json
      react/
        view.json
  schedules/
```

The hiring example also includes a working workspace UI slice under `views/` that is rendered by the `system/` workspace pipeline during the repo smoke test.

To see that slice locally, run `npm run build:system`, then `npm run system` from the repo root and open `http://127.0.0.1:4010/`, or run `node build/system/system/render-workspace.smoke.js` after building to verify the rendered views.

## Examples

| Example | Domain | Archetype Image |
|---------|--------|-----------------|
| [Decision Project](./decision-project/README.md) | Strategic decisions | [image](../images/projects/decision-project.png) |
| [Finance Project](./finance-project/README.md) | Financial planning and analysis | [image](../images/projects/finance-project.png) |
| [Hiring Project](./hiring-project/README.md) | Talent management and hiring | [image](../images/projects/hiring-project.png) |
| [Partner Project](./partner-project/README.md) | Partner relationship management | [image](../images/projects/partner-project.png) |

## Navigation

- Back to [Architecture Overview](../architecture/README.md)
- Back to [Project Archetypes](../project-archetypes/README.md)
- Continue to [Source Packages](../../packages/README.md)
- See the [authoritative spec](../architecture/ARCHITECTURE_V3.md)
