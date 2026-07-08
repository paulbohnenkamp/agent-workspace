import type {
  LooseRecord,
  WorkspaceFieldDefinition,
  WorkspaceInterpretedView,
  WorkspaceResolvedRegions,
  WorkspaceResolvedViewNode,
  WorkspaceStateRecord,
  WorkspaceViewDefinition,
  WorkspaceViewNodeDefinition,
} from "../packages/types/src/workspace";

function getByPath(object: unknown, path: string): unknown {
  const normalized = path.replace(/\[(\d+)\]/g, ".$1");

  return normalized.split(".").reduce<unknown>((current, segment) => {
    if (segment === "$fields" || segment === "$route" || segment === "$ui") {
      return current;
    }

    if (current == null || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[segment];
  }, object);
}

function evaluateString(expression: unknown, context: Context): unknown {
  if (typeof expression !== "string") {
    return expression;
  }

  const directMatch = expression.match(/^\$(route|fields|ui)\.([A-Za-z0-9_.]+)$/);

  if (directMatch) {
    const [, scope, valuePath] = directMatch;
    const source = scope === "route" ? context.route : scope === "fields" ? context.fields : context.ui;
    return getByPath(source, valuePath);
  }

  if (expression.includes("$route.") || expression.includes("$fields.") || expression.includes("$ui.")) {
    return expression.replace(/\$(route|fields|ui)\.([A-Za-z0-9_.]+)/g, (_match, scope, valuePath) => {
      const source = scope === "route" ? context.route : scope === "fields" ? context.fields : context.ui;
      const resolved = getByPath(source, valuePath);
      return resolved == null ? "" : String(resolved);
    });
  }

  return expression;
}

function evaluateTemplate<T>(value: T, context: Context): T {
  if (Array.isArray(value)) {
    return value.map((item) => evaluateTemplate(item, context)) as T;
  }

  if (value && typeof value === "object") {
    const next: LooseRecord = {};

    Object.entries(value as Record<string, unknown>).forEach(([key, entry]) => {
      next[key] = evaluateTemplate(entry, context);
    });

    return next as T;
  }

  return evaluateString(value, context) as T;
}

function filterProjectionItems(list: unknown, criteria: LooseRecord): LooseRecord[] {
  if (!Array.isArray(list)) {
    return [];
  }

  return list.filter((item) => {
    if (!item || typeof item !== "object") {
      return false;
    }

    return Object.entries(criteria).every(([key, value]) => (item as LooseRecord)[key] === value);
  }) as LooseRecord[];
}

interface Context {
  state: WorkspaceStateRecord;
  route: LooseRecord;
  fields: LooseRecord;
  ui: LooseRecord;
}

function resolveField(field: WorkspaceFieldDefinition, context: Context): unknown {
  if (field.source.startsWith("$")) {
    return evaluateString(field.source, context);
  }

  if (field.source.startsWith("projection.")) {
    const projectionName = field.source.slice("projection.".length);
    const projection = context.state[projectionName];
    const selection = field.select ? evaluateTemplate(field.select, context) : undefined;

    if (!selection || typeof selection !== "object") {
      return projection;
    }

    const matches = filterProjectionItems(projection, selection as LooseRecord);
    return matches.length <= 1 ? matches[0] : matches;
  }

  return field.defaultValue;
}

function resolveFields(view: WorkspaceViewDefinition, context: Omit<Context, "fields">): LooseRecord {
  const resolved: LooseRecord = {};

  (view.fields ?? []).forEach((field) => {
    resolved[field.name] = resolveField(field, {
      ...context,
      fields: resolved,
    });
  });

  return resolved;
}

function resolveBind(bind: LooseRecord | undefined, context: Context): LooseRecord {
  const evaluated = evaluateTemplate(bind ?? {}, context);

  if (!evaluated || typeof evaluated !== "object") {
    return {};
  }

  const resolved = { ...evaluated } as LooseRecord;
  const projectionName = typeof resolved.projection === "string" ? resolved.projection : undefined;

  if (!projectionName) {
    return resolved;
  }

  const projection = context.state[projectionName];
  const filter = resolved.filter && typeof resolved.filter === "object" ? (resolved.filter as LooseRecord) : undefined;

  if (!Array.isArray(projection)) {
    resolved.projection = projection;
    return resolved;
  }

  if (filter) {
    resolved.projection = filterProjectionItems(projection, filter);
  } else {
    resolved.projection = projection;
  }

  return resolved;
}

function normalizeDeclaredRegions(view: WorkspaceViewDefinition): Record<string, WorkspaceViewNodeDefinition[]> {
  return view.regions ?? {};
}

export function interpretView(
  view: WorkspaceViewDefinition,
  state: WorkspaceStateRecord,
  route: LooseRecord,
): WorkspaceInterpretedView {
  const ui: LooseRecord = {
    selectedApproval: Array.isArray(state.approval_state) ? state.approval_state[0] ?? null : null,
  };

  const context = evaluateTemplate(view.context ?? {}, {
    state,
    route,
    fields: {},
    ui,
  });

  const fields = resolveFields(view, {
    state,
    route,
    ui,
  });

  const declaredRegions = normalizeDeclaredRegions(view);
  const regions: WorkspaceResolvedRegions = {};

  Object.entries(declaredRegions).forEach(([regionId, nodes]) => {
    regions[regionId] = nodes.map<WorkspaceResolvedViewNode>((node) => ({
      ...node,
      bind: resolveBind(node.bind, {
        state,
        route,
        fields,
        ui,
      }),
    }));
  });

  return {
    view,
    route,
    context,
    fields,
    ui,
    state,
    regions,
  };
}
