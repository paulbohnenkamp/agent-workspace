import React from "react";

import type {
  LooseRecord,
  WorkspaceComponent,
  WorkspaceComponentProps,
} from "../packages/types/src/workspace";

function asArray(value: unknown): LooseRecord[] {
  return Array.isArray(value) ? (value as LooseRecord[]) : [];
}

function asRecord(value: unknown): LooseRecord {
  return value && typeof value === "object" ? (value as LooseRecord) : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" ? value : fallback;
}

function titleCase(value: string): string {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function toneForStatus(status: string): string {
  const normalized = status.toLowerCase();

  if (normalized.includes("strong") || normalized.includes("advance") || normalized.includes("approved") || normalized.includes("online")) {
    return "positive";
  }

  if (normalized.includes("pending") || normalized.includes("review")) {
    return "notice";
  }

  if (normalized.includes("feedback") || normalized.includes("concern")) {
    return "warning";
  }

  return "neutral";
}

function StatusBadge({ label }: { label: string }) {
  return <span className={`status-badge status-badge--${toneForStatus(label)}`}>{label}</span>;
}

function Module({
  title,
  caption,
  meta,
  children,
  className = "",
}: {
  title?: string;
  caption?: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`workspace-module ${className}`.trim()}>
      {(title || caption || meta) && (
        <header className="workspace-module__header">
          <div>
            {caption ? <p className="workspace-module__caption">{caption}</p> : null}
            {title ? <h2 className="workspace-module__title">{title}</h2> : null}
          </div>
          {meta}
        </header>
      )}
      <div className="workspace-module__body">{children}</div>
    </section>
  );
}

const QueueList: WorkspaceComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const items = asArray(bind.projection);
  const selectedId = asString(bind.selectedId);

  return (
    <Module title={node.title ?? "Queue"} caption="Queue">
      <div className="workspace-list">
        {items.map((item) => {
          const id = asString(item.id);
          const badge = asString(item.badge || item.status);

          return (
            <article className={`workspace-list-item ${id === selectedId ? "is-selected" : ""}`.trim()} key={id}>
              <div className="workspace-list-item__topline">
                <strong>{asString(item.name || item.candidateName)}</strong>
                {badge ? <StatusBadge label={badge} /> : null}
              </div>
              {item.role ? <p className="workspace-list-item__secondary">{asString(item.role)}</p> : null}
              <div className="workspace-list-item__meta">
                {typeof item.score === "number" ? <span>Score {asNumber(item.score)}</span> : null}
                {item.updatedAgo ? <span>{asString(item.updatedAgo)}</span> : null}
                {item.owner ? <span>{asString(item.owner)}</span> : null}
              </div>
            </article>
          );
        })}
      </div>
    </Module>
  );
};

const AssistantSummaryCard: WorkspaceComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const candidate = asRecord(bind.candidate);
  const artifact = asRecord(bind.artifact);
  const sections = asArray(artifact.sections);
  const firstSection = asRecord(sections[0]);

  return (
    <Module
      title={node.title ?? "AI Assistant"}
      caption="Assistant"
      meta={<StatusBadge label="Live" />}
    >
      <div className="workspace-stack">
        <div>
          <strong>{asString(candidate.name)}</strong>
          <p className="workspace-muted">{asString(candidate.role)}</p>
        </div>
        <p>{asString(firstSection.body, "No summary available.")}</p>
        <div className="workspace-button-stack">
          <button type="button" className="workspace-button workspace-button--secondary">Summarize concerns</button>
          <button type="button" className="workspace-button workspace-button--secondary">Draft next steps</button>
        </div>
      </div>
    </Module>
  );
};

const ThreadTimeline: WorkspaceComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const thread = asRecord(bind.thread);
  const messages = asArray(thread.messages);

  return (
    <Module title={node.title ?? "Discussion"} caption="Discussion">
      <div className="workspace-stack">
        {messages.map((message, index) => (
          <article className="workspace-message" key={`${asString(message.author)}-${index}`}>
            <div className="workspace-message__topline">
              <strong>{asString(message.author)}</strong>
              <span className="workspace-muted">{asString(message.timestamp)}</span>
            </div>
            <p>{asString(message.text)}</p>
          </article>
        ))}
      </div>
    </Module>
  );
};

