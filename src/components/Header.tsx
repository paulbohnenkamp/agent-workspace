import type { WorkspacePrimitiveComponent } from "./shared";
import { asNumber, asRecord, asString, Badge, pickRecord } from "./shared";

export const Header: WorkspacePrimitiveComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const record = pickRecord(bind, ["record", "entity", "candidate", "artifact", "item", "assistant", "source"]);
  const badge = asString(record.badge ?? record.status ?? record.state);

  return (
    <section className="workspace-document workspace-document--hero">
      <div className="workspace-document__hero">
        <div>
          <p className="workspace-document__eyebrow">{node.title ?? "Workspace view"}</p>
          <h1 className="workspace-document__title">{asString(record.name ?? record.title ?? node.title, "Header")}</h1>
          <p className="workspace-document__subtitle">{asString(record.role ?? record.type ?? record.subtitle)}</p>
        </div>
        <div className="workspace-document__hero-meta">
          {badge ? <Badge label={badge} /> : null}
          <div className="workspace-score-card">
            <span className="workspace-muted">Score</span>
            <strong>{asNumber(record.score)}</strong>
          </div>
        </div>
      </div>
      <p className="workspace-document__summary">
        Review the current record, discussion trail, source material, and workflow support before advancing or requesting revisions.
      </p>
    </section>
  );
};
