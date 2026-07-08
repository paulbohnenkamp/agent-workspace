import React from "react";

import type { WorkspaceInterpretedView, WorkspaceNavigationItem } from "../packages/types/src/workspace";

export function workspaceStyles(): string {
  return `
    :root {
      color-scheme: light;
      --bg: #f4f7fb;
      --surface: #ffffff;
      --surface-muted: #f8fafc;
      --surface-strong: #f0f4f8;
      --border: #d7e0ea;
      --border-strong: #c3d0dc;
      --ink: #172533;
      --ink-muted: #5f7286;
      --ink-soft: #90a0af;
      --accent: #145d75;
      --accent-soft: #dcecf1;
      --positive: #1f8a5b;
      --positive-soft: #dff4e8;
      --warning: #9c6a00;
      --warning-soft: #f8ecd1;
      --notice: #285b93;
      --notice-soft: #e5eef9;
      --shadow: 0 10px 30px rgba(18, 38, 63, 0.06);
      --radius-lg: 18px;
      --radius-md: 12px;
      --radius-sm: 8px;
      --space-1: 0.25rem;
      --space-2: 0.5rem;
      --space-3: 0.75rem;
      --space-4: 1rem;
      --space-5: 1.5rem;
      --space-6: 2rem;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Inter, "Segoe UI", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      background: linear-gradient(180deg, #eef4f8 0%, var(--bg) 14rem);
      color: var(--ink);
    }
    button, input, textarea { font: inherit; }
    .workspace-app {
      max-width: 1560px;
      margin: 0 auto;
      padding: 1rem;
    }
    .workspace-shell {
      border: 1px solid var(--border);
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.82);
      backdrop-filter: blur(10px);
      box-shadow: var(--shadow);
      padding: 1rem 1.25rem;
    }
    .workspace-shell__topline {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: flex-start;
    }
    .workspace-shell__eyebrow {
      margin: 0 0 0.375rem;
      font-size: 0.75rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--ink-muted);
    }
    .workspace-shell__title {
      margin: 0;
      font-size: 2rem;
      line-height: 1;
      letter-spacing: -0.04em;
    }
    .workspace-shell__description {
      max-width: 60ch;
      margin: 0.75rem 0 0;
      color: var(--ink-muted);
      line-height: 1.5;
    }
    .workspace-shell__status {
      display: inline-flex;
      align-items: center;
      gap: 0.625rem;
      padding: 0.75rem 0.95rem;
      border: 1px solid var(--border);
      border-radius: 999px;
      background: var(--surface);
      color: var(--ink-muted);
      white-space: nowrap;
    }
    .workspace-shell__status-divider {
      color: var(--ink-soft);
    }
    .workspace-shell__status::before {
      content: "";
      width: 0.625rem;
      height: 0.625rem;
      border-radius: 999px;
      background: var(--positive);
      box-shadow: 0 0 0 0.25rem rgba(31, 138, 91, 0.12);
    }
    .workspace-nav {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-top: 1rem;
    }
    .workspace-shell__tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    .workspace-shell__tab {
      display: inline-flex;
      align-items: center;
      min-height: 2.1rem;
      padding: 0.4rem 0.8rem;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: var(--surface-muted);
      color: var(--ink-muted);
      text-transform: capitalize;
    }
    .workspace-shell__tab.is-active {
      color: var(--ink);
      background: var(--accent-soft);
      border-color: #b8d3dc;
    }
    .workspace-nav a {
      display: inline-flex;
      align-items: center;
      min-height: 2.5rem;
      padding: 0.625rem 0.875rem;
      border-radius: 999px;
      color: var(--ink-muted);
      text-decoration: none;
      border: 1px solid transparent;
    }
    .workspace-nav a.is-active {
      color: var(--ink);
      background: var(--accent-soft);
      border-color: #b8d3dc;
    }
    .workspace-body {
      display: grid;
      gap: 1rem;
      margin-top: 1rem;
      align-items: start;
    }
    .workspace-body--three-column-board {
      grid-auto-rows: minmax(0, auto);
    }
    .workspace-region {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 0;
    }
    .workspace-region--queue,
    .workspace-region--assistant,
    .workspace-region--context,
    .workspace-region--board-column,
    .workspace-region--master-list {
      padding: 1rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      background: rgba(255, 255, 255, 0.76);
      box-shadow: var(--shadow);
    }
    .workspace-region--main,
    .workspace-region--master-main {
      padding: 1rem;
      border: 1px solid var(--border);
      border-radius: 20px;
      background: var(--surface);
      box-shadow: var(--shadow);
    }
    .workspace-module {
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      background: var(--surface);
      overflow: hidden;
    }
    .workspace-module__header,
    .workspace-document__header,
    .workspace-document__hero,
    .workspace-list-item__topline,
    .workspace-record__topline,
    .workspace-message__topline,
    .workspace-composer__actions {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.75rem;
    }
    .workspace-module__header {
      padding: 0.9rem 1rem 0;
    }
    .workspace-module__body {
      padding: 1rem;
    }
    .workspace-module__caption,
    .workspace-document__eyebrow {
      margin: 0 0 0.25rem;
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--ink-muted);
    }
    .workspace-module__title,
    .workspace-document__section-title {
      margin: 0;
      font-size: 1.05rem;
      line-height: 1.2;
      letter-spacing: -0.02em;
    }
    .workspace-list,
    .workspace-stack,
    .workspace-button-stack {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .workspace-list-item,
    .workspace-record,
    .workspace-message {
      padding: 0.9rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface-muted);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .workspace-list-item.is-selected {
      border-color: #8fb3c4;
      background: #eaf3f7;
      box-shadow: inset 0 0 0 1px #bed5df;
    }
    .workspace-list-item__secondary,
    .workspace-muted {
      color: var(--ink-muted);
    }
    .workspace-list-item__meta {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
      color: var(--ink-muted);
      font-size: 0.9rem;
    }
    .workspace-button {
      border-radius: 10px;
      min-height: 2.5rem;
      padding: 0.65rem 0.9rem;
      border: 1px solid var(--border-strong);
      cursor: pointer;
    }
    .workspace-button--primary {
      background: var(--accent);
      border-color: var(--accent);
      color: #fff;
    }
    .workspace-button--secondary {
      background: var(--surface);
      color: var(--ink);
    }
    .workspace-composer textarea {
      width: 100%;
      min-height: 8rem;
      border-radius: 10px;
      border: 1px solid var(--border-strong);
      padding: 0.9rem;
      resize: vertical;
      background: var(--surface);
      color: var(--ink);
    }
    .workspace-document {
      border-radius: 16px;
      background: var(--surface);
      overflow: hidden;
    }
    .workspace-document + .workspace-document {
      border-top: 1px solid var(--border);
      margin-top: 1rem;
      padding-top: 1rem;
    }
    .workspace-document--hero {
      padding: 1.25rem;
      border-bottom: 1px solid var(--border);
    }
    .workspace-document__title {
      margin: 0;
      font-size: 3rem;
      line-height: 0.95;
      letter-spacing: -0.06em;
    }
    .workspace-document__subtitle {
      margin: 0.35rem 0 0;
      color: var(--ink-soft);
      font-size: 1.15rem;
    }
    .workspace-document__summary {
      margin: 1rem 0 0;
      padding-top: 1rem;
      border-top: 1px solid var(--border);
      max-width: 64ch;
      line-height: 1.55;
    }
    .workspace-score-card {
      padding: 0.75rem 1rem;
      border: 1px solid var(--border);
      border-radius: 14px;
      background: var(--surface-muted);
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
    }
    .workspace-score-card strong,
    .workspace-score {
      font-size: 1.8rem;
      line-height: 1;
    }
    .workspace-document__header {
      padding: 1.25rem;
      border-bottom: 1px solid var(--border);
    }
    .workspace-document__header-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.375rem;
    }
    .workspace-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      padding: 1rem 1.25rem 0;
    }
    .workspace-tab {
      display: inline-flex;
      align-items: center;
      min-height: 2.2rem;
      padding: 0.45rem 0.8rem;
      border: 1px solid var(--border);
      border-radius: 999px;
      background: var(--surface-muted);
      color: var(--ink-muted);
    }
    .workspace-tab.is-active {
      background: var(--accent-soft);
      color: var(--ink);
      border-color: #b8d3dc;
    }
    .workspace-document__sections {
      padding: 1.25rem;
    }
    .workspace-document__section + .workspace-document__section {
      margin-top: 1.25rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--border);
    }
    .workspace-document__section h3 {
      margin: 0 0 0.75rem;
      font-size: 1.05rem;
    }
    .workspace-document__section p,
    .workspace-document__section li {
      line-height: 1.6;
      max-width: 65ch;
    }
    .workspace-document__section ul {
      margin: 0;
      padding-left: 1.25rem;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      min-height: 1.85rem;
      padding: 0.15rem 0.55rem;
      border-radius: 999px;
      font-size: 0.82rem;
      font-weight: 600;
      white-space: nowrap;
    }
    .status-badge--positive { background: var(--positive-soft); color: var(--positive); }
    .status-badge--notice { background: var(--notice-soft); color: var(--notice); }
    .status-badge--warning { background: var(--warning-soft); color: var(--warning); }
    .status-badge--neutral { background: var(--surface-strong); color: var(--ink-muted); }
    @media (max-width: 1180px) {
      .workspace-shell__topline,
      .workspace-document__hero,
      .workspace-document__header,
      .workspace-composer__actions {
        flex-direction: column;
        align-items: stretch;
      }
      .workspace-body {
        grid-template-columns: 1fr !important;
      }
    }
  `;
}

