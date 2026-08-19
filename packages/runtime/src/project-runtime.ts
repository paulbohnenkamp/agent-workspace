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
  AgentExecutionProvider,
  AgentExecutionResult,
  ProjectRuntimeOptions,
} from './types';
import { applyEventToProjectState } from './event-projection';

/**
 * ProjectRuntime - manages project execution and state
 */
export class ProjectRuntime {
  private contexts = new Map<string, ProjectState>();
  private registry: PackageRegistry;
  private agentProvider: AgentExecutionProvider;

  constructor(registry: PackageRegistry, options: ProjectRuntimeOptions = {}) {
    this.registry = registry;
    this.agentProvider = options.agentProvider ?? this.defaultAgentProvider;
  }

  private appendEvent(context: ProjectState, event: Event): Event {
    context.events.push(event);
    applyEventToProjectState(context, event);
    return event;
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
    const eventStartIndex = context.events.length;
    const emittedEvents: Event[] = [];
    let agentSessionId: string | undefined;

    if (request.targetKind === 'agent') {
      const session = this.getOrCreateAgentSession(context, request.targetId, request.threadId, runId);
      agentSessionId = session.id;
      const existingWaitingFor = session.context?.waitingFor;
      if (existingWaitingFor) {
        const resumedSession = {
          ...session,
          status: 'active' as const,
          updatedAt: new Date().toISOString(),
          context: { ...session.context, waitingFor: undefined, resumedAt: new Date().toISOString() },
        };
        const agentInstance = context.agents.find((entry) => entry.agent.id === request.targetId);
        if (agentInstance) agentInstance.session = resumedSession;
        emittedEvents.push(this.appendEvent(context, {
          id: randomUUID(),
          name: 'agent_session.resumed',
          timestamp: resumedSession.updatedAt,
          projectId,
          runId,
          agentSessionId: session.id,
          payload: { session: resumedSession },
        }));
      }
    }

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
      agentSessionId,
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
    emittedEvents.push(this.appendEvent(context, startEvent));

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
          output = await this.executeAgent(context, request.targetId, request.input, runId);
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
      emittedEvents.push(this.appendEvent(context, successEvent));

      const agentOutcome = request.targetKind === 'agent'
        ? this.getAgentOutcome(output)
        : undefined;
      if (agentOutcome?.status === 'waiting') {
        emittedEvents.push(this.markAgentSessionWaiting(context, projectId, runId, agentSessionId!, agentOutcome));
      } else if (request.targetKind === 'agent') {
        emittedEvents.push(this.updateAgentSession(context, projectId, runId, agentSessionId!, {
          status: 'idle',
          context: agentOutcome?.sessionContext,
        }));
      }

      return {
        run: context.runs.get(runId)!,
        success: true,
        artifactsCreated,
        events: context.events.slice(eventStartIndex),
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
      emittedEvents.push(this.appendEvent(context, failEvent));

      if (request.targetKind === 'agent' && agentSessionId) {
        emittedEvents.push(this.updateAgentSession(context, projectId, runId, agentSessionId, {
          status: 'idle',
          context: { lastError: failedRun.error },
        }));
      }

      return {
        run: context.runs.get(runId)!,
        success: false,
        error: failedRun.error,
        artifactsCreated: [],
        events: context.events.slice(eventStartIndex),
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
  private async executeAgent(
    context: ProjectState,
    agentId: string,
    input?: Record<string, unknown>,
    runId?: string,
  ): Promise<Record<string, unknown>> {
    const agentInstance = context.agents.find((a) => a.agent.id === agentId);
    if (!agentInstance) {
      throw new Error(`Agent not found or not loaded: ${agentId}`);
    }

    const agent = agentInstance.agent;

    // Update agent status
    agentInstance.status = 'running';

    try {
      const session = context.agentSessions.get(agentInstance.session?.id ?? '');
      if (!session) {
        throw new Error(`Agent session not found for agent: ${agentId}`);
      }
      const result = await this.agentProvider({
        project: context.project,
        agent,
        tools: agentInstance.tools,
        skills: agentInstance.skills,
        input,
        session,
      });
      agentInstance.status = 'idle';
      return {
        ...(result.output ?? {}),
        execution: {
          status: result.status ?? 'succeeded',
          stopReason: result.stopReason,
          sessionContext: result.sessionContext,
          runId,
        },
      };
    } catch (error) {
      agentInstance.status = 'failed';
      throw error;
    }
  }

  private defaultAgentProvider: AgentExecutionProvider = ({ agent, tools, skills }) => Promise.resolve({
    output: {
      agentId: agent.id,
      model: agent.model ?? 'claude-opus',
      role: agent.role,
      toolsAvailable: tools.map((tool) => tool.id),
      skillsAvailable: skills.map((skill) => skill.id),
    },
  });

  private getOrCreateAgentSession(
    context: ProjectState,
    agentId: string,
    threadId: string | undefined,
    runId: string,
  ): import('@awp/types').AgentSession {
    const agentInstance = context.agents.find((entry) => entry.agent.id === agentId);
    if (!agentInstance) {
      throw new Error(`Agent not found or not loaded: ${agentId}`);
    }
    const existing = agentInstance.session;
    const session = existing ?? {
      id: randomUUID(),
      projectId: context.project.id,
      agentId,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      runs: [],
      threads: [],
      context: {},
    };
    const updated = {
      ...session,
      status: 'active' as const,
      updatedAt: new Date().toISOString(),
      runs: [...(session.runs ?? []), runId],
      threads: threadId && !(session.threads ?? []).includes(threadId)
        ? [...(session.threads ?? []), threadId]
        : session.threads,
    };
    agentInstance.session = updated;
    this.appendEvent(context, {
      id: randomUUID(),
      name: existing ? 'agent_session.updated' : 'agent_session.created',
          timestamp: updated.updatedAt,
      projectId: context.project.id,
      runId,
      agentSessionId: updated.id,
      payload: { session: updated },
    });
    return updated;
  }

  private getAgentOutcome(output: Record<string, unknown>): AgentExecutionResult {
    const execution = output.execution;
    if (!execution || typeof execution !== 'object' || Array.isArray(execution)) {
      return { output };
    }
    const details = execution as Record<string, unknown>;
    return {
      output,
      status: details.status === 'waiting' ? 'waiting' : 'succeeded',
      stopReason: typeof details.stopReason === 'string' ? details.stopReason : undefined,
      sessionContext: details.sessionContext && typeof details.sessionContext === 'object'
        ? details.sessionContext as Record<string, unknown>
        : undefined,
    };
  }

  private markAgentSessionWaiting(
    context: ProjectState,
    projectId: string,
    runId: string,
    sessionId: string,
    outcome: AgentExecutionResult,
  ): Event {
    return this.updateAgentSession(context, projectId, runId, sessionId, {
      status: 'idle',
      context: {
        ...(outcome.sessionContext ?? {}),
        waitingFor: outcome.sessionContext?.waitingFor ?? 'external-event',
        stopReason: outcome.stopReason,
      },
      eventName: 'agent_session.waiting',
    });
  }

  private updateAgentSession(
    context: ProjectState,
    projectId: string,
    runId: string,
    sessionId: string,
    updates: {
      status: import('@awp/types').AgentSession['status'];
      context?: Record<string, unknown>;
      eventName?: string;
    },
  ): Event {
    const current = context.agentSessions.get(sessionId);
    if (!current) {
      throw new Error(`Agent session not found: ${sessionId}`);
    }
    const session = {
      ...current,
      status: updates.status,
      updatedAt: new Date().toISOString(),
      context: updates.context ? { ...(current.context ?? {}), ...updates.context } : current.context,
    };
    const agentInstance = context.agents.find((entry) => entry.agent.id === session.agentId);
    if (agentInstance) agentInstance.session = session;
    return this.appendEvent(context, {
      id: randomUUID(),
      name: updates.eventName ?? 'agent_session.updated',
      timestamp: session.updatedAt,
      projectId,
      runId,
      agentSessionId: session.id,
      payload: { session },
    });
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
