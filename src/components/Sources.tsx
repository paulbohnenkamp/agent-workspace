import type { WorkspacePrimitiveComponent } from './shared';
import { asArray, asRecord, asString, Panel } from './shared';

function sourceHref(source: Record<string, unknown>): string {
  return asString(source.href ?? source.url, '#');
}

export const Sources: WorkspacePrimitiveComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const sources = asArray(bind.sources);

  return (
    <Panel title={node.title ?? 'Sources'}>
      <div className="workspace-stack">
        {sources.map((source) => (
          <article className="workspace-record" key={asString(source.id)}>
            <a className="workspace-source-link" href={sourceHref(source)}>
              {asString(source.title)}
            </a>
            <span className="workspace-muted">{asString(source.updatedAt)}</span>
          </article>
        ))}
      </div>
    </Panel>
  );
};
