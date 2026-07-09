import type { WorkspacePrimitiveComponent } from './shared';
import { normalizeActionDefinition, Panel } from './shared';

export const Actions: WorkspacePrimitiveComponent = ({ node }) => {
  const actions = Array.isArray(node.actions) ? node.actions : [];

  return (
    <Panel title={node.title ?? 'Actions'}>
      <div className="workspace-button-stack">
        {actions.map((action, index) => {
          const definition = normalizeActionDefinition(
            action,
            index === 0 ? 'primary' : 'secondary'
          );

          return (
            <button
              className={`workspace-button workspace-button--${definition.variant}`.trim()}
              key={`${definition.label}-${index}`}
              type="button"
            >
              {definition.label}
            </button>
          );
        })}
      </div>
    </Panel>
  );
};
