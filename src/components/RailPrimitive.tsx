import type { WorkspacePrimitiveComponent } from "./shared";
import { asRecord, asString, Panel, renderListItems, pickArray } from "./shared";

export const RailPrimitive: WorkspacePrimitiveComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const body = asString(bind.body ?? bind.content ?? bind.summary);
  const items = pickArray(bind, ["items", "projection", "entries"]);

  return (
    <Panel title={node.title ?? asString(bind.title, "Rail")} caption={asString(bind.caption) || "Rail"} className="workspace-panel--dense workspace-rail">
      <div className="workspace-stack">
        {body ? <p>{body}</p> : null}
        {items.length > 0 ? <div className="workspace-stack">{renderListItems(items, "No rail items.")}</div> : null}
      </div>
    </Panel>
  );
};
