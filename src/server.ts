import http from "http";
import fs from "fs";
import path from "path";

import { parse as parseYaml } from "yaml";

import type { WorkspaceNavigationItem, WorkspaceStateRecord } from "../packages/types/src/workspace";
import { hiringProjectState } from "./data/hiring-project-state";
import { interpretView } from "./interpreter";
import { renderWorkspace } from "./render-workspace";
import { loadView } from "./view-loader";

const projectRoot = path.join(process.cwd(), "docs", "examples", "hiring-project");
const projectDefinition = parseYaml(
  fs.readFileSync(path.join(projectRoot, "project.yaml"), "utf8"),
) as { id: string; name: string };

const state: WorkspaceStateRecord = {
  ...hiringProjectState,
  project: {
    ...hiringProjectState.project,
    id: projectDefinition.id,
    name: projectDefinition.name,
    title: "Hiring Workspace",
  },
};

function send(response: http.ServerResponse, statusCode: number, body: string, type = "text/html"): void {
  response.writeHead(statusCode, {
    "content-type": `${type}; charset=utf-8`,
  });
  response.end(body);
}

function normalizeViewId(urlPath: string): string | null {
  const segments = urlPath.split("/").filter(Boolean);

  if (segments[0] !== "hiring") {
    return null;
  }

  return segments[1] || "candidate-review";
}

function createNavigation(basePath = ""): WorkspaceNavigationItem[] {
  return [
    {
      id: "open-roles-board",
      label: "Open Roles Board",
      href: `${basePath}/hiring/open-roles-board`,
    },
    {
      id: "candidate-review",
      label: "Candidate Review",
      href: `${basePath}/hiring/candidate-review?candidateId=avery-chen`,
    },
    {
      id: "approval-queue",
      label: "Approval Queue",
      href: `${basePath}/hiring/approval-queue`,
    },
  ];
}

function handleView(request: http.IncomingMessage, response: http.ServerResponse, viewId: string): void {
  const route = Object.fromEntries(new URL(request.url ?? "/", "http://localhost").searchParams.entries());
  route.candidateId = route.candidateId ?? "avery-chen";

  try {
    const view = loadView(projectRoot, viewId, "react");
    const interpreted = interpretView(view, state, route);
    const html = renderWorkspace(interpreted, createNavigation(""));
    send(response, 200, html);
  } catch (error) {
    send(response, 500, `<pre>${String((error as Error).stack ?? error)}</pre>`);
  }
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost");

  if (url.pathname === "/") {
    response.writeHead(302, {
      location: "/hiring/candidate-review?candidateId=avery-chen",
    });
    response.end();
    return;
  }

  if (url.pathname === "/api/views") {
    send(
      response,
      200,
      JSON.stringify(
        {
          project: state.project,
          views: ["candidate-review", "open-roles-board", "approval-queue"],
        },
        null,
        2,
      ),
      "application/json",
    );
    return;
  }

  const viewId = normalizeViewId(url.pathname);

  if (viewId) {
    handleView(request, response, viewId);
    return;
  }

  send(response, 404, "<h1>Not Found</h1>");
});

const port = Number(process.env.PORT ?? "4010");
const host = "127.0.0.1";

server.listen(port, host, () => {
  console.log(`System server running at http://${host}:${port}`);
});
