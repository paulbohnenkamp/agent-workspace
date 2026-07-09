import type { WorkspacePrimitiveComponent } from "./shared";
import { asRecord, asString, Panel, renderListItems, pickArray } from "./shared";

export const StackPrimitive: WorkspacePrimitiveComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const items = pickArray(bind, ["items", "entries", "projection", "sections"]);
  const body = asString(bind.body ?? bind.content ?? bind.summary);

  return (
    <Panel title={node.title ?? asString(bind.title, "Stack")} caption={asString(bind.caption) || "Stack"} className="workspace-panel--dense workspace-stack-surface">
      <div className="workspace-stack">
        {body ? <p>{body}</p> : null}
        {items.length > 0 ? <div className="workspace-stack">{renderListItems(items, "No stack items.")}</div> : null}
      </div>
    </Panel>
  );
};
