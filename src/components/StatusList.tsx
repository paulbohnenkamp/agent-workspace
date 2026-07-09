import type { WorkspacePrimitiveComponent } from './shared';
import { asArray, asRecord, asString, Panel } from './shared';

function statusTone(status: string): string {
  const normalized = status.toLowerCase();

  if (
    normalized.includes('complete') ||
    normalized.includes('success') ||
    normalized.includes('pass')
  ) {
    return 'complete';
  }

  if (normalized.includes('fail') || normalized.includes('error') || normalized.includes('issue')) {
    return 'issue';
  }

  if (
    normalized.includes('pending') ||
    normalized.includes('waiting') ||
    normalized.includes('running')
  ) {
    return 'pending';
  }

  return 'neutral';
}

function statusIcon(status: string): string {
  const tone = statusTone(status);

  if (tone === 'complete') {
    return '✓';
  }

  if (tone === 'issue') {
    return '!';
  }

  if (tone === 'pending') {
    return '•';
  }

  return '○';
}

export const StatusList: WorkspacePrimitiveComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const runs = asArray(bind.runs);

  return (
    <Panel title={node.title ?? 'Status'}>
      <div className="workspace-stack">
        {runs.map((run) => (
          <article className="workspace-record" key={asString(run.id)}>
            <div className="workspace-agent-row">
              <span
                className={`workspace-agent-row__icon workspace-agent-row__icon--${statusTone(asString(run.status))}`}
                aria-label={asString(run.status, 'Status unknown')}
                title={asString(run.status, 'Status unknown')}
              >
                {statusIcon(asString(run.status))}
              </span>
              <strong>{asString(run.name)}</strong>
            </div>
            <span>{asString(run.detail)}</span>
          </article>
        ))}
      </div>
    </Panel>
  );
};
