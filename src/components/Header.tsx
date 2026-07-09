import type { WorkspacePrimitiveComponent } from './shared';
import { asRecord, asString, Badge, pickRecord } from './shared';

export const Header: WorkspacePrimitiveComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const record = pickRecord(bind, [
    'record',
    'entity',
    'candidate',
    'artifact',
    'item',
    'assistant',
    'source',
  ]);
  const badge = asString(record.badge ?? record.status ?? record.state);

  return (
    <section className="workspace-document workspace-document--hero">
      <div className="workspace-document__hero">
        <div>
          <h1 className="workspace-document__title">
            {asString(record.name ?? record.title ?? node.title, 'Header')}
          </h1>
          <p className="workspace-document__subtitle">
            {asString(record.role ?? record.type ?? record.subtitle)}
          </p>
        </div>
        <div className="workspace-document__hero-meta">
          {badge ? <Badge label={badge} /> : null}
        </div>
      </div>
    </section>
  );
};
