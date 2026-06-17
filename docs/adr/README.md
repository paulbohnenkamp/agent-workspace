# Architecture Decision Records

This folder holds durable architecture decisions for the repository.

Use ADRs when a decision:

- changes the architecture in a meaningful way
- introduces a lasting terminology choice
- closes a design fork with non-trivial tradeoffs
- may need to be revisited or superseded later

## Naming

Use zero-padded numeric filenames:

- `0001-use-agent-skill-tool-hierarchy.md`
- `0002-center-the-model-on-output.md`

## Suggested Format

1. Title
2. Status
3. Context
4. Decision
5. Consequences
6. References

## Current ADRs

- [0001 Use Agent-Skill-Tool Hierarchy](0001-use-agent-skill-tool-hierarchy.md)
- [0002 Center The Model On Output](0002-center-the-model-on-output.md)
- [0003 Use Metadata-Driven Workspace Composition](0003-use-metadata-driven-workspace-composition.md)

## Notes

- Visual mockups and workspace originals live alongside the architecture docs, but ADRs should record only the durable architecture decisions behind them.
- Panel labels such as `AI Assistant`, `Knowledge Sources`, `Agents`, and `Actions` belong to the visual system unless a naming choice has architectural consequences.
