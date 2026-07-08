import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import type { WorkspaceInterpretedView, WorkspaceNavigationItem } from "../packages/types/src/workspace";
import { createDefaultComponentRegistry } from "./ComponentRegistry";
import { LayoutBuilder } from "./LayoutBuilder";
import { WorkspaceShell, workspaceStyles } from "./WorkspaceShell";

export function renderWorkspace(
  interpreted: WorkspaceInterpretedView,
  navigation: WorkspaceNavigationItem[],
): string {
  const registry = createDefaultComponentRegistry();
  const layout = new LayoutBuilder(interpreted, registry);

  const markup = renderToStaticMarkup(
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{`${interpreted.state.project.title} · ${interpreted.view.title}`}</title>
        <style>{workspaceStyles()}</style>
      </head>
      <body>
        <WorkspaceShell interpreted={interpreted} navigation={navigation}>
          {layout.render()}
        </WorkspaceShell>
      </body>
    </html>,
  );

  return `<!doctype html>${markup}`;
}
