import React from 'react';

import type {
  LooseRecord,
  WorkspaceActionDefinition,
  WorkspaceActionValue,
  WorkspaceComponent,
  WorkspaceComponentProps,
} from '../../packages/types/src/workspace';

export function asArray(value: unknown): LooseRecord[] {
  return Array.isArray(value) ? (value as LooseRecord[]) : [];
}

export function asRecord(value: unknown): LooseRecord {
  return value && typeof value === 'object' ? (value as LooseRecord) : {};
}

export function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

export function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' ? value : fallback;
}

export function isRecord(value: unknown): value is LooseRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function asBulletText(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  if (value == null) {
    return '';
  }

  return JSON.stringify(value) ?? '';
}

export function titleCase(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(/[_-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function displayActionLabel(value: string): string {
  return /\s/.test(value) ? value : titleCase(value);
}

export function normalizeActionDefinition(
  action: WorkspaceActionValue,
  defaultVariant: 'primary' | 'secondary' = 'secondary'
): Required<WorkspaceActionDefinition> {
  if (typeof action === 'string') {
    return {
      label: displayActionLabel(action),
      variant: defaultVariant,
    };
  }

  return {
    label: displayActionLabel(asString(action.label, 'Action')),
    variant:
      action.variant === 'primary'
        ? 'primary'
        : action.variant === 'secondary'
          ? 'secondary'
          : defaultVariant,
  };
}

export function toneForStatus(status: string): string {
  const normalized = status.toLowerCase();

  if (
    normalized.includes('strong') ||
    normalized.includes('advance') ||
    normalized.includes('approved') ||
    normalized.includes('online')
  ) {
    return 'positive';
  }

  if (normalized.includes('pending') || normalized.includes('review')) {
    return 'notice';
  }

  if (normalized.includes('feedback') || normalized.includes('concern')) {
    return 'warning';
  }

  return 'neutral';
}

export function pickRecord(bind: LooseRecord, keys: string[]): LooseRecord {
  for (const key of keys) {
    const value = bind[key];

    if (isRecord(value)) {
      return value;
    }
  }

  return {};
}

export function pickArray(bind: LooseRecord, keys: string[]): LooseRecord[] {
  for (const key of keys) {
    const value = bind[key];

    if (Array.isArray(value)) {
      return value as LooseRecord[];
    }
  }

  return [];
}

export function Badge({ label }: { label: string }) {
  return <span className={`status-badge status-badge--${toneForStatus(label)}`}>{label}</span>;
}

export function Panel({
  title,
  caption,
  meta,
  children,
  className = '',
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

export function renderListItems(items: LooseRecord[], emptyLabel: string): React.ReactNode {
  if (items.length === 0) {
    return <p className="workspace-muted">{emptyLabel}</p>;
  }

  return items.map((item, index) => (
    <article className="workspace-record" key={`${asString(item.id, `item-${index}`)}-${index}`}>
      <strong>{asString(item.title ?? item.name ?? item.label, 'Item')}</strong>
      {asString(item.detail ?? item.body ?? item.summary) ? (
        <span className="workspace-muted">
          {asString(item.detail ?? item.body ?? item.summary)}
        </span>
      ) : null}
    </article>
  ));
}

export type WorkspacePrimitiveComponent = WorkspaceComponent;
export type WorkspacePrimitiveProps = WorkspaceComponentProps;
