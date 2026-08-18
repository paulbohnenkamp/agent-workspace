# Example projects

These examples show how the platform model becomes a product surface.

If you are continuing an active implementation slice, start with the [plan index](../../plans/index.md). These examples are reference material and working samples, not the current handoff.

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

The hiring example includes a working workspace UI slice under `views/` that is
rendered by the `src/` workspace pipeline during the repository smoke test. The
land example includes a Next.js application slice backed by the same project
and view package model.

When authoring workspace views in the examples, use the canonical component aliases from the registry:

- Shell and layout roles: `shell`, `rail`, `canvas`, `section`, `stack`, `grid`, `toolbar`
- Content primitives: `badge`, `panel`, `card`, `list`, `document`, `text`, `divider`
- Composite workspace surfaces: `header`, `queue`, `summaryCard`, `timeline`, `composer`, `tabs`, `sources`, `statusList`, `actions`

The registry is the alias map; implementations live one per file under `src/components/`.

## Add another example

Start from an existing example's filesystem shape. Read the repository guide,
Architecture V3, the relevant specification, and the relevant ADR. Then create
`project.yaml`, `agents/`, `resources/`, `artifacts/`, `schedules/`, and, when
the project includes UI, `views/`.

Keep instructions in `agent.yaml`, use locally defined Skills and Tools, and
keep domain behavior in YAML, resources, artifacts, schedules, view metadata,
and sample projected state. Use registered generic components and the shared
workspace composition shown in the project archetype images: work queue, AI
Assistant, primary artifact/work surface, and right-side panels for knowledge
sources, agents, and actions.

Views are workflow surfaces, not necessarily job functions. Multiple agents,
human users, and handoffs may use one view. Before completion, parse every YAML
package, resolve references, validate views and component aliases, and run the
relevant tests and builds. Do not add packs, manifests, or a new domain
ontology to an example.

Workspace views are composed in these layers:

1. `view.json` declares the shell, layout, regions, and node order.
2. The loader validates the view and resolves aliases against the registry.
3. The layout builder places the resolved nodes into regions.
4. The React shell and components render the composed workspace.

To see that slice locally, run `npm run build:workspace`, then `npm run workspace` from the repo root and open `http://127.0.0.1:4010/`, or run `node build/src/render-workspace.smoke.js` after building to verify the rendered views.

## Available examples

| Example | Domain | Archetype image |
|---------|--------|-----------------|
| [Decision Project](./decision-project/README.md) | Strategic decisions | [Decision workspace image](../images/projects/decision-project.png) |
| [Finance Project](./finance-project/README.md) | Financial planning and analysis | [Finance workspace image](../images/projects/finance-project.png) |
| [Hiring Project](./hiring-project/README.md) | Talent management and hiring | [Hiring workspace image](../images/projects/hiring-project.png) |
| [Land project](./land-project/README.md) | Land management and administration | [Land workspace image](../images/projects/land-project.png) |
| [Partner Project](./partner-project/README.md) | Partner relationship management | [Partner workspace image](../images/projects/partner-project.png) |
| [Systems Project](./systems-project/README.md) | Systems management and operations | [Systems workspace image](../images/projects/systems-project.png) |

## Navigation

- Back to [Architecture Overview](../architecture/README.md)
- Back to [Project Archetypes](../project-archetypes/README.md)
- Continue to [Source Packages](../../packages/README.md)
- See the [authoritative spec](../architecture/ARCHITECTURE_V3.md)
