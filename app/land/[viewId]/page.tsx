import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  AlertCircle,
  ArrowUpRight,
  Bell,
  BookOpen,
  Check,
  ChevronLeft,
  CircleHelp,
  ClipboardCheck,
  FileSearch,
  FolderKanban,
  LandPlot,
  LayoutDashboard,
  MessageCircle,
  Users,
} from 'lucide-react';

import { landDefaultMatterIds, landViewIds } from '../../../src/land-workspace';
import { AuthorizationError, requireLandAccess } from '../../../lib/authorization';
import { loadLandWorkspace, records, text } from '../../../lib/land-workspace';
import { AssistantComposer } from './AssistantComposer';

const railIcons = [LandPlot, FileSearch, ClipboardCheck, Users, LayoutDashboard];
const viewForMatter: Record<string, string> = {
  'acq-001': 'acquisition-rights-queue',
  'title-001': 'title-curative-review',
  'surface-001': 'acquisition-rights-queue',
  'lease-001': 'lease-administration-queue',
  'division-001': 'division-order-owner-relations-queue',
  'owner-001': 'division-order-owner-relations-queue',
  'pooling-001': 'land-portfolio',
  'portfolio-001': 'land-portfolio',
};

function statusClass(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized.includes('complete') || normalized.includes('ready')) return 'status status-positive';
  if (normalized.includes('exception') || normalized.includes('needs')) return 'status status-warning';
  return 'status status-neutral';
}

