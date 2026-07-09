import type { WorkspacePrimitiveComponent } from './shared';
import { asArray, asNumber, asRecord, asString, Badge, Panel } from './shared';

function initialsFor(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('');
}

function scoreTone(score: number): string {
  if (score >= 78) {
    return 'positive';
  }

  if (score >= 68) {
    return 'warning';
  }

  return 'critical';
}

export const Queue: WorkspacePrimitiveComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const items = asArray(bind.projection);
  const selectedId = asString(bind.selectedId);
  const total = asNumber(bind.total, items.length);

  return (
    <Panel
      title={node.title ?? 'Queue'}
      meta={<span className="workspace-count-badge">{total}</span>}
      className="workspace-panel--queue"
    >
      <div className="workspace-queue-controls">
        <button type="button" className="workspace-control-button">
          All Roles
        </button>
        <button type="button" className="workspace-control-button">
          Sort: Priority
        </button>
      </div>
      <div className="workspace-list">
        {items.map((item) => {
          const id = asString(item.id);
          const name = asString(item.name ?? item.candidateName, 'Candidate');
          const badge = asString(item.badge ?? item.status);
          const score = asNumber(item.score);

          return (
            <article
              className={`workspace-list-item ${id === selectedId ? 'is-selected' : ''}`.trim()}
              key={id}
            >
              <div className="workspace-list-item__avatar" aria-hidden="true">
                {initialsFor(name)}
              </div>
              <div className="workspace-list-item__content">
                <div className="workspace-list-item__topline">
                  <strong>{name}</strong>
                </div>
                {item.role ? (
                  <p className="workspace-list-item__secondary">{asString(item.role)}</p>
                ) : null}
                <div className="workspace-list-item__meta">
                  {badge ? <Badge label={badge} /> : null}
                  {item.updatedAgo ? <span>{asString(item.updatedAgo)}</span> : null}
                  {item.owner ? <span>{asString(item.owner)}</span> : null}
                </div>
              </div>
              {score ? (
                <div className={`workspace-score-ring workspace-score-ring--${scoreTone(score)}`}>
                  {score}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
      <div className="workspace-list-footer">
        <span>
          Showing 1-{items.length} of {total}
        </span>
        <span className="workspace-pagination" aria-hidden="true">
          ‹ ›
        </span>
      </div>
    </Panel>
  );
};
