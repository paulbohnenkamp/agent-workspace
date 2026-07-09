/**
 * ProjectRuntime - primary runtime container for project execution
 */

import { randomUUID } from 'crypto';
import {
  Agent,
  Tool,
  Skill,
  Run,
  Artifact,
  Thread,
  Resource,
  Participant,
  Event,
  Schedule,
} from '@awp/types';
import { PackageRegistry } from '@awp/loader';
import {
  ProjectState,
  ProjectInitOptions,
  RunRequest,
  RunResult,
  ExecutionOptions,
  ArtifactRecord,
  ThreadRecord,
  ProjectStats,
} from './types';
import { applyEventToProjectState } from './event-projection';

/**
 * ProjectRuntime - manages project execution and state
 */
export class ProjectRuntime {
  private contexts = new Map<string, ProjectState>();
  private registry: PackageRegistry;

  constructor(registry: PackageRegistry) {
    this.registry = registry;
  }

  private appendEvent(context: ProjectState, event: Event): void {
    context.events.push(event);
    applyEventToProjectState(context, event);
  }

  /**
   * Initialize a project context
   */
  initializeProject(options: ProjectInitOptions): Promise<ProjectState> {
    const projectId = options.project.id;

    // Create context
    const context: ProjectState = {
      project: options.project,
      agents: [],
      resources: [],
      artifacts: new Map(),
      threads: new Map(),
      runs: new Map(),
      agentSessions: new Map(),
      participants: new Map(),
      events: [],
      schedules: [],
      metadata: options.metadata,
    };

    // Load agents
    if (options.project.agents) {
      for (const agentRef of options.project.agents) {
        const agent = this.registry.get<Agent>(agentRef.id);
        if (agent) {
          const tools = this.registry.resolveTools(agent);
          const skills = this.registry.resolveSkills(agent);

          context.agents.push({
            agent,
            tools,
            skills,
            status: 'idle',
          });
        }
      }
    }

    // Store context early so initialization can emit canonical events
    this.contexts.set(projectId, context);

    // Load resources declared by the project definition
    if (options.project.resources) {
      for (const resourceRef of options.project.resources) {
        const resource = this.registry.get<Resource>(resourceRef.id);
        if (resource) {
          this.addResource(projectId, resource);
        }
      }
    }

    // Load resources provided at initialization time
    if (options.resources) {
      for (const resource of options.resources) {
        this.addResource(projectId, resource);
      }
    }

    // Load schedules
    if (options.project.schedules) {
      for (const scheduleRef of options.project.schedules) {
        const schedule = this.registry.get<Schedule>(scheduleRef.id);
        if (schedule) {
          context.schedules.push({
            schedule,
            active: false,
            executionCount: 0,
          });
        }
      }
    }

    // Add participants
    if (options.participants) {
      for (const participant of options.participants) {
        this.addParticipant(projectId, participant);
      }
    }

    return Promise.resolve(context);
  }

  /**
   * Get project context
   */
  getProjectState(projectId: string): ProjectState | undefined {
    return this.contexts.get(projectId);
  }

