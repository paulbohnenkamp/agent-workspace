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
export { connectorDefinition, thread, run, event, participant, policies, permissions, workspaceView, packageSchema, project, agent, tool, skill, channel, connectorPackage, schedule, resource, sandbox, artifactType, };
export declare const packageSchemas: {
    project: {
        $schema: string;
        $id: string;
        allOf: ({
            $ref: string;
            type?: undefined;
            properties?: undefined;
        } | {
            type: string;
            properties: {
                kind: {
                    const: string;
                };
                agents: {
                    $ref: string;
                };
                resources: {
                    $ref: string;
                };
                connectors: {
                    $ref: string;
                };
                channels: {
                    $ref: string;
                };
                schedules: {
                    $ref: string;
                };
            };
            $ref?: undefined;
        })[];
        $defs: {
            refs: {
                type: string;
                items: {
                    type: string;
                    required: string[];
                    properties: {
                        id: {
                            type: string;
                            minLength: number;
                        };
                        name: {
                            type: string;
                        };
                        path: {
                            type: string;
                        };
                    };
                    additionalProperties: boolean;
                };
            };
        };
    };
    agent: {
        $schema: string;
        $id: string;
        allOf: ({
            $ref: string;
            type?: undefined;
            properties?: undefined;
        } | {
            type: string;
            properties: {
                kind: {
                    const: string;
                };
                instructions: {
                    type: string;
                };
                model: {
                    type: string;
                };
                tools: {
                    $ref: string;
                };
                skills: {
                    $ref: string;
                };
                connectors: {
                    $ref: string;
                };
                policies: {
                    $ref: string;
                };
            };
            $ref?: undefined;
        })[];
        $defs: {
            refs: {
                type: string;
                items: {
                    type: string;
                    required: string[];
                    properties: {
                        id: {
                            type: string;
                            minLength: number;
                        };
                        name: {
                            type: string;
                        };
                        path: {
                            type: string;
                        };
                    };
                    additionalProperties: boolean;
                };
            };
        };
    };
    tool: {
        $schema: string;
        $id: string;
        allOf: ({
            $ref: string;
            type?: undefined;
            properties?: undefined;
        } | {
            type: string;
            properties: {
                kind: {
                    const: string;
                };
                connector: {
                    $ref: string;
                };
                implementation: {
                    type: string;
                };
                parameters: {
                    type: string;
                };
                returns: {
                    type: string;
                };
                policy: {
                    type: string;
                };
            };
            $ref?: undefined;
        })[];
        $defs: {
            ref: {
                type: string;
                required: string[];
                properties: {
                    id: {
                        type: string;
                        minLength: number;
                    };
                    path: {
                        type: string;
                    };
                };
                additionalProperties: boolean;
            };
        };
    };
    skill: {
        $schema: string;
        $id: string;
        allOf: ({
            $ref: string;
            type?: undefined;
            properties?: undefined;
        } | {
            type: string;
            properties: {
                kind: {
                    const: string;
                };
                instructions: {
                    type: string;
                };
                tools: {
                    $ref: string;
                };
                skills: {
                    $ref: string;
                };
            };
            $ref?: undefined;
        })[];
        $defs: {
            refs: {
                type: string;
                items: {
                    type: string;
                    required: string[];
                    properties: {
                        id: {
                            type: string;
                            minLength: number;
                        };
                        path: {
                            type: string;
                        };
                    };
                    additionalProperties: boolean;
                };
            };
        };
    };
    channel: {
        $schema: string;
        $id: string;
        allOf: ({
            $ref: string;
            type?: undefined;
            properties?: undefined;
        } | {
            type: string;
            properties: {
                kind: {
                    const: string;
                };
                type: {
                    type: string;
                    minLength: number;
                };
                config: {
                    type: string;
                };
                implementation: {
                    type: string;
                };
            };
            $ref?: undefined;
        })[];
    };
    connector: {
        $schema: string;
        $id: string;
        allOf: ({
            $ref: string;
            type?: undefined;
            required?: undefined;
            properties?: undefined;
        } | {
            type: string;
            required: string[];
            properties: {
                kind: {
                    const: string;
                };
                type: {
                    type: string;
                    minLength: number;
                };
                mode: {
                    enum: string[];
                };
                auth: {
                    type: string;
                };
                config: {
                    type: string;
                };
                capabilities: {
                    type: string;
                    items: {
                        type: string;
                    };
                };
            };
            $ref?: undefined;
        })[];
    };
    schedule: {
        $schema: string;
        $id: string;
        allOf: ({
            $ref: string;
            type?: undefined;
            properties?: undefined;
        } | {
            type: string;
            properties: {
                kind: {
                    const: string;
                };
                type: {
                    type: string;
                    minLength: number;
                };
                trigger: {
                    type: string;
                };
                action: {
                    type: string;
                };
            };
            $ref?: undefined;
        })[];
    };
    resource: {
        $schema: string;
        $id: string;
        allOf: ({
            $ref: string;
            type?: undefined;
            properties?: undefined;
        } | {
            type: string;
            properties: {
                kind: {
                    const: string;
                };
                type: {
                    type: string;
                    minLength: number;
                };
                resource_type: {
                    type: string;
                    minLength: number;
                };
            };
            $ref?: undefined;
        })[];
    };
    sandbox: {
        $schema: string;
        $id: string;
        allOf: ({
            $ref: string;
            type?: undefined;
            properties?: undefined;
        } | {
            type: string;
            properties: {
                kind: {
                    const: string;
                };
                limits: {
                    type: string;
                };
                permissions: {
                    type: string;
                };
                environment: {
                    type: string;
                };
            };
            $ref?: undefined;
        })[];
    };
    'artifact-type': {
        $schema: string;
        $id: string;
        type: string;
        required: string[];
        properties: {
            kind: {
                const: string;
            };
            id: {
                type: string;
                minLength: number;
            };
            name: {
                type: string;
                minLength: number;
            };
            description: {
                type: string;
            };
            schema: {
                type: string;
            };
            structure: {
                type: string;
            };
        };
        additionalProperties: boolean;
    };
};
//# sourceMappingURL=index.d.ts.map