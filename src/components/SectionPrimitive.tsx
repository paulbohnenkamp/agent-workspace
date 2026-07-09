import type { WorkspacePrimitiveComponent } from "./shared";
import { asRecord, asString, Panel, renderListItems, pickArray } from "./shared";

export const SectionPrimitive: WorkspacePrimitiveComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const body = asString(bind.body ?? bind.content ?? bind.summary);
  const items = pickArray(bind, ["items", "entries", "projection"]);

  return (
    <Panel title={node.title ?? asString(bind.title, "Section")} caption={asString(bind.caption) || "Section"} className="workspace-section">
      <div className="workspace-stack">
        {body ? <p>{body}</p> : null}
        {items.length > 0 ? <div className="workspace-stack">{renderListItems(items, "No section items.")}</div> : null}
      </div>
    </Panel>
  );
};
