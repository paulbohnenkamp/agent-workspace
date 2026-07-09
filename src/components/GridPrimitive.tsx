import type { WorkspacePrimitiveComponent } from "./shared";
import { asRecord, asString, pickArray } from "./shared";

export const GridPrimitive: WorkspacePrimitiveComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const items = pickArray(bind, ["items", "cells", "entries", "projection"]);
  const columns = Array.isArray(bind.columns)
    ? (bind.columns as unknown[]).map((value) => asString(value, "1fr")).join(" ")
    : asString(bind.columns ?? bind.templateColumns, "repeat(auto-fit, minmax(12rem, 1fr))");
  const body = asString(bind.body ?? bind.content ?? bind.summary);

  return (
    <section className="workspace-grid-surface">
      <header className="workspace-grid-surface__header">
        <div>
          <p className="workspace-grid-surface__eyebrow">Grid</p>
          <h2 className="workspace-grid-surface__title">{asString(node.title ?? bind.title, "Grid")}</h2>
          {asString(bind.caption ?? bind.subtitle) ? (
            <p className="workspace-grid-surface__caption">{asString(bind.caption ?? bind.subtitle)}</p>
          ) : null}
        </div>
      </header>
      {body ? <p className="workspace-grid-surface__body">{body}</p> : null}
      <div className="workspace-grid" style={{ gridTemplateColumns: columns }}>
        {items.length > 0 ? (
          items.map((item, index) => {
            const record = item as Record<string, unknown>;
            const id = typeof record.id === "string" ? record.id : `grid-${index}`;
            const title = typeof record.title === "string" ? record.title : typeof record.name === "string" ? record.name : typeof record.label === "string" ? record.label : "Cell";
            const detail = typeof record.detail === "string" ? record.detail : typeof record.body === "string" ? record.body : typeof record.summary === "string" ? record.summary : "";

            return (
              <article className="workspace-grid__cell" key={`${id}-${index}`}>
                <strong>{title}</strong>
                {detail ? <span className="workspace-muted">{detail}</span> : null}
              </article>
            );
          })
        ) : (
          <p className="workspace-muted">No grid cells.</p>
        )}
      </div>
    </section>
  );
};
