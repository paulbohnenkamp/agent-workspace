import type { WorkspacePrimitiveComponent } from "./shared";
import { Panel, titleCase } from "./shared";

export const Actions: WorkspacePrimitiveComponent = ({ node }) => {
  const actions = Array.isArray(node.actions) ? node.actions : [];

  return (
    <Panel title={node.title ?? "Actions"} caption="Actions">
      <div className="workspace-button-stack">
        {actions.map((action, index) => (
          <button
            className={`workspace-button ${index === 0 ? "workspace-button--primary" : "workspace-button--secondary"}`.trim()}
            key={action}
            type="button"
          >
            {titleCase(action)}
          </button>
        ))}
      </div>
    </Panel>
  );
};
