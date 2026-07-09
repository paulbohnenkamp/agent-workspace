import React from "react";

import type { WorkspaceComponent, WorkspaceComponentProps } from "../packages/types/src/workspace";
import { Actions } from "./components/Actions";
import { BadgePrimitive } from "./components/BadgePrimitive";
import { CanvasPrimitive } from "./components/CanvasPrimitive";
import { CardPrimitive } from "./components/CardPrimitive";
import { Composer } from "./components/Composer";
import { DividerPrimitive } from "./components/DividerPrimitive";
import { DocumentPrimitive } from "./components/DocumentPrimitive";
import { GridPrimitive } from "./components/GridPrimitive";
import { Header } from "./components/Header";
import { ListPrimitive } from "./components/ListPrimitive";
import { PanelPrimitive } from "./components/PanelPrimitive";
import { Queue } from "./components/Queue";
import { RailPrimitive } from "./components/RailPrimitive";
import { SectionPrimitive } from "./components/SectionPrimitive";
import { ShellPrimitive } from "./components/ShellPrimitive";
import { Sources } from "./components/Sources";
import { StackPrimitive } from "./components/StackPrimitive";
import { StatusList } from "./components/StatusList";
import { SummaryCard } from "./components/SummaryCard";
import { Tabs } from "./components/Tabs";
import { TextPrimitive } from "./components/TextPrimitive";
import { Timeline } from "./components/Timeline";
import { ToolbarPrimitive } from "./components/ToolbarPrimitive";

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
  registry.register("shell", ShellPrimitive);
  registry.register("panel", PanelPrimitive);
  registry.register("rail", RailPrimitive);
  registry.register("canvas", CanvasPrimitive);
  registry.register("section", SectionPrimitive);
  registry.register("stack", StackPrimitive);
  registry.register("grid", GridPrimitive);
  registry.register("toolbar", ToolbarPrimitive);
  registry.register("card", CardPrimitive);
  registry.register("text", TextPrimitive);
  registry.register("divider", DividerPrimitive);
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
