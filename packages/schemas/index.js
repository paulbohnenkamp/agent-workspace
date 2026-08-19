"use strict";
/**
 * Schema exports for Agent Workspace Platform
 *
 * This module provides access to all canonical JSON schemas used in the platform.
 * Schemas define the structure and constraints for definitions, runtime objects,
 * and interpreter outputs.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageSchemas = exports.artifactType = exports.sandbox = exports.resource = exports.schedule = exports.connectorPackage = exports.channel = exports.skill = exports.tool = exports.agent = exports.project = exports.packageSchema = exports.workspaceView = exports.permissions = exports.policies = exports.participant = exports.event = exports.run = exports.thread = exports.connectorDefinition = void 0;
const connector_schema_json_1 = __importDefault(require("./connector.schema.json"));
exports.connectorDefinition = connector_schema_json_1.default;
const thread_schema_json_1 = __importDefault(require("./thread.schema.json"));
exports.thread = thread_schema_json_1.default;
const run_schema_json_1 = __importDefault(require("./run.schema.json"));
exports.run = run_schema_json_1.default;
const event_schema_json_1 = __importDefault(require("./event.schema.json"));
exports.event = event_schema_json_1.default;
const participant_schema_json_1 = __importDefault(require("./participant.schema.json"));
exports.participant = participant_schema_json_1.default;
const policies_schema_json_1 = __importDefault(require("./policies.schema.json"));
exports.policies = policies_schema_json_1.default;
const permissions_schema_json_1 = __importDefault(require("./permissions.schema.json"));
exports.permissions = permissions_schema_json_1.default;
const workspace_view_schema_json_1 = __importDefault(require("./workspace-view.schema.json"));
exports.workspaceView = workspace_view_schema_json_1.default;
const package_schema_json_1 = __importDefault(require("./package.schema.json"));
exports.packageSchema = package_schema_json_1.default;
const project_schema_json_1 = __importDefault(require("./project.schema.json"));
exports.project = project_schema_json_1.default;
const agent_schema_json_1 = __importDefault(require("./agent.schema.json"));
exports.agent = agent_schema_json_1.default;
const tool_schema_json_1 = __importDefault(require("./tool.schema.json"));
exports.tool = tool_schema_json_1.default;
const skill_schema_json_1 = __importDefault(require("./skill.schema.json"));
exports.skill = skill_schema_json_1.default;
const channel_schema_json_1 = __importDefault(require("./channel.schema.json"));
exports.channel = channel_schema_json_1.default;
const connector_package_schema_json_1 = __importDefault(require("./connector-package.schema.json"));
exports.connectorPackage = connector_package_schema_json_1.default;
const schedule_schema_json_1 = __importDefault(require("./schedule.schema.json"));
exports.schedule = schedule_schema_json_1.default;
const resource_schema_json_1 = __importDefault(require("./resource.schema.json"));
exports.resource = resource_schema_json_1.default;
const sandbox_schema_json_1 = __importDefault(require("./sandbox.schema.json"));
exports.sandbox = sandbox_schema_json_1.default;
const artifact_type_schema_json_1 = __importDefault(require("./artifact-type.schema.json"));
exports.artifactType = artifact_type_schema_json_1.default;
exports.packageSchemas = {
    project: project_schema_json_1.default,
    agent: agent_schema_json_1.default,
    tool: tool_schema_json_1.default,
    skill: skill_schema_json_1.default,
    channel: channel_schema_json_1.default,
    connector: connector_package_schema_json_1.default,
    schedule: schedule_schema_json_1.default,
    resource: resource_schema_json_1.default,
    sandbox: sandbox_schema_json_1.default,
    'artifact-type': artifact_type_schema_json_1.default,
};
//# sourceMappingURL=index.js.map