import type { LooseRecord, WorkspaceStateRecord } from '../../packages/types/src/workspace';

export type LandDemoEvent = {
  id: string;
  type: string;
  targetId: string;
  actor: string;
  timestamp: string;
  detail: string;
};

export type LandActionResult = {
  event: LandDemoEvent;
  state: WorkspaceStateRecord;
};

const nowLabel = 'Today, 9:42 AM';

export const initialLandProjectState: WorkspaceStateRecord = {
  project: {
    id: 'land-project',
    name: 'Oil and Gas Land Management and Administration',
    title: 'Land Workspace',
  },
  item_queue: [
    {
      id: 'portfolio-001',
      name: 'Q3 Appalachian Land Portfolio',
      role: 'Portfolio Status · Cross-functional',
      status: 'In Review',
      badge: 'Management Review',
      updatedAgo: 'Today',
      owner: 'Land Operations',
      track: 'land-management',
      workType: 'portfolio',
      priority: 'High',
    },
    {
      id: 'acq-001',
      name: 'North Fork Acreage Block',
      role: 'Acquisition · Tyler County',
      status: 'In Review',
      badge: 'Acquisition Review',
      updatedAgo: '2h ago',
      owner: 'Land Acquisition',
      track: 'land-management',
      workType: 'acquisition',
      priority: 'High',
    },
    {
      id: 'title-001',
      name: 'Harrison Mineral Estate',
      role: 'Title and Curative · Harrison County',
      status: 'Needs Input',
      badge: 'Curative Needed',
      updatedAgo: '4h ago',
      owner: 'Title and Ownership',
      track: 'land-management',
      workType: 'title',
      priority: 'High',
    },
    {
      id: 'surface-001',
      name: 'Cedar Run Access Corridor',
      role: 'Surface Rights · Doddridge County',
      status: 'Pending Review',
      badge: 'ROW Coordination',
      updatedAgo: '1d ago',
      owner: 'Surface Rights',
      track: 'land-management',
      workType: 'rights',
      priority: 'Medium',
    },
    {
      id: 'lease-001',
      name: 'Pine Hollow Lease Set',
      role: 'Lease Administration · Wetzel County',
      status: 'Upcoming',
      badge: 'Expiration Review',
      updatedAgo: '1d ago',
      owner: 'Lease Administration',
      track: 'land-administration',
      workType: 'lease',
      priority: 'High',
    },
    {
      id: 'division-001',
      name: 'Riverbend Unit Division Order',
      role: 'Division Order · Unit R-17',
      status: 'Exception',
      badge: 'Decimal Review',
      updatedAgo: '3h ago',
      owner: 'Division Orders',
      track: 'land-administration',
      workType: 'division-order',
      priority: 'High',
    },
    {
      id: 'owner-001',
      name: 'Martha Ellis Ownership Change',
      role: 'Owner Relations · Heirship Documents',
      status: 'Needs Input',
      badge: 'Documents Missing',
      updatedAgo: '5h ago',
      owner: 'Owner Relations',
      track: 'land-administration',
      workType: 'owner-relations',
      priority: 'Medium',
    },
    {
      id: 'pooling-001',
      name: 'Willow Creek Unit Coordination',
      role: 'Pooling and Unitization · Unit W-04',
      status: 'Pending Review',
      badge: 'Handoff Needed',
      updatedAgo: '1d ago',
      owner: 'Land Operations',
      track: 'land-management',
      workType: 'pooling',
      priority: 'Medium',
    },
  ],
  artifact_versions: [
    {
      id: 'acq-001',
      artifactType: 'land-acquisition-assessment',
      title: 'North Fork Acquisition Assessment',
      status: 'In Review',
      generatedBy: 'Land Acquisition Coordinator',
      generatedAt: 'Today, 8:55 AM',
      sections: [
        { title: 'Business Purpose', body: 'Evaluate a contiguous acreage opportunity supporting a hypothetical development concept in the North Fork area.' },
        { title: 'Current Findings', bullets: ['Parcel and owner intake is substantially complete', 'Mineral and surface ownership must remain separately tracked', 'Negotiation approval is waiting on title and rights review'] },
        { title: 'Recommendation', body: 'Continue coordinated title, negotiation, and surface-rights review before an authorized business decision.' },
      ],
    },
    {
      id: 'title-001',
      artifactType: 'title-examination-report',
      title: 'Harrison Mineral Estate Title Examination',
      status: 'Needs Input',
      generatedBy: 'Title and Ownership Analyst',
      generatedAt: 'Today, 7:40 AM',
      sections: [
        { title: 'Ownership Summary', body: 'Supplied records indicate a severed mineral estate and a long conveyance history requiring source-linked review.' },
        { title: 'Open Findings', bullets: ['Heirship documentation is incomplete for one historical owner', 'A legal-description variation appears across supplied instruments', 'Professional review is required before relying on an ownership conclusion'] },
        { title: 'Next Step', body: 'Request the missing source records and route material questions to a qualified title professional.' },
      ],
    },
    {
      id: 'curative-001',
      matterId: 'title-001',
      artifactType: 'curative-action-plan',
      title: 'Harrison Curative Action Plan',
      status: 'Open',
      generatedBy: 'Title and Ownership Analyst',
      generatedAt: 'Today, 7:48 AM',
      sections: [{ title: 'Actions', bullets: ['Request death and heirship records', 'Compare legal descriptions to source instruments', 'Escalate unresolved ownership questions for professional review'] }],
    },
    {
      id: 'surface-001',
      artifactType: 'surface-use-coordination-plan',
      title: 'Cedar Run Surface Use Coordination',
      status: 'Pending Review',
      generatedBy: 'Surface Rights Coordinator',
      generatedAt: 'Yesterday, 3:15 PM',
      sections: [{ title: 'Coordination Summary', body: 'Track access, crossing, affected surface owners, engineering dependencies, and any stated agency coordination needs.' }],
    },
    {
      id: 'lease-001',
      artifactType: 'lease-administration-record',
      title: 'Pine Hollow Lease Administration Record',
      status: 'Upcoming',
      generatedBy: 'Lease Rights Administrator',
      generatedAt: 'Yesterday, 2:10 PM',
      sections: [{ title: 'Upcoming Dates', bullets: ['Primary term review due in 45 days', 'Continuation evidence is not yet linked', 'Assignment and recording metadata need reconciliation'] }, { title: 'Boundary', body: 'A stated lease date is tracked as supplied; this record does not decide whether rights continue or expire.' }],
    },
    {
      id: 'division-001',
      artifactType: 'division-order-analysis',
      title: 'Riverbend Unit Division Order Analysis',
      status: 'Exception',
      generatedBy: 'Division Order Analyst',
      generatedAt: 'Today, 8:20 AM',
      sections: [{ title: 'Interest Findings', bullets: ['One supplied decimal does not reconcile to the current interest worksheet', 'Two signature records are missing', 'Effective-date alignment requires title and accounting handoff'] }, { title: 'Next Step', body: 'Preserve the supplied sources and route the exception for qualified downstream review.' }],
    },
    {
      id: 'owner-001',
      artifactType: 'royalty-owner-case',
      title: 'Martha Ellis Ownership Change Case',
      status: 'Needs Input',
      generatedBy: 'Royalty Owner Relations Analyst',
      generatedAt: 'Today, 8:35 AM',
      sections: [{ title: 'Case Summary', body: 'Owner inquiry includes a reported ownership change and supplied partial heirship documentation.' }, { title: 'Missing Information', bullets: ['Additional source document requested', 'Identity and effective-date questions remain open', 'Do not infer heirship or payment entitlement from the current record'] }],
    },
    {
      id: 'pooling-001',
      artifactType: 'pooling-unitization-record',
      title: 'Willow Creek Unit Coordination Record',
      status: 'Pending Review',
      generatedBy: 'Land Operations Coordinator',
      generatedAt: 'Yesterday, 11:05 AM',
      sections: [{ title: 'Coordination Summary', body: 'Track affected tracts, owners, supplied consents or notices, instruments, recording status, and open questions.' }, { title: 'Boundary', body: 'Applicable requirements must be verified from current authoritative sources and qualified professionals.' }],
    },
    {
      id: 'portfolio-001',
      artifactType: 'land-portfolio-status-report',
      title: 'Q3 Appalachian Land Portfolio Status',
      status: 'In Review',
      generatedBy: 'Land Operations Coordinator',
      generatedAt: 'Today, 9:10 AM',
      sections: [{ title: 'Portfolio Summary', body: 'The portfolio combines acquisition, title, lease, surface, pooling, owner-relations, and records readiness for management review.' }, { title: 'Decisions Needed', bullets: ['Authorize next acquisition review step', 'Confirm title and curative escalation owners', 'Review lease deadlines and downstream handoffs'] }],
    },
  ],
  thread_index: [
    { id: 'thread-acq', threadFor: 'land-matter:acq-001', messages: [{ author: 'Land Acquisition Coordinator', authorTitle: 'Land Management', timestamp: '9:05 AM', text: 'The intake is complete enough for coordinated title and surface review.' }, { author: 'AI Assistant', authorTitle: 'Land Workspace Assistant', timestamp: '9:06 AM', text: 'I found one ownership dependency and one approval dependency. I recommend requesting the title source set before negotiation approval.' }] },
    { id: 'thread-title', threadFor: 'land-matter:title-001', messages: [{ author: 'Title and Ownership Analyst', authorTitle: 'Title and Curative', timestamp: '8:02 AM', text: 'The current record supports follow-up questions, not a final ownership conclusion.' }, { author: 'AI Assistant', authorTitle: 'Land Workspace Assistant', timestamp: '8:03 AM', text: 'The next safe step is to request missing heirship records and route the legal-description conflict for professional review.' }] },
    { id: 'thread-lease', threadFor: 'land-matter:lease-001', messages: [{ author: 'Lease Rights Administrator', authorTitle: 'Land Administration', timestamp: '8:25 AM', text: 'The upcoming date is recorded from the supplied instrument and needs continuation evidence.' }, { author: 'AI Assistant', authorTitle: 'Land Workspace Assistant', timestamp: '8:26 AM', text: 'I will keep the deadline visible without inferring whether the lease continues or expires.' }] },
    { id: 'thread-division', threadFor: 'land-matter:division-001', messages: [{ author: 'Division Order Analyst', authorTitle: 'Land Administration', timestamp: '8:30 AM', text: 'The decimal exception and missing signatures are ready for title and accounting handoff.' }, { author: 'AI Assistant', authorTitle: 'Land Workspace Assistant', timestamp: '8:31 AM', text: 'The record should remain in exception status until the supplied sources are reconciled by authorized reviewers.' }] },
    { id: 'thread-owner', threadFor: 'land-matter:owner-001', messages: [{ author: 'Royalty Owner Relations Analyst', authorTitle: 'Owner Relations', timestamp: '8:40 AM', text: 'The owner provided partial documentation and is waiting for a response about the next record needed.' }, { author: 'AI Assistant', authorTitle: 'Land Workspace Assistant', timestamp: '8:41 AM', text: 'I can track the missing document and communication handoff without deciding heirship or payment entitlement.' }] },
    { id: 'thread-portfolio', threadFor: 'land-matter:portfolio-001', messages: [{ author: 'Land Operations Coordinator', authorTitle: 'Portfolio and Handoffs', timestamp: '9:15 AM', text: 'The portfolio is ready for a cross-functional review of deadlines, blockers, and downstream owners.' }, { author: 'AI Assistant', authorTitle: 'Land Workspace Assistant', timestamp: '9:16 AM', text: 'Three handoffs need attention before the next management checkpoint.' }] },
  ],
  agent_activity: [
    { id: 'agent-acquisition', name: 'Land Acquisition Coordinator', status: 'Complete', detail: 'Prepared acquisition assessment', relatedTo: 'land-matter:acq-001' },
    { id: 'agent-title', name: 'Title and Ownership Analyst', status: 'Pending', detail: 'Waiting for source records', relatedTo: 'land-matter:title-001' },
    { id: 'agent-surface', name: 'Surface Rights Coordinator', status: 'Running', detail: 'Tracking corridor dependencies', relatedTo: 'land-matter:surface-001' },
    { id: 'agent-lease', name: 'Lease Rights Administrator', status: 'Pending', detail: 'Reviewing upcoming dates', relatedTo: 'land-matter:lease-001' },
    { id: 'agent-division', name: 'Division Order Analyst', status: 'Pending', detail: 'Flagged decimal exception', relatedTo: 'land-matter:division-001' },
    { id: 'agent-owner', name: 'Royalty Owner Relations Analyst', status: 'Pending', detail: 'Waiting for owner document', relatedTo: 'land-matter:owner-001' },
    { id: 'agent-operations', name: 'Land Operations Coordinator', status: 'Running', detail: 'Preparing portfolio handoff', relatedTo: 'land-matter:portfolio-001' },
    { id: 'agent-records', name: 'Land Records and Compliance Coordinator', status: 'Complete', detail: 'Reconciled administrative record set', relatedTo: 'land-matter:portfolio-001' },
  ],
  knowledge_links: [
    { id: 'source-wv-context', title: 'WV Appalachian Land Context', updatedAt: 'Educational context · Jun 2026', href: '/land/resources/wv-appalachian-land-context' },
    { id: 'source-title', title: 'Title and Curative Guidance', updatedAt: 'Project resource · Jun 2026', href: '/land/resources/title-curative-guidance' },
    { id: 'source-handoffs', title: 'Land Handoff Guidance', updatedAt: 'Project resource · Jun 2026', href: '/land/resources/land-handoffs' },
    { id: 'source-boundaries', title: 'Legal Review Boundaries', updatedAt: 'Project resource · Jun 2026', href: '/land/resources/legal-review-boundaries' },
  ],
  portfolio_status: [
    { id: 'rights-readiness', name: 'Rights readiness', status: 'Pending Review', detail: 'Title and surface dependencies remain open' },
    { id: 'lease-readiness', name: 'Lease administration', status: 'Pending', detail: 'Two upcoming dates need evidence' },
    { id: 'owner-handoffs', name: 'Owner and downstream handoffs', status: 'Needs Input', detail: 'Division-order and owner cases require records' },
    { id: 'records-readiness', name: 'Records completeness', status: 'Complete', detail: 'Current audit set reconciled' },
  ],
  handoff_queue: [
    { id: 'handoff-title', name: 'Title review to legal', status: 'handoff-needed', detail: 'Harrison Mineral Estate' },
    { id: 'handoff-division', name: 'Division order to accounting', status: 'handoff-needed', detail: 'Riverbend Unit' },
    { id: 'handoff-lease', name: 'Lease record to operations', status: 'handoff-needed', detail: 'Pine Hollow Lease Set' },
  ],
};