export function WorkspaceShell({
  interpreted,
  navigation,
  children,
}: {
  interpreted: WorkspaceInterpretedView;
  navigation: WorkspaceNavigationItem[];
  children: React.ReactNode;
}) {
  const activeView = interpreted.view.id.replace(/-workspace$/, "");
  const shell = interpreted.view.shell;
  const showNavigation = shell?.chrome?.leftNav !== false && navigation.length > 0;
  const topTabs = shell?.chrome?.topTabs ?? [];
  const contextProjectId = typeof interpreted.context.projectId === "string" ? interpreted.context.projectId : "";

  return (
    <div className="workspace-app">
      <section className="workspace-shell">
        <div className="workspace-shell__topline">
          <div>
            <p className="workspace-shell__eyebrow">{interpreted.state.project.title}</p>
            <h1 className="workspace-shell__title">{interpreted.view.title}</h1>
            {interpreted.view.description ? (
              <p className="workspace-shell__description">{interpreted.view.description}</p>
            ) : null}
          </div>
          <div className="workspace-shell__status">
            <span>{shell?.type ?? "workspace"}</span>
            {contextProjectId ? <span className="workspace-shell__status-divider">·</span> : null}
            {contextProjectId ? <span>{contextProjectId}</span> : null}
          </div>
        </div>
        {topTabs.length > 0 ? (
          <div className="workspace-shell__tabs" aria-label="Workspace sections">
            {topTabs.map((tab, index) => (
              <span className={`workspace-shell__tab ${index === 0 ? "is-active" : ""}`.trim()} key={tab}>
                {tab}
              </span>
            ))}
          </div>
        ) : null}
        {showNavigation ? (
          <nav className="workspace-nav">
            {navigation.map((item) => (
              <a className={item.id === activeView ? "is-active" : ""} href={item.href} key={item.id}>
                {item.label}
              </a>
            ))}
          </nav>
        ) : null}
      </section>
      {children}
    </div>
  );
}
