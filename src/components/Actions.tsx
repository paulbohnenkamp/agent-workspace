import type { WorkspacePrimitiveComponent } from './shared';
import { asRecord, asString, normalizeActionDefinition, Panel } from './shared';

export const Actions: WorkspacePrimitiveComponent = ({ node, interpreted }) => {
  const actions = Array.isArray(node.actions) ? node.actions : [];
  const bind = asRecord(node.bind);
  const targetId = asString(bind.targetId ?? bind.matterId ?? bind.entityId);
  const actionEndpoint = asString(bind.actionEndpoint, `/land/actions?viewId=${interpreted.view.id}`);
  const projectId = interpreted.state.project.id;

  return (
    <Panel title={node.title ?? 'Actions'}>
      <div className="workspace-button-stack">
        {actions.map((action, index) => {
          const definition = normalizeActionDefinition(
            action,
            index === 0 ? 'primary' : 'secondary'
          );

          const button = (
            <button
              className={`workspace-button workspace-button--${definition.variant}`.trim()}
              key={`${definition.label}-${index}`}
              type={definition.actionId ? 'submit' : 'button'}
            >
              {definition.label}
            </button>
          );

          if (!definition.actionId) {
            return button;
          }

          return (
            <form
              className="workspace-action-form"
              key={`${definition.label}-${index}`}
              method="post"
              action={actionEndpoint}
            >
              <input type="hidden" name="projectId" value={projectId} />
              <input type="hidden" name="actionId" value={definition.actionId} />
              <input type="hidden" name="targetId" value={definition.targetId ?? targetId} />
              {button}
            </form>
          );
        })}
      </div>
    </Panel>
  );
};
