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
import packageSchema from "./package.schema.json";
import project from "./project.schema.json";
import agent from "./agent.schema.json";
import tool from "./tool.schema.json";
import skill from "./skill.schema.json";
import channel from "./channel.schema.json";
import connectorPackage from "./connector-package.schema.json";
import schedule from "./schedule.schema.json";
import resource from "./resource.schema.json";
import sandbox from "./sandbox.schema.json";
import artifactType from "./artifact-type.schema.json";

export {
  connectorDefinition,
  thread,
  run,
  event,
  participant,
  policies,
  permissions,
  workspaceView,
  packageSchema,
  project,
  agent,
  tool,
  skill,
  channel,
  connectorPackage,
  schedule,
  resource,
  sandbox,
  artifactType,
};

export const packageSchemas = {
  project,
  agent,
  tool,
  skill,
  channel,
  connector: connectorPackage,
  schedule,
  resource,
  sandbox,
  'artifact-type': artifactType,
};
