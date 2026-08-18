import http from 'http';
import fs from 'fs';
import path from 'path';
import { parse as parseYaml } from 'yaml';

import type { WorkspaceStateRecord } from '../packages/types/src/workspace';
import { asActionBody, LandDemoStore } from './data/land-project-state';
import { interpretView } from './interpreter';
import { renderWorkspace } from './render-workspace';
import { loadView } from './view-loader';
import { landDefaultMatterIds, landNavigation, landPath, landRouteSegments, landViewIds } from './land-workspace';

const projectRoot = path.join(process.cwd(), 'docs', 'examples', 'land-project');
const store = new LandDemoStore();
const projectDefinition = parseYaml(
  fs.readFileSync(path.join(projectRoot, 'project.yaml'), 'utf8'),
) as { id: string; name: string };

function send(response: http.ServerResponse, statusCode: number, body: string, type = 'text/html'): void {
  response.writeHead(statusCode, { 'content-type': `${type}; charset=utf-8` });
  response.end(body);
}

function currentState(): WorkspaceStateRecord {
  const state = store.getState();
  return {
    ...state,
    project: {
      ...state.project,
      id: projectDefinition.id,
      name: projectDefinition.name,
      title: 'Land Workspace',
    },
  };
}

function routeFor(request: http.IncomingMessage, viewId: string): Record<string, string> {
  const url = new URL(request.url ?? '/', 'http://localhost');
  return { matterId: url.searchParams.get('matterId') ?? landDefaultMatterIds[viewId] };
}

function readBody(request: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk: Buffer) => { body += chunk.toString(); });
    request.on('end', () => resolve(body));
    request.on('error', reject);
  });
}

function bodyString(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback;
}

function renderView(request: http.IncomingMessage, response: http.ServerResponse, viewId: string): void {
  try {
    const view = loadView(projectRoot, viewId, 'react');
    const state = currentState();
    const interpreted = interpretView(view, state, routeFor(request, viewId));
    send(response, 200, renderWorkspace(interpreted, landNavigation()));
  } catch (error) {
    send(response, 500, `<pre>${String((error as Error).stack ?? error)}</pre>`);
  }
}

async function handleRequest(request: http.IncomingMessage, response: http.ServerResponse): Promise<void> {
  const url = new URL(request.url ?? '/', 'http://localhost');

  if (request.method === 'POST' && url.pathname === '/land/actions') {
    try {
      const body = asActionBody(await readBody(request));
      const event = store.applyAction(
        bodyString(body.actionId, 'record-administrative-follow-up'),
        bodyString(body.targetId, 'unknown'),
      );
      const actionViewId = url.searchParams.get('viewId') ?? 'land-portfolio';
      response.writeHead(303, { location: landPath(actionViewId, event.targetId) });
      response.end();
    } catch (error) {
      send(response, 400, `<pre>${String(error)}</pre>`);
    }
    return;
  }

  if (url.pathname === '/api/land/views') {
    send(response, 200, JSON.stringify({ project: currentState().project, views: landViewIds }, null, 2), 'application/json');
    return;
  }

  if (url.pathname === '/api/land/state') {
    send(response, 200, JSON.stringify({ state: currentState(), events: store.getEvents() }, null, 2), 'application/json');
    return;
  }

  if (url.pathname === '/land' || url.pathname === '/land/') {
    response.writeHead(302, { location: landPath(landViewIds[0], landDefaultMatterIds[landViewIds[0]]) });
    response.end();
    return;
  }

  const routeSegment = url.pathname.startsWith('/land/') ? url.pathname.slice('/land/'.length) : '';
  const viewId = Object.entries(landRouteSegments).find(([, segment]) => segment === routeSegment)?.[0] ?? '';
  if ((landViewIds as readonly string[]).includes(viewId)) {
    renderView(request, response, viewId);
    return;
  }

  send(response, 404, '<h1>Not Found</h1>');
}

const server = http.createServer((request, response) => {
  void handleRequest(request, response);
});

const port = Number(process.env.LAND_PORT ?? '4020');
const host = '127.0.0.1';
server.listen(port, host, () => {
  console.log(`Land workspace server running at http://${host}:${port}`);
});