const Composer: WorkspaceComponent = () => (
  <Module title="Ask / Reply" caption="Composer">
    <form className="workspace-composer">
      <textarea rows={5} placeholder="Ask anything about this candidate..." />
      <div className="workspace-composer__actions">
        <span className="workspace-muted">Responses are added to the workspace thread.</span>
        <button type="button" className="workspace-button workspace-button--primary">Send</button>
      </div>
    </form>
  </Module>
);

const CandidateHeader: WorkspaceComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const candidate = asRecord(bind.candidate);
  const badge = asString(candidate.badge || candidate.status);

  return (
    <section className="workspace-document workspace-document--hero">
      <div className="workspace-document__hero">
        <div>
          <p className="workspace-document__eyebrow">Candidate review</p>
          <h1 className="workspace-document__title">{asString(candidate.name, "Candidate")}</h1>
          <p className="workspace-document__subtitle">{asString(candidate.role)}</p>
        </div>
        <div className="workspace-document__hero-meta">
          {badge ? <StatusBadge label={badge} /> : null}
          <div className="workspace-score-card">
            <span className="workspace-muted">Score</span>
            <strong>{asNumber(candidate.score)}</strong>
          </div>
        </div>
      </div>
      <p className="workspace-document__summary">
        Review the current evaluation record, discussion trail, source material, and agent support before advancing or requesting revisions.
      </p>
    </section>
  );
};

