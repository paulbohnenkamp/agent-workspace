import React from "react";

import type {
  WorkspaceInterpretedView,
  WorkspaceRegionRenderDefinition,
  WorkspaceResolvedViewNode,
  WorkspaceTrackSize,
} from "../packages/types/src/workspace";
import type { ComponentRegistry } from "./ComponentRegistry";

function normalizeTrackSize(value: WorkspaceTrackSize): string {
  return value;
}

function buildDeclaredRegions(interpreted: WorkspaceInterpretedView): WorkspaceRegionRenderDefinition[] {
  const { view, regions } = interpreted;
  return view.layout.regions.map((region) => ({
    id: region.id,
    nodes: regions[region.id] ?? [],
    className: `workspace-region workspace-region--${region.id}`,
    columnStart: region.columnStart,
    columnSpan: region.columnSpan,
    rowStart: region.rowStart,
    rowSpan: region.rowSpan,
  }));
}

export class LayoutBuilder {
  constructor(
    private readonly interpreted: WorkspaceInterpretedView,
    private readonly registry: ComponentRegistry,
  ) {}

  render(): React.ReactElement {
    const regions = buildDeclaredRegions(this.interpreted);
    const templateColumns = this.interpreted.view.layout.columns.map(normalizeTrackSize).join(" ");
    const templateRows = this.interpreted.view.layout.rows?.map(normalizeTrackSize).join(" ");
    const gap = this.interpreted.view.layout.gap ?? "1rem";

    return (
      <main
        className={`workspace-body workspace-body--${this.interpreted.view.layout.type}`}
        style={{
          gridTemplateColumns: templateColumns,
          gridTemplateRows: templateRows,
          gap,
        }}
      >
        {regions.map((region) => (
          <section
            className={region.className}
            key={region.id}
            style={{
              gridColumn: region.columnStart
                ? `${region.columnStart} / span ${region.columnSpan ?? 1}`
                : undefined,
              gridRow: region.rowStart
                ? `${region.rowStart} / span ${region.rowSpan ?? 1}`
                : undefined,
            }}
          >
            {region.nodes.map((node: WorkspaceResolvedViewNode, index: number) => (
              <React.Fragment key={`${region.id}-${node.component}-${index}`}>
                {this.registry.renderNode({
                  node,
                  interpreted: this.interpreted,
                })}
              </React.Fragment>
            ))}
          </section>
        ))}
      </main>
    );
  }
}