  /**
   * Execute a run request
   */
  async executeRun(
    projectId: string,
    request: RunRequest,
    _options?: ExecutionOptions,
  ): Promise<RunResult> {
    void _options;
    const context = this.contexts.get(projectId);
    if (!context) {
      throw new Error(`Project not found: ${projectId}`);
    }

    const runId = randomUUID();
    const now = new Date().toISOString();

    // Create run record
    const run: Run = {
      id: runId,
      projectId,
      agentId: request.targetKind === 'agent' ? request.targetId : undefined,
      status: 'running',
      startedAt: now,
      targetKind: request.targetKind,
      targetId: request.targetId,
      threadId: request.threadId,
      input: request.input,
      metadata: request.metadata,
    };

    // Emit started event
    const startEvent: Event = {
      id: randomUUID(),
      name: 'run.started',
      timestamp: now,
      projectId,
      runId,
      payload: {
        run: {
          ...run,
          metadata: {
            ...run.metadata,
            triggeredBy: request.triggeredBy,
          },
        },
      },
    };
    this.appendEvent(context, startEvent);

    try {
      // Execute based on target kind
      let output: Record<string, unknown> | undefined;
      const artifactsCreated: string[] = [];

      switch (request.targetKind) {
        case 'tool':
          output = await this.executeTool(context, request.targetId, request.input);
          break;

        case 'skill':
          output = await this.executeSkill(context, request.targetId, request.input);
          break;

        case 'agent':
          output = await this.executeAgent(context, request.targetId, request.input);
          break;

        case 'schedule':
          output = await this.executeSchedule(context, request.targetId);
          break;
      }

      const completedRun: Run = {
        ...run,
        status: 'succeeded',
        completedAt: new Date().toISOString(),
        output,
        metadata: {
          ...run.metadata,
          triggeredBy: request.triggeredBy,
        },
      };

      // Emit succeeded event
      const successEvent: Event = {
        id: randomUUID(),
        name: 'run.succeeded',
        timestamp: completedRun.completedAt!,
        projectId,
        runId,
        payload: { run: completedRun },
      };
      this.appendEvent(context, successEvent);

      return {
        run: context.runs.get(runId)!,
        success: true,
        artifactsCreated,
        events: [startEvent, successEvent],
      };
    } catch (error) {
      // Update run with error
      const failedRun: Run = {
        ...run,
        status: 'failed',
        completedAt: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
        metadata: {
          ...run.metadata,
          triggeredBy: request.triggeredBy,
        },
      };

      // Emit failed event
      const failEvent: Event = {
        id: randomUUID(),
        name: 'run.failed',
        timestamp: failedRun.completedAt!,
        projectId,
        runId,
        payload: { run: failedRun },
      };
      this.appendEvent(context, failEvent);

      return {
        run: context.runs.get(runId)!,
        success: false,
        error: failedRun.error,
        artifactsCreated: [],
        events: [startEvent, failEvent],
      };
    }
  }

