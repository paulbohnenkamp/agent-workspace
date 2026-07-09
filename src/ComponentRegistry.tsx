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

function isRecord(value: unknown): value is LooseRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asBulletText(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (value == null) {
    return "";
  }

  return JSON.stringify(value) ?? "";
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

function pickRecord(bind: LooseRecord, keys: string[]): LooseRecord {
  for (const key of keys) {
    const value = bind[key];

    if (isRecord(value)) {
      return value;
    }
  }

  return {};
}

function pickArray(bind: LooseRecord, keys: string[]): LooseRecord[] {
  for (const key of keys) {
    const value = bind[key];

    if (Array.isArray(value)) {
      return value as LooseRecord[];
    }
  }

  return [];
}

function Badge({ label }: { label: string }) {
  return <span className={`status-badge status-badge--${toneForStatus(label)}`}>{label}</span>;
}

function Panel({
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
  const showHeader = title != null || caption != null || meta != null;

  return (
    <section className={`workspace-panel ${className}`.trim()}>
      {showHeader && (
        <header className="workspace-panel__header">
          <div>
            {caption ? <p className="workspace-panel__caption">{caption}</p> : null}
            {title ? <h2 className="workspace-panel__title">{title}</h2> : null}
          </div>
          {meta}
        </header>
      )}
      <div className="workspace-panel__body">{children}</div>
    </section>
  );
}

const BadgePrimitive: WorkspaceComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const label = asString(bind.label ?? node.title ?? bind.status ?? "Badge");

  return <Badge label={label} />;
};

const PanelPrimitive: WorkspaceComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const body = asString(bind.body ?? bind.content ?? bind.summary);
  const items = pickArray(bind, ["items", "projection"]);
  const caption = asString(bind.caption) || undefined;

  return (
    <Panel title={node.title ?? asString(bind.title, "Panel")} caption={caption}>
      <div className="workspace-stack">
        {body ? <p>{body}</p> : null}
        {items.length > 0 ? (
          <div className="workspace-stack">
            {items.map((item, index) => (
              <article className="workspace-record" key={`${asString(item.id, `item-${index}`)}-${index}`}>
                <strong>{asString(item.title ?? item.name ?? item.label, "Item")}</strong>
                {asString(item.detail ?? item.body) ? <span className="workspace-muted">{asString(item.detail ?? item.body)}</span> : null}
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </Panel>
  );
};

const ListPrimitive: WorkspaceComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const items = pickArray(bind, ["items", "projection", "entries"]);
  const caption = asString(bind.caption) || undefined;

  return (
    <Panel title={node.title ?? asString(bind.title, "List")} caption={caption}>
      <div className="workspace-stack">
        {items.map((item, index) => {
          const id = asString(item.id, `${index}`);
          const label = asString(item.title ?? item.name ?? item.label, "Item");
          const detail = asString(item.detail ?? item.body ?? item.updatedAt);

          return (
            <article className="workspace-record" key={`${id}-${index}`}>
              <strong>{label}</strong>
              {detail ? <span className="workspace-muted">{detail}</span> : null}
            </article>
          );
        })}
      </div>
    </Panel>
  );
};

const DocumentPrimitive: WorkspaceComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const sections = asArray(bind.sections);
  const body = asString(bind.body ?? bind.content ?? bind.summary);
  const title = node.title ?? asString(bind.title, "Document");

  return (
    <section className="workspace-document">
      <header className="workspace-document__header">
        <div>
          <p className="workspace-document__eyebrow">Document</p>
          <h2 className="workspace-document__section-title">{title}</h2>
        </div>
      </header>
      <div className="workspace-document__sections">
        {body ? <p>{body}</p> : null}
        {sections.map((section, index) => {
          const entry = asRecord(section);
          const bullets = asArray(entry.bullets);

          return (
            <article className="workspace-document__section" key={`${asString(entry.title, `section-${index}`)}-${index}`}>
              <h3>{asString(entry.title, "Section")}</h3>
              {entry.body ? <p>{asString(entry.body)}</p> : null}
              {bullets.length > 0 ? (
                <ul>
                  {bullets.map((bullet, bulletIndex) => (
                    <li key={`${bulletIndex}-${asBulletText(bullet)}`}>{asBulletText(bullet)}</li>
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

const Queue: WorkspaceComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const items = asArray(bind.projection);
  const selectedId = asString(bind.selectedId);

  return (
    <Panel title={node.title ?? "Queue"} caption="Queue">
      <div className="workspace-list">
        {items.map((item) => {
          const id = asString(item.id);
          const badge = asString(item.badge ?? item.status);

          return (
            <article className={`workspace-list-item ${id === selectedId ? "is-selected" : ""}`.trim()} key={id}>
              <div className="workspace-list-item__topline">
                <strong>{asString(item.name ?? item.candidateName)}</strong>
                {badge ? <Badge label={badge} /> : null}
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
    </Panel>
  );
};

const SummaryCard: WorkspaceComponent = ({ node, interpreted }) => {
  const bind = asRecord(node.bind);
  const record = pickRecord(bind, ["record", "entity", "candidate", "artifact", "item", "assistant", "source"]);
  const artifactFromBind = pickRecord(bind, ["artifact", "record", "entity"]);
  const selection = asString(bind.selection);
  const artifactFromSelection = selection
    ? asArray(interpreted.state.artifact_versions).find((entry) => asString(entry.id) === selection)
    : undefined;
  const artifact = Object.keys(artifactFromBind).length > 0 ? artifactFromBind : asRecord(artifactFromSelection);
  const sections = asArray(artifact.sections);
  const firstSection = asRecord(sections[0]);
  const hasRecord = Object.keys(record).length > 0;
  const hasArtifact = Object.keys(artifact).length > 0;

  return (
    <Panel title={node.title ?? "Summary"} caption="Summary" meta={hasRecord ? <Badge label="Live" /> : null}>
      <div className="workspace-stack">
        {hasRecord ? (
          <div>
            <strong>{asString(record.name ?? record.title ?? record.label, "Record")}</strong>
            <p className="workspace-muted">{asString(record.role ?? record.type ?? record.status)}</p>
          </div>
        ) : null}
        {hasArtifact ? <p>{asString(firstSection.body, "No summary available.")}</p> : <p className="workspace-muted">No summary available.</p>}
        {hasRecord ? (
          <div className="workspace-button-stack">
            <button type="button" className="workspace-button workspace-button--secondary">
              Review
            </button>
            <button type="button" className="workspace-button workspace-button--secondary">
              Request changes
            </button>
          </div>
        ) : null}
      </div>
    </Panel>
  );
};

const Timeline: WorkspaceComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const thread = pickRecord(bind, ["thread", "record", "entity"]);
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

const Composer: WorkspaceComponent = () => (
  <Panel title="Composer" caption="Composer">
    <form className="workspace-composer">
      <textarea rows={5} placeholder="Write a reply, draft, or note..." />
      <div className="workspace-composer__actions">
        <span className="workspace-muted">Responses are added to the workspace thread.</span>
        <button type="button" className="workspace-button workspace-button--primary">Send</button>
      </div>
    </form>
  </Panel>
);

const Header: WorkspaceComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const record = pickRecord(bind, ["record", "entity", "candidate", "artifact", "item", "assistant", "source"]);
  const badge = asString(record.badge ?? record.status ?? record.state);

  return (
    <section className="workspace-document workspace-document--hero">
      <div className="workspace-document__hero">
        <div>
          <p className="workspace-document__eyebrow">{node.title ?? "Workspace view"}</p>
          <h1 className="workspace-document__title">{asString(record.name ?? record.title ?? node.title, "Header")}</h1>
          <p className="workspace-document__subtitle">{asString(record.role ?? record.type ?? record.subtitle)}</p>
        </div>
        <div className="workspace-document__hero-meta">
          {badge ? <Badge label={badge} /> : null}
          <div className="workspace-score-card">
            <span className="workspace-muted">Score</span>
            <strong>{asNumber(record.score)}</strong>
          </div>
        </div>
      </div>
      <p className="workspace-document__summary">
        Review the current record, discussion trail, source material, and workflow support before advancing or requesting revisions.
      </p>
    </section>
  );
};

const Tabs: WorkspaceComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const artifact = pickRecord(bind, ["artifact", "record", "entity"]);
  const sections = asArray(artifact.sections);
  const tabs = Array.isArray(node.tabs) ? node.tabs : [];
  const verdict = asString(artifact.verdict ?? artifact.status);

  return (
    <section className="workspace-document">
      <header className="workspace-document__header">
        <div>
          <p className="workspace-document__eyebrow">Sections</p>
          <h2 className="workspace-document__section-title">{asString(artifact.title, "Document")}</h2>
          <p className="workspace-muted">
            Generated by {asString(artifact.generatedBy)} · {asString(artifact.generatedAt)}
          </p>
        </div>
        <div className="workspace-document__header-meta">
          <strong className="workspace-score">{asNumber(artifact.score)}</strong>
          {verdict ? <Badge label={verdict} /> : null}
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
                    <li key={`${bulletIndex}-${asBulletText(bullet)}`}>{asBulletText(bullet)}</li>
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

const Sources: WorkspaceComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const sources = asArray(bind.sources);

  return (
    <Panel title={node.title ?? "Sources"} caption="Evidence">
      <div className="workspace-stack">
        {sources.map((source) => (
          <article className="workspace-record" key={asString(source.id)}>
            <strong>{asString(source.title)}</strong>
            <span className="workspace-muted">{asString(source.updatedAt)}</span>
          </article>
        ))}
      </div>
    </Panel>
  );
};

const StatusList: WorkspaceComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const runs = asArray(bind.runs);

  return (
    <Panel title={node.title ?? "Status"} caption="Runtime">
      <div className="workspace-stack">
        {runs.map((run) => (
          <article className="workspace-record" key={asString(run.id)}>
            <div className="workspace-record__topline">
              <strong>{asString(run.name)}</strong>
              <Badge label={asString(run.status)} />
            </div>
            <span>{asString(run.detail)}</span>
          </article>
        ))}
      </div>
    </Panel>
  );
};

const Actions: WorkspaceComponent = ({ node }) => {
  const actions = Array.isArray(node.actions) ? node.actions : [];

  return (
    <Panel title={node.title ?? "Actions"} caption="Actions">
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
    </Panel>
  );
};

export class ComponentRegistry {
  private readonly components = new Map<string, WorkspaceComponent>();

  register(componentId: string, component: WorkspaceComponent): void {
    if (this.components.has(componentId)) {
      throw new Error(`Duplicate component alias: ${componentId}`);
    }

    this.components.set(componentId, component);
  }

  has(componentId: string): boolean {
    return this.components.has(componentId);
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

  registry.register("badge", BadgePrimitive);
  registry.register("panel", PanelPrimitive);
  registry.register("list", ListPrimitive);
  registry.register("document", DocumentPrimitive);
  registry.register("header", Header);
  registry.register("queue", Queue);
  registry.register("summaryCard", SummaryCard);
  registry.register("timeline", Timeline);
  registry.register("composer", Composer);
  registry.register("tabs", Tabs);
  registry.register("sources", Sources);
  registry.register("statusList", StatusList);
  registry.register("actions", Actions);

  return registry;
}