export default async function LandWorkspacePage({
  params,
  searchParams,
}: {
  params: Promise<{ viewId: string }>;
  searchParams: Promise<{ matterId?: string }>;
}) {
  const [{ viewId }, query] = await Promise.all([params, searchParams]);
  try {
    await requireLandAccess(query.matterId);
  } catch (error) {
    if (error instanceof AuthorizationError && error.status === 401) redirect('/');
    throw error;
  }
  const interpreted = await loadLandWorkspace(viewId, query.matterId);
  const state = interpreted.state;
  const selectedMatter = (interpreted.fields.selectedMatter ?? {}) as Record<string, unknown>;
  const selectedArtifact = (interpreted.fields.selectedArtifact ?? {}) as Record<string, unknown>;
  const selectedThread = (interpreted.fields.selectedThread ?? {}) as Record<string, unknown>;
  const queue = records(state.item_queue);
  const agents = records(interpreted.fields.selectedAgents);
  const sources = records(interpreted.fields.sources);
  const messages = records(selectedThread.messages);
  const activity = records(state.agent_activity).slice(0, 6);
  const portfolioStatus = records(interpreted.fields.portfolioStatus);
  const activeViewId = (landViewIds as readonly string[]).includes(viewId) ? viewId : 'land-portfolio';

  return (
    <main className="workspace-app">
      <div className="workspace-frame">
        <aside className="workspace-rail" aria-label="Workspace navigation">
          <div className="workspace-logo">L</div>
          <nav className="rail-nav">
            {landViewIds.map((itemId, index) => {
              const Icon = railIcons[index];
              const href = `/land/${itemId}?matterId=${landDefaultMatterIds[itemId]}`;
              return (
                <Link className={`rail-item ${itemId === activeViewId ? 'rail-item-active' : ''}`} href={href} key={itemId} aria-label={itemId} title={itemId}>
                  <Icon size={18} strokeWidth={1.8} />
                </Link>
              );
            })}
          </nav>
          <div className="rail-footer"><ChevronLeft size={18} /></div>
        </aside>

        <div className="workspace-content">
          <header className="topbar">
            <div className="topbar-brand">Land Workspace</div>
            <nav className="topbar-tabs" aria-label="Workspace sections">
              {['Workspace', 'Portfolio', 'Deadlines', 'Handoffs'].map((tab, index) => (
                <Link className={`topbar-tab ${index === 0 ? 'topbar-tab-active' : ''}`} href={index === 0 ? `/land/${activeViewId}?matterId=${query.matterId ?? 'portfolio-001'}` : '#'} key={tab}>{tab}</Link>
              ))}
            </nav>
            <div className="topbar-search"><span>⌕</span> Search parcels, leases, owners, and more...</div>
            <div className="topbar-actions"><span className="icon-button notification"><Bell size={16} /></span><span className="icon-button"><CircleHelp size={16} /></span><span className="avatar">P</span></div>
          </header>

          <div className="workspace-body">
            <section className="workspace-column queue-column" aria-label="Work queue">
              <div className="column-heading"><h2>{text(interpreted.view.title, 'Land Portfolio')}</h2><span className="count">{queue.length}</span></div>
              <div className="queue-controls"><button>All Work</button><button>Sort: Priority</button></div>
              <div className="queue-list">
                {queue.map((item) => (
                  <Link className={`queue-card ${text(item.id) === text(selectedMatter.id) ? 'queue-card-selected' : ''}`} href={`/land/${viewForMatter[text(item.id)] ?? 'land-portfolio'}?matterId=${text(item.id)}`} key={text(item.id)}>
                    <div className="queue-card-top"><span className="matter-avatar">{text(item.name).split(' ').map((word) => word[0]).join('').slice(0, 2)}</span><div><strong>{text(item.name)}</strong><span className="queue-role">{text(item.role)}</span></div></div>
                    <div className="queue-meta"><span className={statusClass(text(item.status))}>{text(item.badge, text(item.status))}</span><span>{text(item.updatedAgo)}</span></div>
                    <small>{text(item.owner)}</small>
                  </Link>
                ))}
              </div>
            </section>

            <section className="workspace-column assistant-column" aria-label="AI Assistant">
              <div className="column-heading"><h2>AI Assistant</h2><span className="beta">Beta</span></div>
              <div className="assistant-summary"><div className="assistant-label"><MessageCircle size={15} /> Grounded workspace assistant</div><p>The portfolio combines acquisition, title, lease, surface, pooling, owner-relations, and records readiness for management review.</p><div className="assistant-actions"><button>Review findings</button><button>Request changes</button></div></div>
              <h3 className="section-label">Portfolio Readiness</h3>
              <div className="readiness-list">
                {portfolioStatus.map((item) => <div className="readiness-card" key={text(item.id)}><span className="readiness-dot"><Check size={12} /></span><div><strong>{text(item.name)}</strong><p>{text(item.detail)}</p></div></div>)}
              </div>
              <AssistantComposer viewId={activeViewId} matterId={text(selectedMatter.id, query.matterId ?? 'portfolio-001')} />
            </section>

            <section className="workspace-column main-column" aria-label="Primary artifact">
              <div className="main-heading"><div><h1>{text(selectedArtifact.title, text(selectedMatter.name))}</h1><p>{text(selectedMatter.role, 'Portfolio Status · Cross-functional')}</p></div><span className={statusClass(text(selectedArtifact.status))}>{text(selectedArtifact.status, 'In Review')}</span></div>
              <div className="artifact-tabs"><span className="artifact-tab-active">Portfolio Status</span><span>Rights Readiness</span><span>Deadlines</span><span>Handoffs</span></div>
              <div className="artifact-header"><div><h2>{text(selectedArtifact.title)}</h2><p>Generated by {text(selectedArtifact.generatedBy, 'Land Operations Coordinator')} · {text(selectedArtifact.generatedAt, 'Today')}</p></div><span className="artifact-score">{text(selectedArtifact.sections ? records(selectedArtifact.sections).length : 0, '0')}</span></div>
              <div className="artifact-section"><h3>Portfolio Summary</h3><p>{text(records(selectedArtifact.sections)[0]?.body, 'The selected work surface is assembled from the project view metadata and current projected state.')}</p></div>
              {records(selectedArtifact.sections).slice(1).map((section) => <div className="artifact-section" key={text(section.title)}><h3>{text(section.title)}</h3>{text(section.body) ? <p>{text(section.body)}</p> : <ul>{records(section).length === 0 ? null : (Array.isArray(section.bullets) ? section.bullets : []).map((bullet) => <li key={text(bullet)}>{text(bullet)}</li>)}</ul>}</div>)}
              <div className="activity-section"><div className="section-heading"><h3>Recent Land Activity</h3><span>Live projection</span></div>{activity.map((entry) => <div className="activity-row" key={text(entry.id)}><span className="activity-check"><Check size={14} /></span><div><strong>{text(entry.name)}</strong><p>{text(entry.detail)}</p></div><ArrowUpRight size={15} /></div>)}</div>
            </section>

            <aside className="workspace-column context-column" aria-label="Workspace context">
              <ContextPanel title="Knowledge Sources" icon={<BookOpen size={16} />}>{sources.map((source) => <a className="source-row" href={text(source.href, '#')} key={text(source.id)}><strong>{text(source.title)}</strong><span>{text(source.updatedAt)}</span></a>)}</ContextPanel>
              <ContextPanel title="Agents" icon={<Users size={16} />}>{agents.map((agent) => <div className="agent-row" key={text(agent.id)}><span className="agent-status"><Check size={11} /></span><div><strong>{text(agent.name)}</strong><span>{text(agent.detail)}</span></div></div>)}</ContextPanel>
              <ContextPanel title="Actions" icon={<FolderKanban size={16} />}><form action="/api/land/actions" method="post"><input type="hidden" name="targetId" value={text(selectedMatter.id, query.matterId ?? 'portfolio-001')} /><input type="hidden" name="viewId" value={activeViewId} /><button className="action-primary" name="actionId" value="mark-handoff-ready">Mark Handoff Ready</button><button className="action-secondary" name="actionId" value="assign-matter">Assign Matter</button><button className="action-secondary" name="actionId" value="record-administrative-follow-up">Create Follow-up Task</button></form></ContextPanel>
              <ContextPanel title="Conversation" icon={<MessageCircle size={16} />}><div className="mini-thread">{messages.slice(-2).map((message) => <p key={`${text(message.author)}-${text(message.timestamp)}`}><strong>{text(message.author)}</strong>{text(message.text)}</p>)}</div></ContextPanel>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}

function ContextPanel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <section className="context-panel"><div className="context-heading">{icon}<h2>{title}</h2></div><div>{children}</div></section>;
}
