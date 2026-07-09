import type { WorkspacePrimitiveComponent } from "./shared";
import { asArray, asRecord, asString, Panel } from "./shared";

export const Sources: WorkspacePrimitiveComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const sources = asArray(bind.sources);

  return (
    <Panel title={node.title ?? "Sources"} caption="Evidence">
      <div className="workspace-stack">
        {sources.map((source) => (
          <article className="workspace-record" key={asString(source.id)}>
            <strong>{asString(source.title)}</strong>
            <span className="workspace-muted">{asString(source.updatedAt)}</span>
          </article>
        ))}
      </div>
    </Panel>
  );
};
