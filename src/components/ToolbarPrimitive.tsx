import type { WorkspaceActionValue } from '../../packages/types/src/workspace';
import type { WorkspacePrimitiveComponent } from './shared';
import { asRecord, asString, normalizeActionDefinition, Panel } from './shared';

function isActionValue(value: unknown): value is WorkspaceActionValue {
  return (
    typeof value === 'string' ||
    (value != null && typeof value === 'object' && !Array.isArray(value))
  );
}

export const ToolbarPrimitive: WorkspacePrimitiveComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const actionValues = Array.isArray(node.actions)
    ? node.actions
    : Array.isArray(bind.actions)
      ? bind.actions.filter(isActionValue)
      : [];

  return (
    <Panel
      title={node.title ?? asString(bind.title, 'Toolbar')}
      caption={asString(bind.caption) || 'Toolbar'}
      className="workspace-panel--dense workspace-toolbar-surface"
    >
      <div className="workspace-toolbar">
        {actionValues.length > 0 ? (
          actionValues.map((action, index) => {
            const definition = normalizeActionDefinition(
              action,
              index === 0 ? 'primary' : 'secondary'
            );

            return (
              <button
                className={`workspace-button ${index === 0 ? 'workspace-button--primary' : 'workspace-button--secondary'}`.trim()}
                key={`${definition.label}-${index}`}
                type="button"
              >
                {definition.label}
              </button>
            );
          })
        ) : (
          <span className="workspace-muted">No actions configured.</span>
        )}
      </div>
    </Panel>
  );
};
