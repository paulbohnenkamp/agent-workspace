import type { WorkspacePrimitiveComponent } from "./shared";
import { asRecord, asString, Panel, renderListItems, pickArray } from "./shared";

export const PanelPrimitive: WorkspacePrimitiveComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const body = asString(bind.body ?? bind.content ?? bind.summary);
  const items = pickArray(bind, ["items", "projection"]);
  const caption = asString(bind.caption) || undefined;

  return (
    <Panel title={node.title ?? asString(bind.title, "Panel")} caption={caption}>
      <div className="workspace-stack">
        {body ? <p>{body}</p> : null}
        {items.length > 0 ? <div className="workspace-stack">{renderListItems(items, "No panel items.")}</div> : null}
      </div>
    </Panel>
  );
};