const ArtifactTabs: WorkspaceComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const artifact = asRecord(bind.artifact);
  const sections = asArray(artifact.sections);
  const tabs = Array.isArray(node.tabs) ? node.tabs : [];
  const verdict = asString(artifact.verdict);

  return (
    <section className="workspace-document">
      <header className="workspace-document__header">
        <div>
          <p className="workspace-document__eyebrow">Artifact</p>
          <h2 className="workspace-document__section-title">{asString(artifact.title, "Artifact")}</h2>
          <p className="workspace-muted">
            Generated by {asString(artifact.generatedBy)} · {asString(artifact.generatedAt)}
          </p>
        </div>
        <div className="workspace-document__header-meta">
          <strong className="workspace-score">{asNumber(artifact.score)}</strong>
          {verdict ? <StatusBadge label={verdict} /> : null}
        </div>
      </header>
      {tabs.length > 0 ? (
        <div className="workspace-tabs">
          {tabs.map((tab, index) => (
            <span className={`workspace-tab ${index === 0 ? "is-active" : ""}`.trim()} key={tab}>
              {tab.split("-").join(" ")}
            </span>
          ))}
        </div>
      ) : null}
      <div className="workspace-document__sections">
        {sections.map((section, index) => {
          const entry = asRecord(section);
          const bullets = asArray(entry.bullets);

          return (
            <article className="workspace-document__section" key={`${asString(entry.title)}-${index}`}>
              <h3>{asString(entry.title)}</h3>
              {entry.body ? <p>{asString(entry.body)}</p> : null}
              {bullets.length > 0 ? (
                <ul>
                  {bullets.map((bullet, bulletIndex) => (
                    <li key={`${bulletIndex}-${String(bullet)}`}>{String(bullet)}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
};

const KnowledgeSources: WorkspaceComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const sources = asArray(bind.sources);

  return (
    <Module title={node.title ?? "Knowledge Sources"} caption="Evidence">
      <div className="workspace-stack">
        {sources.map((source) => (
          <article className="workspace-record" key={asString(source.id)}>
            <strong>{asString(source.title)}</strong>
            <span className="workspace-muted">{asString(source.updatedAt)}</span>
          </article>
        ))}
      </div>
    </Module>
  );
};

const AgentStatusList: WorkspaceComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const runs = asArray(bind.runs);

  return (
    <Module title={node.title ?? "Agents"} caption="Runtime">
      <div className="workspace-stack">
        {runs.map((run) => (
          <article className="workspace-record" key={asString(run.id)}>
            <div className="workspace-record__topline">
              <strong>{asString(run.name)}</strong>
              <StatusBadge label={asString(run.status)} />
            </div>
            <span>{asString(run.detail)}</span>
          </article>
        ))}
      </div>
    </Module>
  );
};

const ActionStack: WorkspaceComponent = ({ node }) => {
  const actions = Array.isArray(node.actions) ? node.actions : [];

  return (
    <Module title={node.title ?? "Actions"} caption="Actions">
      <div className="workspace-button-stack">
        {actions.map((action, index) => (
          <button
            className={`workspace-button ${index === 0 ? "workspace-button--primary" : "workspace-button--secondary"}`.trim()}
            key={action}
            type="button"
          >
            {titleCase(action)}
          </button>
        ))}
      </div>
    </Module>
  );
};

const ApprovalQueue: WorkspaceComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const items = asArray(bind.projection);

  return (
    <Module title={node.title ?? "Approval Queue"} caption="Approvals">
      <div className="workspace-stack">
        {items.map((item) => (
          <article className="workspace-record" key={asString(item.id)}>
            <div className="workspace-record__topline">
              <strong>{asString(item.candidateName)}</strong>
              <StatusBadge label={asString(item.status)} />
            </div>
            <span>{asString(item.owner)}</span>
          </article>
        ))}
      </div>
    </Module>
  );
};

const EventTimeline: WorkspaceComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const items = asArray(bind.projection);

  return (
    <Module title={node.title ?? "Events"} caption="Activity">
      <div className="workspace-stack">
        {items.map((item) => (
          <article className="workspace-record" key={asString(item.id)}>
            <strong>{asString(item.name)}</strong>
            <span>{asString(item.detail)}</span>
          </article>
        ))}
      </div>
    </Module>
  );
};

const ArtifactSummary: WorkspaceComponent = ({ node, interpreted }) => {
  const bind = asRecord(node.bind);
  const selection = asString(bind.selection);
  const artifact = asArray(interpreted.state.artifact_versions).find((entry) => asString(entry.id) === selection);
  const firstSection = artifact ? asRecord(asArray(artifact.sections)[0]) : {};

  return (
    <Module title={node.title ?? "Artifact"} caption="Artifact">
      <div className="workspace-stack">
        <strong>{artifact ? asString(artifact.title) : "No artifact selected"}</strong>
        {artifact ? <p>{asString(firstSection.body)}</p> : <p className="workspace-muted">No artifact selected.</p>}
      </div>
    </Module>
  );
};

export class ComponentRegistry {
  private readonly components = new Map<string, WorkspaceComponent>();

  register(componentId: string, component: WorkspaceComponent): void {
    this.components.set(componentId, component);
  }

  resolve(componentId: string): WorkspaceComponent {
    const component = this.components.get(componentId);

    if (!component) {
      throw new Error(`Unknown component: ${componentId}`);
    }

    return component;
  }

  renderNode(props: WorkspaceComponentProps): React.ReactElement {
    const Component = this.resolve(props.node.component);
    return <Component {...props} />;
  }
}

export function createDefaultComponentRegistry(): ComponentRegistry {
  const registry = new ComponentRegistry();

  registry.register("queue.list", QueueList);
  registry.register("candidate.queue", QueueList);
  registry.register("assistant.summary-card", AssistantSummaryCard);
  registry.register("thread.timeline", ThreadTimeline);
  registry.register("composer.inline", Composer);
  registry.register("composer.chat-input", Composer);
  registry.register("candidate.header", CandidateHeader);
  registry.register("artifact.tabs", ArtifactTabs);
  registry.register("knowledge.sources", KnowledgeSources);
  registry.register("agent.status-list", AgentStatusList);
  registry.register("action.stack", ActionStack);
  registry.register("approval.queue", ApprovalQueue);
  registry.register("event.timeline", EventTimeline);
  registry.register("artifact.summary", ArtifactSummary);

  return registry;
}
