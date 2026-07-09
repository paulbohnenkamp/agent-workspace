import type { WorkspacePrimitiveComponent } from "./shared";
import { asRecord, asString, Panel, renderListItems, pickArray } from "./shared";

export const ListPrimitive: WorkspacePrimitiveComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const items = pickArray(bind, ["items", "projection", "entries"]);
  const caption = asString(bind.caption) || undefined;

  return (
    <Panel title={node.title ?? asString(bind.title, "List")} caption={caption}>
      <div className="workspace-stack">{renderListItems(items, "No list items.")}</div>
    </Panel>
  );
};
