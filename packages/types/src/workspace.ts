import type { ReactElement } from 'react';

export type LooseRecord = Record<string, unknown>;

export interface WorkspaceProjectDescriptor {
  id: string;
  name: string;
  title: string;
}

export interface WorkspaceStateRecord {
  project: WorkspaceProjectDescriptor;
  item_queue?: LooseRecord[];
  artifact_versions?: LooseRecord[];
  thread_index?: LooseRecord[];
  agent_activity?: LooseRecord[];
  knowledge_links?: LooseRecord[];
  approval_state?: LooseRecord[];
  [key: string]: unknown;
}

export interface WorkspaceShellDefinition {
  type: string;
  header?: {
    component?: string;
  };
  chrome?: {
    leftNav?: boolean;
    topTabs?: string[];
  };
}

export interface WorkspaceFieldDefinition {
  name: string;
  source: string;
  select?: LooseRecord;
  defaultValue?: unknown;
}

export type WorkspaceTrackSize = string;

export interface WorkspaceLayoutRegionDefinition {
  id: string;
  columnStart?: number;
  columnSpan?: number;
  rowStart?: number;
  rowSpan?: number;
}

export interface WorkspaceLayoutDefinition {
  type: 'grid';
  columns: WorkspaceTrackSize[];
  gap?: string;
  rows?: WorkspaceTrackSize[];
  regions: WorkspaceLayoutRegionDefinition[];
}

export interface WorkspaceViewNodeDefinition {
  component: string;
  title?: string;
  tabs?: string[];
  actions?: string[];
  bind?: LooseRecord;
}

export type WorkspaceDeclaredRegions = Record<string, WorkspaceViewNodeDefinition[]>;

export interface WorkspaceViewDefinition {
  id: string;
  title: string;
  route: string;
  description?: string;
  shell?: WorkspaceShellDefinition;
  context?: LooseRecord;
  fields?: WorkspaceFieldDefinition[];
  layout: WorkspaceLayoutDefinition;
  regions?: WorkspaceDeclaredRegions;
}

export interface WorkspaceResolvedViewNode extends Omit<WorkspaceViewNodeDefinition, 'bind'> {
  bind: LooseRecord;
}

export type WorkspaceResolvedRegions = Record<string, WorkspaceResolvedViewNode[]>;

export interface WorkspaceInterpretedView {
  view: WorkspaceViewDefinition;
  route: LooseRecord;
  context: LooseRecord;
  fields: LooseRecord;
  ui: LooseRecord;
  state: WorkspaceStateRecord;
  regions: WorkspaceResolvedRegions;
}

export interface WorkspaceNavigationItem {
  id: string;
  label: string;
  href: string;
}

export interface WorkspaceRegionRenderDefinition {
  id: string;
  nodes: WorkspaceResolvedViewNode[];
  className: string;
  columnStart?: number;
  columnSpan?: number;
  rowStart?: number;
  rowSpan?: number;
}

export interface WorkspaceComponentProps {
  node: WorkspaceResolvedViewNode;
  interpreted: WorkspaceInterpretedView;
}

export type WorkspaceComponent = (props: WorkspaceComponentProps) => ReactElement;
