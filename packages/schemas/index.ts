/**
 * Schema exports for Agent Workspace Platform
 *
 * This module provides access to all canonical JSON schemas used in the platform.
 * Schemas define the structure and constraints for definitions, runtime objects,
 * and interpreter outputs.
 */

import connectorDefinition from "./connector.schema.json";
import thread from "./thread.schema.json";
import run from "./run.schema.json";
import event from "./event.schema.json";
import participant from "./participant.schema.json";
import policies from "./policies.schema.json";
import permissions from "./permissions.schema.json";
import workspaceView from "./workspace-view.schema.json";

export {
  connectorDefinition,
  thread,
  run,
  event,
  participant,
  policies,
  permissions,
  workspaceView,
};
