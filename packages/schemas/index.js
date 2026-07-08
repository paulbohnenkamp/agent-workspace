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
exports.workspaceView = exports.permissions = exports.policies = exports.participant = exports.event = exports.run = exports.thread = exports.connectorDefinition = void 0;
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
//# sourceMappingURL=index.js.map