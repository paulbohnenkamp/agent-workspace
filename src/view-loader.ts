import fs from "fs";
import path from "path";

import { createDefaultComponentRegistry } from "./ComponentRegistry";
import type { WorkspaceViewDefinition } from "../packages/types/src/workspace";
import {
  formatWorkspaceViewValidationErrors,
  validateWorkspaceView,
  validateWorkspaceViewComponents,
} from "./view-validation";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function deepMerge<T>(base: T, override: unknown): T {
  if (Array.isArray(base) || Array.isArray(override)) {
    return override as T;
  }

  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override as T;
  }

  const result: Record<string, unknown> = { ...base };

  Object.entries(override).forEach(([key, value]) => {
    if (key === "extends" || key === "renderer") {
      return;
    }

    result[key] = key in result ? deepMerge(result[key], value) : value;
  });

  return result as T;
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function loadView(projectRoot: string, viewId: string, renderer = "react"): WorkspaceViewDefinition {
  const registry = createDefaultComponentRegistry();
  const viewDirectory = path.join(projectRoot, "views", viewId);
  const basePath = path.join(viewDirectory, "view.json");

  if (!fs.existsSync(basePath)) {
    throw new Error(`View not found: ${viewId}`);
  }

  const baseView = readJson<WorkspaceViewDefinition>(basePath);
  const baseErrors = validateWorkspaceView(baseView);
  const baseComponentErrors = validateWorkspaceViewComponents(baseView, registry);

  if (baseErrors.length > 0 || baseComponentErrors.length > 0) {
    throw new Error(
      formatWorkspaceViewValidationErrors(`${viewId}/view.json`, [...baseErrors, ...baseComponentErrors]),
    );
  }

  const rendererPath = path.join(viewDirectory, renderer, "view.json");

  if (!fs.existsSync(rendererPath)) {
    return baseView;
  }

  const rendererView = readJson<Partial<WorkspaceViewDefinition>>(rendererPath);
  const mergedView = deepMerge(baseView, rendererView);
  const mergedErrors = validateWorkspaceView(mergedView);
  const mergedComponentErrors = validateWorkspaceViewComponents(mergedView, registry);

  if (mergedErrors.length > 0 || mergedComponentErrors.length > 0) {
    throw new Error(
      formatWorkspaceViewValidationErrors(`${viewId}/${renderer}/view.json`, [
        ...mergedErrors,
        ...mergedComponentErrors,
      ]),
    );
  }

  return mergedView;
}
