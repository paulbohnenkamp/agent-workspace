import type { WorkspacePrimitiveComponent } from './shared';
import { asArray, asRecord, asString, Panel } from './shared';

export const Timeline: WorkspacePrimitiveComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const thread = asRecord(bind.thread ?? bind.record ?? bind.entity);
  const messages = asArray(thread.messages);
  const items = messages.length > 0 ? messages : asArray(bind.projection);

  return (
    <Panel title={node.title ?? (messages.length > 0 ? 'Discussion' : 'Activity')}>
      <div className="workspace-stack">
        {items.map((item, index) => {
          const label = asString(item.author ?? item.name ?? item.title);
          const role = asString(item.authorTitle ?? item.role ?? item.subtitle);
          const detail = asString(item.text ?? item.detail ?? item.body);
          const timestamp = asString(item.timestamp ?? item.updatedAt);
          const isAssistant = label.toLowerCase().includes('assistant');

          return (
            <article
              className={`workspace-message ${isAssistant ? 'workspace-message--assistant' : 'workspace-message--human'}`}
              key={`${label}-${index}`}
            >
              <div className="workspace-message__topline">
                <div className="workspace-message__author">
                  <strong>{label}</strong>
                  {role ? <span className="workspace-message__role">{role}</span> : null}
                </div>
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
