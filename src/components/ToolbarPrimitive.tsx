import type { WorkspacePrimitiveComponent } from "./shared";
import { asArray, asRecord, asString, Panel, titleCase } from "./shared";

export const ToolbarPrimitive: WorkspacePrimitiveComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const actions = Array.isArray(node.actions) ? node.actions : asArray(bind.actions).map((action) => asString(action));

  return (
    <Panel title={node.title ?? asString(bind.title, "Toolbar")} caption={asString(bind.caption) || "Toolbar"} className="workspace-panel--dense workspace-toolbar-surface">
      <div className="workspace-toolbar">
        {actions.length > 0
          ? actions.map((action, index) => (
              <button
                className={`workspace-button ${index === 0 ? "workspace-button--primary" : "workspace-button--secondary"}`.trim()}
                key={action}
                type="button"
              >
                {titleCase(action)}
              </button>
            ))
          : <span className="workspace-muted">No actions configured.</span>}
      </div>
    </Panel>
  );
};
