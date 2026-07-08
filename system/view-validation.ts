import type {
  LooseRecord,
  WorkspaceLayoutRegionDefinition,
  WorkspaceViewDefinition,
} from "../packages/types/src/workspace";

export interface WorkspaceViewValidationError {
  path: string;
  message: string;
}

function isPlainObject(value: unknown): value is LooseRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function pushError(errors: WorkspaceViewValidationError[], path: string, message: string): void {
  errors.push({ path, message });
}

function validateField(field: unknown, path: string, errors: WorkspaceViewValidationError[]): void {
  if (!isPlainObject(field)) {
    pushError(errors, path, "expected an object");
    return;
  }

  if (typeof field.name !== "string") {
    pushError(errors, `${path}.name`, "expected a string");
  }

  if (typeof field.source !== "string") {
    pushError(errors, `${path}.source`, "expected a string");
  }

  if (field.select != null && !isPlainObject(field.select)) {
    pushError(errors, `${path}.select`, "expected an object");
  }
}

function validateLayoutRegion(region: unknown, path: string, errors: WorkspaceViewValidationError[]): void {
  if (!isPlainObject(region)) {
    pushError(errors, path, "expected an object");
    return;
  }

  if (typeof region.id !== "string") {
    pushError(errors, `${path}.id`, "expected a string");
  }

  ["columnStart", "columnSpan", "rowStart", "rowSpan"].forEach((key) => {
    const value = region[key as keyof WorkspaceLayoutRegionDefinition] as unknown;

    if (value != null && (typeof value !== "number" || !Number.isInteger(value) || value < 1)) {
      pushError(errors, `${path}.${key}`, "expected a positive integer");
    }
  });
}

function validateLayout(layout: unknown, path: string, errors: WorkspaceViewValidationError[]): void {
  if (!isPlainObject(layout)) {
    pushError(errors, path, "expected an object");
    return;
  }

  if (layout.type !== "grid") {
    pushError(errors, `${path}.type`, "expected value 'grid'");
  }

  if (!Array.isArray(layout.columns) || layout.columns.length === 0 || !layout.columns.every((item) => typeof item === "string")) {
    pushError(errors, `${path}.columns`, "expected a non-empty array of strings");
  }

  if (layout.rows != null && !isStringArray(layout.rows)) {
    pushError(errors, `${path}.rows`, "expected an array of strings");
  }

  if (layout.gap != null && typeof layout.gap !== "string") {
    pushError(errors, `${path}.gap`, "expected a string");
  }

  if (!Array.isArray(layout.regions) || layout.regions.length === 0) {
    pushError(errors, `${path}.regions`, "expected a non-empty array");
    return;
  }

  layout.regions.forEach((region, index) => validateLayoutRegion(region, `${path}.regions[${index}]`, errors));
}

function validateViewNode(node: unknown, path: string, errors: WorkspaceViewValidationError[]): void {
  if (!isPlainObject(node)) {
    pushError(errors, path, "expected an object");
    return;
  }

  if (typeof node.component !== "string") {
    pushError(errors, `${path}.component`, "expected a string");
  }

  if (node.title != null && typeof node.title !== "string") {
    pushError(errors, `${path}.title`, "expected a string");
  }

  if (node.tabs != null && !isStringArray(node.tabs)) {
    pushError(errors, `${path}.tabs`, "expected an array of strings");
  }

  if (node.actions != null && !isStringArray(node.actions)) {
    pushError(errors, `${path}.actions`, "expected an array of strings");
  }

  if (node.bind != null && !isPlainObject(node.bind)) {
    pushError(errors, `${path}.bind`, "expected an object");
  }
}

function validateRegions(view: WorkspaceViewDefinition, errors: WorkspaceViewValidationError[]): void {
  if (!isPlainObject(view.layout) || !Array.isArray(view.layout.regions)) {
    return;
  }

  const layoutRegionIds = new Set(view.layout.regions.map((region) => region.id));
  const declaredRegionIds = new Set(Object.keys(view.regions ?? {}));

  layoutRegionIds.forEach((regionId) => {
    if (!declaredRegionIds.has(regionId)) {
      pushError(errors, `regions.${regionId}`, "missing region nodes for declared layout region");
    }
  });

  declaredRegionIds.forEach((regionId) => {
    if (!layoutRegionIds.has(regionId)) {
      pushError(errors, `regions.${regionId}`, "region is not declared in layout.regions");
    }
  });

  Object.entries(view.regions ?? {}).forEach(([regionId, nodes]) => {
    if (!Array.isArray(nodes)) {
      pushError(errors, `regions.${regionId}`, "expected an array");
      return;
    }

    nodes.forEach((node, index) => validateViewNode(node, `regions.${regionId}[${index}]`, errors));
  });
}

export function validateWorkspaceView(view: unknown): WorkspaceViewValidationError[] {
  const errors: WorkspaceViewValidationError[] = [];

  if (!isPlainObject(view)) {
    pushError(errors, "", "expected an object");
    return errors;
  }

  if (typeof view.id !== "string") {
    pushError(errors, "id", "expected a string");
  }

  if (typeof view.title !== "string") {
    pushError(errors, "title", "expected a string");
  }

  if (typeof view.route !== "string") {
    pushError(errors, "route", "expected a string");
  }

  if (view.description != null && typeof view.description !== "string") {
    pushError(errors, "description", "expected a string");
  }

  if (view.shell != null) {
    if (!isPlainObject(view.shell)) {
      pushError(errors, "shell", "expected an object");
    } else {
      if (view.shell.type != null && typeof view.shell.type !== "string") {
        pushError(errors, "shell.type", "expected a string");
      }

      if (view.shell.header != null && !isPlainObject(view.shell.header)) {
        pushError(errors, "shell.header", "expected an object");
      } else if (isPlainObject(view.shell.header) && view.shell.header.component != null && typeof view.shell.header.component !== "string") {
        pushError(errors, "shell.header.component", "expected a string");
      }

      if (view.shell.chrome != null && !isPlainObject(view.shell.chrome)) {
        pushError(errors, "shell.chrome", "expected an object");
      } else if (isPlainObject(view.shell.chrome)) {
        if (view.shell.chrome.leftNav != null && typeof view.shell.chrome.leftNav !== "boolean") {
          pushError(errors, "shell.chrome.leftNav", "expected a boolean");
        }

        if (view.shell.chrome.topTabs != null && !isStringArray(view.shell.chrome.topTabs)) {
          pushError(errors, "shell.chrome.topTabs", "expected an array of strings");
        }
      }
    }
  }

  if (view.context != null && !isPlainObject(view.context)) {
    pushError(errors, "context", "expected an object");
  }

  if (view.fields != null) {
    if (!Array.isArray(view.fields)) {
      pushError(errors, "fields", "expected an array");
    } else {
      view.fields.forEach((field, index) => validateField(field, `fields[${index}]`, errors));
    }
  }

  validateLayout(view.layout, "layout", errors);
  validateRegions(view as unknown as WorkspaceViewDefinition, errors);

  return errors;
}

export function formatWorkspaceViewValidationErrors(
  viewId: string,
  errors: WorkspaceViewValidationError[],
): string {
  const details = errors
    .map((error) => (error.path ? `${error.path}: ${error.message}` : error.message))
    .join("; ");

  return `Invalid workspace view "${viewId}": ${details}`;
}