function cloneState(state: WorkspaceStateRecord): WorkspaceStateRecord {
  return JSON.parse(JSON.stringify(state)) as WorkspaceStateRecord;
}

export function applyLandAction(
  sourceState: WorkspaceStateRecord,
  actionId: string,
  targetId: string,
  eventId: string,
  timestamp = nowLabel,
  actor = 'Demo Workspace User',
): LandActionResult {
  const state = cloneState(sourceState);
  const target = (state.item_queue ?? []).find((item) => item.id === targetId);
  const targetName = typeof target?.name === 'string' ? target.name : targetId;
  const event: LandDemoEvent = {
    id: eventId,
    type: `land.${actionId}`,
    targetId,
    actor,
    timestamp,
    detail: `${actionId.split('-').join(' ')} for ${targetName}`,
  };

  if (target) {
    if (actionId === 'assign-matter') {
      target.status = 'Assigned';
      target.badge = 'Assigned';
      target.owner = 'Land Operations';
    } else if (actionId === 'mark-handoff-ready') {
      target.status = 'Handoff Ready';
      target.badge = 'Handoff Ready';
    } else if (actionId === 'request-missing-record') {
      target.status = 'Needs Input';
      target.badge = 'Record Requested';
    } else if (actionId === 'escalate-review') {
      target.status = 'Professional Review';
      target.badge = 'Escalated';
    } else if (actionId === 'acknowledge-owner-response') {
      target.status = 'Response Logged';
      target.badge = 'Owner Response Logged';
    } else if (actionId === 'record-administrative-follow-up') {
      target.status = 'Follow-up Scheduled';
      target.badge = 'Follow-up Scheduled';
    }
    target.updatedAgo = 'just now';
  }

  const activity = state.agent_activity ?? [];
  activity.unshift({
    id: event.id,
    name: event.actor,
    status: 'Complete',
    detail: event.detail,
    relatedTo: `land-matter:${targetId}`,
  });
  state.agent_activity = activity.slice(0, 24);

  return { event, state };
}

export class LandDemoStore {
  private state = cloneState(initialLandProjectState);
  private events: LandDemoEvent[] = [];

  getState(): WorkspaceStateRecord {
    return cloneState(this.state);
  }

  getEvents(): LandDemoEvent[] {
    return [...this.events];
  }

  reset(): void {
    this.state = cloneState(initialLandProjectState);
    this.events = [];
  }

  applyAction(actionId: string, targetId: string, actor = 'Demo Workspace User'): LandDemoEvent {
    const result = applyLandAction(this.state, actionId, targetId, `land-event-${this.events.length + 1}`, nowLabel, actor);
    this.state = result.state;
    const event = result.event;
    this.events.push(event);
    return event;
  }
}

export function asActionBody(body: string): LooseRecord {
  const params = new URLSearchParams(body);
  return Object.fromEntries(params.entries());
}
