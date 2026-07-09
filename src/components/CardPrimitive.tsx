import type { WorkspacePrimitiveComponent } from "./shared";
import { asRecord, asString, Panel } from "./shared";

export const CardPrimitive: WorkspacePrimitiveComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const body = asString(bind.body ?? bind.content ?? bind.summary);
  const value = asString(bind.value ?? bind.metric ?? bind.score);
  const detail = asString(bind.detail ?? bind.caption ?? bind.subtitle);

  return (
    <Panel title={node.title ?? asString(bind.title, "Card")} caption={asString(bind.caption) || "Card"} className="workspace-panel--dense workspace-card">
      <div className="workspace-stack">
        {detail ? <p className="workspace-muted">{detail}</p> : null}
        {value ? <strong className="workspace-card__value">{value}</strong> : null}
        {body ? <p>{body}</p> : null}
      </div>
    </Panel>
  );
};
