import type { ReactElement } from 'react';

export type LooseRecord = Record<string, unknown>;

export type WorkspaceProjectDescriptor = {
  id: string;
  name: string;
  title: string;
}

export type WorkspaceStateRecord = {
  project: WorkspaceProjectDescriptor;
  item_queue?: LooseRecord[];
  artifact_versions?: LooseRecord[];
  thread_index?: LooseRecord[];
  agent_activity?: LooseRecord[];
  knowledge_links?: LooseRecord[];
  approval_state?: LooseRecord[];
  [key: string]: unknown;
}

export type WorkspaceShellDefinition = {
  type: string;
  header?: {
    component?: string;
  };
  chrome?: {
    leftNav?: boolean;
    topTabs?: string[];
  };
}

export type WorkspaceFieldDefinition = {
  name: string;
  source: string;
  select?: LooseRecord;
  defaultValue?: unknown;
}

export type WorkspaceTrackSize = string;

export type WorkspaceLayoutRegionDefinition = {
  id: string;
  columnStart?: number;
  columnSpan?: number;
  rowStart?: number;
  rowSpan?: number;
}

export type WorkspaceLayoutDefinition = {
  type: 'grid';
  columns: WorkspaceTrackSize[];
  gap?: string;
  rows?: WorkspaceTrackSize[];
  regions: WorkspaceLayoutRegionDefinition[];
}

export type WorkspaceViewNodeDefinition = {
  component: string;
  title?: string;
  tabs?: string[];
  actions?: string[];
  bind?: LooseRecord;
}

export type WorkspaceDeclaredRegions = Record<string, WorkspaceViewNodeDefinition[]>;

export type WorkspaceViewDefinition = {
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

export type WorkspaceResolvedViewNode = {
  bind: LooseRecord;
} & Omit<WorkspaceViewNodeDefinition, 'bind'>

export type WorkspaceResolvedRegions = Record<string, WorkspaceResolvedViewNode[]>;

export type WorkspaceInterpretedView = {
  view: WorkspaceViewDefinition;
  route: LooseRecord;
  context: LooseRecord;
  fields: LooseRecord;
  ui: LooseRecord;
  state: WorkspaceStateRecord;
  regions: WorkspaceResolvedRegions;
}

export type WorkspaceNavigationItem = {
  id: string;
  label: string;
  href: string;
}

export type WorkspaceRegionRenderDefinition = {
  id: string;
  nodes: WorkspaceResolvedViewNode[];
  className: string;
  columnStart?: number;
  columnSpan?: number;
  rowStart?: number;
  rowSpan?: number;
}

export type WorkspaceComponentProps = {
  node: WorkspaceResolvedViewNode;
  interpreted: WorkspaceInterpretedView;
}

export type WorkspaceComponent = (props: WorkspaceComponentProps) => ReactElement;
