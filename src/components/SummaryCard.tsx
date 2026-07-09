import type { WorkspacePrimitiveComponent } from "./shared";
import { asArray, asRecord, asString, Badge, Panel, pickRecord } from "./shared";

export const SummaryCard: WorkspacePrimitiveComponent = ({ node, interpreted }) => {
  const bind = asRecord(node.bind);
  const record = pickRecord(bind, ["record", "entity", "candidate", "artifact", "item", "assistant", "source"]);
  const artifactFromBind = pickRecord(bind, ["artifact", "record", "entity"]);
  const selection = asString(bind.selection);
  const artifactFromSelection = selection
    ? asArray(interpreted.state.artifact_versions).find((entry) => asString(entry.id) === selection)
    : undefined;
  const artifact = Object.keys(artifactFromBind).length > 0 ? artifactFromBind : asRecord(artifactFromSelection);
  const sections = asArray(artifact.sections);
  const firstSection = asRecord(sections[0]);
  const hasRecord = Object.keys(record).length > 0;
  const hasArtifact = Object.keys(artifact).length > 0;

  return (
    <Panel title={node.title ?? "Summary"} caption="Summary" meta={hasRecord ? <Badge label="Live" /> : null}>
      <div className="workspace-stack">
        {hasRecord ? (
          <div>
            <strong>{asString(record.name ?? record.title ?? record.label, "Record")}</strong>
            <p className="workspace-muted">{asString(record.role ?? record.type ?? record.status)}</p>
          </div>
        ) : null}
        {hasArtifact ? <p>{asString(firstSection.body, "No summary available.")}</p> : <p className="workspace-muted">No summary available.</p>}
        {hasRecord ? (
          <div className="workspace-button-stack">
            <button type="button" className="workspace-button workspace-button--secondary">
              Review
            </button>
            <button type="button" className="workspace-button workspace-button--secondary">
              Request changes
            </button>
          </div>
        ) : null}
      </div>
    </Panel>
  );
};
