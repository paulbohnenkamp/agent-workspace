import type { WorkspacePrimitiveComponent } from "./shared";
import { asArray, asRecord, asString, Panel } from "./shared";

export const Timeline: WorkspacePrimitiveComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const thread = asRecord(bind.thread ?? bind.record ?? bind.entity);
  const messages = asArray(thread.messages);
  const items = messages.length > 0 ? messages : asArray(bind.projection);

  return (
    <Panel title={node.title ?? "Timeline"} caption={messages.length > 0 ? "Discussion" : "Activity"}>
      <div className="workspace-stack">
        {items.map((item, index) => {
          const label = asString(item.author ?? item.name ?? item.title);
          const detail = asString(item.text ?? item.detail ?? item.body);
          const timestamp = asString(item.timestamp ?? item.updatedAt);

          return (
            <article className="workspace-message" key={`${label}-${index}`}>
              <div className="workspace-message__topline">
                <strong>{label}</strong>
                {timestamp ? <span className="workspace-muted">{timestamp}</span> : null}
              </div>
              <p>{detail}</p>
            </article>
          );
        })}
      </div>
    </Panel>
  );
};
