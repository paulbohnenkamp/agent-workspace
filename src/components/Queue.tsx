import type { WorkspacePrimitiveComponent } from "./shared";
import { asArray, asNumber, asRecord, asString, Badge, Panel } from "./shared";

export const Queue: WorkspacePrimitiveComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const items = asArray(bind.projection);
  const selectedId = asString(bind.selectedId);

  return (
    <Panel title={node.title ?? "Queue"} caption="Queue">
      <div className="workspace-list">
        {items.map((item) => {
          const id = asString(item.id);
          const badge = asString(item.badge ?? item.status);

          return (
            <article className={`workspace-list-item ${id === selectedId ? "is-selected" : ""}`.trim()} key={id}>
              <div className="workspace-list-item__topline">
                <strong>{asString(item.name ?? item.candidateName)}</strong>
                {badge ? <Badge label={badge} /> : null}
              </div>
              {item.role ? <p className="workspace-list-item__secondary">{asString(item.role)}</p> : null}
              <div className="workspace-list-item__meta">
                {typeof item.score === "number" ? <span>Score {asNumber(item.score)}</span> : null}
                {item.updatedAgo ? <span>{asString(item.updatedAgo)}</span> : null}
                {item.owner ? <span>{asString(item.owner)}</span> : null}
              </div>
            </article>
          );
        })}
      </div>
    </Panel>
  );
};
