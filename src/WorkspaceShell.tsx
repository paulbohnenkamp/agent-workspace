import React from 'react';

import type {
  WorkspaceInterpretedView,
  WorkspaceNavigationItem,
} from '../packages/types/src/workspace';

function formatTabLabel(value: string): string {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function workspaceStyles(): string {
  return `
    :root {
      color-scheme: light;
      --bg: #f4f7fb;
      --surface: #ffffff;
      --surface-muted: #f8fafc;
      --surface-strong: #f0f4f8;
      --border: #dde5ee;
      --border-strong: #c8d4e0;
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
      --shadow: 0 6px 14px rgba(18, 38, 63, 0.05);
      --radius-lg: 10px;
      --radius-md: 8px;
      --radius-sm: 6px;
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
      background: #f7f9fc;
      color: var(--ink);
    }
    button, input, textarea { font: inherit; }
    .workspace-app {
      max-width: none;
      margin: 0 auto;
      padding: 0;
    }
    .workspace-frame {
      display: grid;
      grid-template-columns: 4.25rem minmax(0, 1fr);
      gap: 0;
      align-items: start;
    }
    .workspace-rail {
      position: sticky;
      top: 0;
      min-height: 100vh;
      border-right: 1px solid var(--border);
      background: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.1rem 0.55rem 0.9rem;
      gap: 1.05rem;
    }
    .workspace-rail__brand {
      width: 2.35rem;
      height: 2.35rem;
      border-radius: 12px;
      background: linear-gradient(180deg, #1d7adb 0%, #1664d2 100%);
      color: #fff;
      display: grid;
      place-items: center;
      font-size: 1.25rem;
      font-weight: 700;
      box-shadow: 0 10px 24px rgba(22, 100, 210, 0.18);
    }
    .workspace-rail__nav {
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
      width: 100%;
      align-items: center;
      flex: 1;
    }
    .workspace-rail__item {
      width: 2.3rem;
      height: 2.3rem;
      border-radius: 12px;
      border: 1px solid #dde6ef;
      background: #f7fbfd;
      color: var(--ink-muted);
      display: grid;
      place-items: center;
      font-size: 1rem;
      text-decoration: none;
    }
    .workspace-rail__item.is-active {
      background: var(--accent-soft);
      border-color: #a9cfdc;
      color: var(--ink);
    }
    .workspace-rail__footer {
      margin-top: auto;
      color: var(--ink-soft);
      font-size: 1.25rem;
      line-height: 1;
    }
    .workspace-frame__content {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 0;
    }
    .workspace-topbar {
      min-height: 3.75rem;
      display: grid;
      grid-template-columns: auto auto minmax(18rem, 1fr) auto;
      gap: 1.4rem;
      align-items: center;
      padding: 0 1.05rem;
      border-bottom: 1px solid var(--border);
      background: #fff;
    }
    .workspace-topbar__brand {
      font-size: 1.2rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      white-space: nowrap;
    }
    .workspace-topbar__tabs {
      display: flex;
      align-self: stretch;
      gap: 1.45rem;
      align-items: center;
    }
    .workspace-topbar__tab {
      height: 100%;
      display: inline-flex;
      align-items: center;
      border-bottom: 2px solid transparent;
      color: var(--ink);
      font-size: 0.9rem;
      text-transform: capitalize;
    }
    .workspace-topbar__tab.is-active {
      color: #1263d8;
      border-color: #1263d8;
    }
    .workspace-topbar__search {
      justify-self: end;
      width: min(100%, 30rem);
      min-height: 2.35rem;
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.7rem 0.95rem;
      border: 1px solid var(--border);
      border-radius: 999px;
      color: var(--ink-soft);
      background: #fff;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .workspace-topbar__search::before {
      content: "⌕";
      font-size: 1rem;
      color: var(--ink-soft);
    }
    .workspace-topbar__actions {
      display: flex;
      align-items: center;
      gap: 0.55rem;
      justify-content: flex-end;
    }
    .workspace-topbar__action,
    .workspace-topbar__avatar {
      width: 2.1rem;
      height: 2.1rem;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: var(--surface);
      display: grid;
      place-items: center;
      color: var(--ink-muted);
    }
    .workspace-topbar__avatar {
      width: 2.3rem;
      height: 2.3rem;
      overflow: hidden;
    }
    .workspace-topbar__avatar::before {
      content: "P";
      font-weight: 700;
      color: #6c4f32;
      background: linear-gradient(180deg, #f4d0bd 0%, #e9b995 100%);
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
    }
    .workspace-topbar__badge {
      position: relative;
    }
    .workspace-topbar__badge::after {
      content: "3";
      position: absolute;
      top: -0.25rem;
      right: -0.15rem;
      width: 1rem;
      height: 1rem;
      border-radius: 999px;
      background: #e11d48;
      color: #fff;
      font-size: 0.65rem;
      font-weight: 700;
      display: grid;
      place-items: center;
      border: 2px solid #fff;
    }
    .workspace-shell {
      display: none;
    }
    .workspace-shell__topline {
      display: flex;
      justify-content: space-between;
      gap: 0.75rem;
      align-items: flex-start;
    }
    .workspace-shell__eyebrow {
      margin: 0 0 0.375rem;
      font-size: 0.76rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--ink-muted);
    }
    .workspace-shell__title {
      margin: 0;
      font-size: clamp(2.2rem, 3.4vw, 4rem);
      line-height: 0.94;
      letter-spacing: -0.05em;
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
      margin-top: 0.85rem;
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
      margin-top: 0;
      align-items: start;
      background: #fff;
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
      min-height: calc(100vh - 3.75rem);
      padding: 0.95rem 0.75rem;
      border-right: 1px solid var(--border);
      background: #fff;
    }
    .workspace-region--main,
    .workspace-region--master-main {
      min-height: calc(100vh - 3.75rem);
      padding: 0 1rem 1rem;
      border-right: 1px solid var(--border);
      background: #fff;
    }
    .workspace-region--context {
      border-right: 0;
      gap: 0.65rem;
    }
    .workspace-panel {
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
      overflow: hidden;
    }
    .workspace-region--queue > .workspace-panel,
    .workspace-region--assistant > .workspace-panel {
      border: 0;
      border-radius: 0;
      background: transparent;
    }
    .workspace-region--queue .workspace-panel__header,
    .workspace-region--assistant .workspace-panel__header {
      padding: 0.75rem 0 0.65rem;
    }
    .workspace-region--queue .workspace-panel__body,
    .workspace-region--assistant .workspace-panel__body {
      padding: 0;
    }
    .workspace-panel--summary-card .workspace-panel__body {
      padding: 0.75rem;
      border: 1px solid #e4dff5;
      border-radius: 8px;
      background: linear-gradient(180deg, #fbf9ff 0%, #f7f4ff 100%);
    }
    .workspace-region--context > .workspace-panel {
      border-radius: 8px;
      box-shadow: none;
    }
    .workspace-region--context .workspace-panel__header {
      padding: 0.85rem 0.9rem 0.35rem;
    }
    .workspace-region--context .workspace-panel__body {
      padding: 0 0.9rem 0.75rem;
    }
    .workspace-shell-surface,
    .workspace-grid-surface {
      padding: 1rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      background: var(--surface);
      box-shadow: var(--shadow);
    }
    .workspace-shell-surface__header,
    .workspace-grid-surface__header {
      display: flex;
      justify-content: space-between;
      gap: 0.75rem;
      align-items: flex-start;
    }
    .workspace-shell-surface__eyebrow,
    .workspace-grid-surface__eyebrow,
    .workspace-text__title {
      margin: 0 0 0.25rem;
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--ink-muted);
    }
    .workspace-shell-surface__title,
    .workspace-grid-surface__title {
      margin: 0;
      font-size: 1.35rem;
      line-height: 1.1;
      letter-spacing: -0.03em;
    }
    .workspace-shell-surface__caption,
    .workspace-grid-surface__caption {
      margin: 0.35rem 0 0;
      color: var(--ink-muted);
    }
    .workspace-shell-surface__body,
    .workspace-grid-surface__body {
      margin: 1rem 0 0;
      color: var(--ink-muted);
    }
    .workspace-panel--dense .workspace-panel__header {
      padding-top: 0.65rem;
    }
    .workspace-panel--dense .workspace-panel__body {
      padding: 0.75rem 1rem 1rem;
    }
    .workspace-rail,
    .workspace-canvas,
    .workspace-section,
    .workspace-stack-surface,
    .workspace-toolbar-surface,
    .workspace-card {
      border-color: var(--border-strong);
    }
    .workspace-panel__header,
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
    .workspace-panel__header {
      padding: 0.8rem 0.9rem 0;
    }
    .workspace-panel__body {
      padding: 0.85rem 0.9rem 0.9rem;
    }
    .workspace-panel__caption,
    .workspace-document__eyebrow {
      margin: 0 0 0.25rem;
      font-size: 0.68rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--ink-muted);
    }
    .workspace-panel__title,
    .workspace-document__section-title {
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.2;
      letter-spacing: 0;
    }
    .workspace-list,
    .workspace-stack,
    .workspace-button-stack {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .workspace-queue-controls {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.55rem;
      margin-bottom: 0.7rem;
    }
    .workspace-control-button {
      min-height: 2.1rem;
      border: 1px solid var(--border);
      border-radius: 6px;
      background: #fff;
      color: var(--ink);
      padding: 0 0.65rem;
      font-size: 0.84rem;
      text-align: left;
      cursor: pointer;
    }
    .workspace-toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .workspace-grid {
      display: grid;
      gap: 0.75rem;
      margin-top: 0.75rem;
    }
    .workspace-grid__cell {
      padding: 0.9rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface-muted);
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
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
    .workspace-message {
      border: 0;
      border-radius: 8px;
      padding: 0.65rem 0.75rem;
      font-size: 0.82rem;
    }
    .workspace-message strong,
    .workspace-record strong,
    .workspace-list-item strong {
      font-size: 0.88rem;
      line-height: 1.15;
    }
    .workspace-message__author {
      display: flex;
      flex-direction: column;
      gap: 0.12rem;
      min-width: 0;
    }
    .workspace-message__role {
      color: var(--ink-muted);
      font-size: 0.72rem;
      line-height: 1.2;
    }
    .workspace-message--human {
      margin-left: 1.5rem;
      background: #eef4ff;
    }
    .workspace-message--assistant {
      margin-right: 1rem;
      background: #fbf8ff;
    }
    .workspace-message p {
      margin: 0;
      line-height: 1.45;
    }
    .workspace-region--context .workspace-record {
      border: 0;
      border-top: 1px solid #e6edf4;
      border-radius: 0;
      background: transparent;
      padding: 0.6rem 0;
      font-size: 0.84rem;
    }
    .workspace-region--context .workspace-record:first-child {
      border-top: 0;
      padding-top: 0;
    }
    .workspace-region--context .workspace-stack {
      gap: 0;
    }
    .workspace-source-link {
      color: #174f9a;
      font-weight: 700;
      line-height: 1.2;
      text-decoration: none;
    }
    .workspace-source-link:hover,
    .workspace-source-link:focus {
      color: #1263d8;
      text-decoration: underline;
      text-underline-offset: 0.18em;
    }
    .workspace-agent-row {
      display: grid;
      grid-template-columns: 1.4rem minmax(0, 1fr);
      align-items: center;
      gap: 0.55rem;
    }
    .workspace-agent-row__icon {
      width: 1.4rem;
      height: 1.4rem;
      border-radius: 999px;
      display: grid;
      place-items: center;
      border: 1px solid var(--border-strong);
      background: var(--surface-strong);
      color: var(--ink-muted);
      font-size: 0.75rem;
      font-weight: 800;
      line-height: 1;
    }
    .workspace-agent-row__icon--complete {
      border-color: #b9e4cc;
      background: var(--positive-soft);
      color: var(--positive);
    }
    .workspace-agent-row__icon--pending {
      border-color: #bfd3ef;
      background: var(--notice-soft);
      color: var(--notice);
    }
    .workspace-agent-row__icon--issue {
      border-color: #f4c37a;
      background: var(--warning-soft);
      color: var(--warning);
    }
    .workspace-list-item {
      min-height: 5rem;
      display: grid;
      grid-template-columns: 2.25rem minmax(0, 1fr) 2.35rem;
      gap: 0.65rem;
      align-items: center;
      background: #fff;
      border-radius: 6px;
      padding: 0.72rem;
    }
    .workspace-list-item.is-selected {
      border-color: #2b78ff;
      background: #f9fcff;
      box-shadow: inset 0 0 0 1px #2b78ff;
    }
    .workspace-list-item__avatar {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 999px;
      display: grid;
      place-items: center;
      color: #6d4f31;
      background: linear-gradient(180deg, #f2cdb7 0%, #e7b58f 100%);
      font-size: 0.72rem;
      font-weight: 700;
    }
    .workspace-list-item__content {
      min-width: 0;
    }
    .workspace-list-item__secondary,
    .workspace-muted {
      color: var(--ink-muted);
    }
    .workspace-list-item__secondary {
      margin: 0.18rem 0 0;
      font-size: 0.8rem;
      line-height: 1.2;
    }
    .workspace-list-item__meta {
      display: inline-flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-top: 0.42rem;
      color: var(--ink-muted);
      font-size: 0.76rem;
    }
    .workspace-score-ring {
      width: 2.2rem;
      height: 2.2rem;
      border-radius: 999px;
      display: grid;
      place-items: center;
      border: 2px solid var(--positive);
      color: #173042;
      font-size: 0.78rem;
      font-weight: 700;
      background: #fff;
    }
    .workspace-score-ring--warning {
      border-color: #f59e0b;
    }
    .workspace-score-ring--critical {
      border-color: #f97316;
    }
    .workspace-list-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
      margin-top: 0.8rem;
      color: var(--ink-muted);
      font-size: 0.78rem;
    }
    .workspace-pagination {
      display: inline-flex;
      gap: 0.45rem;
      color: var(--ink);
      letter-spacing: 0.35em;
    }
    .workspace-count-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 1.45rem;
      height: 1.45rem;
      padding: 0 0.4rem;
      border-radius: 999px;
      background: var(--surface-strong);
      color: var(--ink);
      font-size: 0.78rem;
      font-weight: 700;
    }
    .workspace-button {
      border-radius: 6px;
      min-height: 2.35rem;
      padding: 0.55rem 0.8rem;
      border: 1px solid var(--border-strong);
      cursor: pointer;
      transition:
        background-color 160ms ease,
        border-color 160ms ease,
        color 160ms ease;
    }
    .workspace-button--primary {
      background: #174f9a;
      border-color: #174f9a;
      color: #fff;
    }
    .workspace-button--secondary {
      background: #f5f9ff;
      border-color: #bcd3fb;
      color: #174f9a;
    }
    .workspace-button--primary:hover,
    .workspace-button--primary:focus {
      background: #123f7c;
      border-color: #123f7c;
    }
    .workspace-button--secondary:hover,
    .workspace-button--secondary:focus {
      background: #edf4ff;
      border-color: #93b7ff;
      color: #123f7c;
    }
    .workspace-chat-input {
      display: grid;
      grid-template-columns: 1.7rem minmax(0, 1fr) 1.7rem 1.7rem;
      align-items: center;
      gap: 0.35rem;
      margin-top: auto;
      padding: 0.35rem;
      border: 1px solid var(--border-strong);
      border-radius: 8px;
      background: var(--surface);
    }
    .workspace-chat-input input {
      min-width: 0;
      border: 0;
      outline: 0;
      color: var(--ink);
      background: transparent;
      font-size: 0.86rem;
    }
    .workspace-chat-input input::placeholder {
      color: var(--ink-muted);
    }
    .workspace-chat-input__icon,
    .workspace-chat-input__send {
      width: 1.7rem;
      height: 1.7rem;
      border: 0;
      border-radius: 999px;
      display: grid;
      place-items: center;
      cursor: pointer;
    }
    .workspace-chat-input__icon {
      background: var(--surface-strong);
      color: var(--ink);
    }
    .workspace-chat-input__send {
      background: #1263d8;
      color: #fff;
    }
    .workspace-document {
      border-radius: 0;
      background: var(--surface);
      overflow: hidden;
    }
    .workspace-document + .workspace-document {
      border-top: 1px solid var(--border);
      margin-top: 1rem;
      padding-top: 1rem;
    }
    .workspace-region--main .workspace-document + .workspace-document {
      border-top: 0;
      margin-top: 0;
      padding-top: 0;
    }
    .workspace-document--hero {
      padding: 0.9rem 1.25rem;
      border-bottom: 0;
    }
    .workspace-document__title {
      margin: 0;
      font-size: 1.35rem;
      line-height: 1.15;
      letter-spacing: 0;
    }
    .workspace-document__subtitle {
      margin: 0.2rem 0 0;
      color: var(--ink-soft);
      font-size: 0.86rem;
    }
    .workspace-document__summary {
      margin: 1rem 0 0;
      padding-top: 1rem;
      border-top: 1px solid var(--border);
      max-width: 64ch;
      line-height: 1.55;
    }
    .workspace-score-card {
      padding: 0.45rem 0.7rem;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface-muted);
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
    }
    .workspace-score-card strong,
    .workspace-score {
      font-size: 1.55rem;
      line-height: 1;
    }
    .workspace-document__header {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--border);
    }
    .workspace-document__header > div,
    .workspace-document__header-meta,
    .workspace-document__sections,
    .workspace-document__section {
      min-width: 0;
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
      gap: 1.1rem;
      padding: 0 1.25rem;
      border-bottom: 1px solid var(--border);
    }
    .workspace-tab {
      display: inline-flex;
      align-items: center;
      min-height: 2.75rem;
      padding: 0.15rem 0;
      border: 0;
      border-bottom: 2px solid transparent;
      border-radius: 0;
      background: transparent;
      color: var(--ink-muted);
      font-size: 0.83rem;
      text-transform: capitalize;
    }
    .workspace-tab.is-active {
      background: transparent;
      color: #1263d8;
      border-color: #1263d8;
    }
    .workspace-document__sections {
      padding: 1.05rem 1.25rem;
    }
    .workspace-document__section + .workspace-document__section {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border);
    }
    .workspace-document__section h3 {
      margin: 0 0 0.55rem;
      font-size: 0.98rem;
    }
    .workspace-document__section p,
    .workspace-document__section li {
      line-height: 1.52;
      max-width: 65ch;
      overflow-wrap: anywhere;
    }
    .workspace-document__section ul {
      margin: 0;
      padding-left: 1.25rem;
    }
    .workspace-text {
      padding: 1rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      background: var(--surface);
    }
    .workspace-text p {
      margin: 0;
      line-height: 1.6;
    }
    .workspace-text ul {
      margin: 0.75rem 0 0;
      padding-left: 1.25rem;
    }
    .workspace-divider-wrap {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin: 0.25rem 0;
    }
    .workspace-divider-label {
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--ink-muted);
      white-space: nowrap;
    }
    .workspace-divider {
      flex: 1;
      border: 0;
      border-top: 1px solid var(--border);
      margin: 0;
    }
    .workspace-card__value {
      font-size: 1.8rem;
      line-height: 1;
      letter-spacing: -0.04em;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      min-height: 1.45rem;
      padding: 0.1rem 0.45rem;
      border-radius: 999px;
      font-size: 0.72rem;
      font-weight: 600;
      white-space: nowrap;
    }
    .status-badge--positive { background: var(--positive-soft); color: var(--positive); }
    .status-badge--notice { background: var(--notice-soft); color: var(--notice); }
    .status-badge--warning { background: var(--warning-soft); color: var(--warning); }
    .status-badge--neutral { background: var(--surface-strong); color: var(--ink-muted); }
    @media (max-width: 1180px) {
      .workspace-frame {
        grid-template-columns: 1fr;
      }
      .workspace-rail {
        position: static;
        min-height: auto;
        flex-direction: row;
        justify-content: space-between;
        padding: 0.75rem;
      }
      .workspace-rail__nav {
        flex-direction: row;
        justify-content: center;
        flex: 1;
      }
      .workspace-rail__footer {
        margin-top: 0;
      }
      .workspace-topbar {
        grid-template-columns: 1fr;
      }
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
  const activeView = interpreted.view.id.replace(/-workspace$/, '');
  const topTabs = interpreted.view.shell?.chrome?.topTabs ?? [];

  return (
    <div className="workspace-app">
      <div className="workspace-frame">
        <aside className="workspace-rail" aria-label="Workspace navigation">
          <div className="workspace-rail__brand" aria-hidden="true">
            H
          </div>
          <nav className="workspace-rail__nav">
            {navigation.map((item) => {
              const symbol =
                item.id === 'open-roles-board' ? '⌂' : item.id === 'candidate-review' ? '◉' : '✓';

              return (
                <a
                  className={`workspace-rail__item ${item.id === activeView ? 'is-active' : ''}`.trim()}
                  href={item.href}
                  key={item.id}
                  aria-label={item.label}
                  title={item.label}
                >
                  {symbol}
                </a>
              );
            })}
          </nav>
          <div className="workspace-rail__footer" aria-hidden="true">
            ≪
          </div>
        </aside>
        <div className="workspace-frame__content">
          <header className="workspace-topbar">
            <div className="workspace-topbar__brand">{interpreted.state.project.title}</div>
            {topTabs.length > 0 ? (
              <nav className="workspace-topbar__tabs" aria-label="Workspace sections">
                {topTabs.map((tab, index) => (
                  <span
                    className={`workspace-topbar__tab ${index === 0 ? 'is-active' : ''}`.trim()}
                    key={tab}
                  >
                    {formatTabLabel(tab)}
                  </span>
                ))}
              </nav>
            ) : null}
            <div className="workspace-topbar__search">Search candidates, roles, and more...</div>
            <div className="workspace-topbar__actions" aria-label="Workspace actions">
              <span className="workspace-topbar__action workspace-topbar__badge" aria-hidden="true">
                🔔
              </span>
              <span className="workspace-topbar__action" aria-hidden="true">
                ?
              </span>
              <span className="workspace-topbar__avatar" aria-hidden="true" />
            </div>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