  /**
   * Execute a tool
   */
  private executeTool(
    context: ProjectState,
    toolId: string,
    input?: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const tool = this.registry.get<Tool>(toolId);
    if (!tool) {
      throw new Error(`Tool not found: ${toolId}`);
    }

    // Simulate tool execution
    return Promise.resolve({
      toolId: tool.id,
      result: `Executed tool: ${tool.name}`,
      input,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Execute a skill
   */
  private async executeSkill(
    context: ProjectState,
    skillId: string,
    input?: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const skill = this.registry.get<Skill>(skillId);
    if (!skill) {
      throw new Error(`Skill not found: ${skillId}`);
    }

    // Skill might use tools
    const tools = this.registry.resolveTools(skill);
    const result: {
      skillId: string;
      toolsUsed: string[];
      toolResults?: Record<string, Record<string, unknown>>;
      errors?: Record<string, string>;
    } = {
      skillId: skill.id,
      toolsUsed: tools.map((t) => t.id),
    };

    // Execute each tool
    for (const tool of tools) {
      try {
        const toolResult = await this.executeTool(context, tool.id, input);
        result.toolResults = result.toolResults ?? {};
        result.toolResults[tool.id] = toolResult;
      } catch (error) {
        // Tool execution failed
        result.errors = result.errors ?? {};
        result.errors[tool.id] = error instanceof Error ? error.message : String(error);
      }
    }

    return result;
  }

  /**
   * Execute an agent
   */
  private executeAgent(
    context: ProjectState,
    agentId: string,
    _input?: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    void _input;
    const agentInstance = context.agents.find((a) => a.agent.id === agentId);
    if (!agentInstance) {
      throw new Error(`Agent not found or not loaded: ${agentId}`);
    }

    const agent = agentInstance.agent;

    // Update agent status
    agentInstance.status = 'running';

    try {
      // Simulate agent execution
      // In real implementation, this would invoke the agent model
      const result = {
        agentId: agent.id,
        model: agent.model ?? 'claude-opus',
        role: agent.role,
        toolsAvailable: agentInstance.tools.map((t) => t.id),
        skillsAvailable: agentInstance.skills.map((s) => s.id),
        execution: {
          started: new Date().toISOString(),
          status: 'completed',
        },
      };

      agentInstance.status = 'idle';
      return Promise.resolve(result);
    } catch (error) {
      agentInstance.status = 'failed';
      throw error;
    }
  }

  /**
   * Execute a schedule
   */
  private executeSchedule(
    context: ProjectState,
    scheduleId: string,
  ): Promise<Record<string, unknown>> {
    const scheduleInstance = context.schedules.find((s) => s.schedule.id === scheduleId);
    if (!scheduleInstance) {
      throw new Error(`Schedule not found: ${scheduleId}`);
    }

    const schedule = scheduleInstance.schedule;

    // Update execution metadata
    scheduleInstance.lastExecutedAt = new Date().toISOString();
    scheduleInstance.executionCount++;

    return Promise.resolve({
      scheduleId: schedule.id,
      type: schedule.type,
      executionCount: scheduleInstance.executionCount,
      lastExecuted: scheduleInstance.lastExecutedAt,
    });
  }

  /**
   * Create an artifact
   */
  createArtifact(projectId: string, artifact: Artifact): Promise<Artifact> {
    const context = this.contexts.get(projectId);
    if (!context) {
      throw new Error(`Project not found: ${projectId}`);
    }

    const now = new Date().toISOString();

    // Store artifact
    const record: ArtifactRecord = {
      artifact: {
        ...artifact,
        version: 1,
        createdAt: now,
        updatedAt: now,
      },
      versions: [
        {
          id: randomUUID(),
          artifactId: artifact.id,
          version: 1,
          content: artifact.content,
          createdAt: now,
          createdBy: artifact.createdBy,
        },
      ],
      editors: [artifact.createdBy],
      lastModified: now,
    };

    // Emit event
    const event: Event = {
      id: randomUUID(),
      name: 'artifact.created',
      timestamp: now,
      projectId,
      artifactId: artifact.id,
      payload: {
        artifact: record.artifact,
        record,
      },
    };
    this.appendEvent(context, event);

    return Promise.resolve(context.artifacts.get(artifact.id)!.artifact);
  }

  /**
   * Add participant to project
   */
  addParticipant(projectId: string, participant: Participant): void {
    const context = this.contexts.get(projectId);
    if (!context) {
      throw new Error(`Project not found: ${projectId}`);
    }

    // Emit event
    const event: Event = {
      id: randomUUID(),
      name: 'participant.joined',
      timestamp: new Date().toISOString(),
      projectId,
      participantId: participant.id,
      payload: { participant },
    };
    this.appendEvent(context, event);
  }

  /**
   * Add resource to project
   */
  addResource(projectId: string, resource: Resource): void {
    const context = this.contexts.get(projectId);
    if (!context) {
      throw new Error(`Project not found: ${projectId}`);
    }

    // Emit event
    const event: Event = {
      id: randomUUID(),
      name: 'resource.added',
      timestamp: new Date().toISOString(),
      projectId,
      payload: { resource },
    };
    this.appendEvent(context, event);
  }

  /**
   * Create a thread
   */
  createThread(projectId: string, thread: Thread): Promise<Thread> {
    const context = this.contexts.get(projectId);
    if (!context) {
      throw new Error(`Project not found: ${projectId}`);
    }

    const threadRecord: ThreadRecord = {
      thread: {
        ...thread,
        createdAt: new Date().toISOString(),
      },
      messageCount: 0,
      participants: thread.participants ?? [],
      lastMessageAt: undefined,
    };

    // Emit event
    const event: Event = {
      id: randomUUID(),
      name: 'thread.created',
      timestamp: new Date().toISOString(),
      projectId,
      threadId: thread.id,
      payload: {
        thread: threadRecord.thread,
        record: threadRecord,
      },
    };
    this.appendEvent(context, event);

    return Promise.resolve(context.threads.get(thread.id)!.thread);
  }

  /**
   * Get project statistics
   */
  getProjectStats(projectId: string): ProjectStats {
    const context = this.contexts.get(projectId);
    if (!context) {
      return {
        projectId,
        agentCount: 0,
        resourceCount: 0,
        artifactCount: 0,
        threadCount: 0,
        runCount: 0,
        participantCount: 0,
        eventCount: 0,
        scheduleCount: 0,
      };
    }

    return {
      projectId,
      agentCount: context.agents.length,
      resourceCount: context.resources.length,
      artifactCount: context.artifacts.size,
      threadCount: context.threads.size,
      runCount: context.runs.size,
      participantCount: context.participants.size,
      eventCount: context.events.length,
      scheduleCount: context.schedules.length,
    };
  }
}
