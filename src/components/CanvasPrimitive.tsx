import type { WorkspacePrimitiveComponent } from "./shared";
import { asRecord, asString, Panel, pickArray } from "./shared";

function renderGridCells(items: Record<string, unknown>[]) {
  if (items.length === 0) {
    return <p className="workspace-muted">No canvas items.</p>;
  }

  return items.map((item, index) => {
    const record = item;
    const id = typeof record.id === "string" ? record.id : `cell-${index}`;
    const title = typeof record.title === "string" ? record.title : typeof record.name === "string" ? record.name : typeof record.label === "string" ? record.label : "Cell";
    const detail = typeof record.detail === "string" ? record.detail : typeof record.body === "string" ? record.body : typeof record.summary === "string" ? record.summary : "";

    return (
      <article className="workspace-grid__cell" key={`${id}-${index}`}>
        <strong>{title}</strong>
        {detail ? <span className="workspace-muted">{detail}</span> : null}
      </article>
    );
  });
}

export const CanvasPrimitive: WorkspacePrimitiveComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const body = asString(bind.body ?? bind.content ?? bind.summary);
  const items = pickArray(bind, ["items", "projection", "entries"]);

  return (
    <Panel title={node.title ?? asString(bind.title, "Canvas")} caption={asString(bind.caption) || "Canvas"} className="workspace-canvas">
      <div className="workspace-stack">
        {body ? <p>{body}</p> : null}
        {items.length > 0 ? <div className="workspace-grid">{renderGridCells(items)}</div> : null}
      </div>
    </Panel>
  );
};
