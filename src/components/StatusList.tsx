import type { WorkspacePrimitiveComponent } from "./shared";
import { asArray, asRecord, asString, Badge, Panel } from "./shared";

export const StatusList: WorkspacePrimitiveComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const runs = asArray(bind.runs);

  return (
    <Panel title={node.title ?? "Status"} caption="Runtime">
      <div className="workspace-stack">
        {runs.map((run) => (
          <article className="workspace-record" key={asString(run.id)}>
            <div className="workspace-record__topline">
              <strong>{asString(run.name)}</strong>
              <Badge label={asString(run.status)} />
            </div>
            <span>{asString(run.detail)}</span>
          </article>
        ))}
      </div>
    </Panel>
  );
};
