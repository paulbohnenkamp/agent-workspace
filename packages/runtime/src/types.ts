/**
 * Runtime types and interfaces for Project execution
 */

import { Project, Agent, Tool, Skill, Run, Artifact, Thread, Resource, ArtifactVersion, Participant, Event, AgentSession, Schedule } from '@awp/types';

/**
 * ProjectState - runtime state of a project
 * Event history is canonical; current maps and arrays are derived projections
 * optimized for query, collaboration, and resume behavior.
 */
export type ProjectState = {
  /** Project definition and configuration */
  project: Project;

  /** Active agents in this project */
  agents: AgentInstance[];

  /** Loaded resources available to agents (event-derived projection) */
  resources: Resource[];

  /** Artifacts created by execution (event-derived projection) */
  artifacts: Map<string, ArtifactRecord>;

  /** Conversation threads for collaboration (event-derived projection) */
  threads: Map<string, ThreadRecord>;

  /** Execution records (event-derived projection) */
  runs: Map<string, Run>;

  /** Agent sessions (event-derived projection) */
  agentSessions: Map<string, AgentSession>;

  /** Participants (humans and agents, event-derived projection) */
  participants: Map<string, Participant>;

  /** Canonical runtime log */
  events: Event[];

  /** Active schedules */
  schedules: ScheduleInstance[];

  /** Project metadata */
  metadata?: Record<string, unknown>;
}

/**
 * AgentInstance - runtime instance of an agent
 */
export type AgentInstance = {
  /** Agent definition */
  agent: Agent;

  /** Resolved tools this agent can use */
  tools: Tool[];

  /** Resolved skills this agent can use */
  skills: Skill[];

  /** Current execution status */
  status: 'idle' | 'running' | 'paused' | 'completed' | 'failed';

  /** Session context if agent has long-lived state */
  session?: AgentSession;

  /** Metadata */
  metadata?: Record<string, unknown>;
}

/**
 * ArtifactRecord - mutable artifact with version history
 */
export type ArtifactRecord = {
  /** Current artifact state */
  artifact: Artifact;

  /** Version history */
  versions: ArtifactVersion[];

  /** Participants who have edited */
  editors: string[];

  /** Last modified time */
  lastModified: string;

  /** Metadata */
  metadata?: Record<string, unknown>;
}

/**
 * ThreadRecord - conversation thread with messages
 */
export type ThreadRecord = {
  /** Thread definition */
  thread: Thread;

  /** Number of messages */
  messageCount: number;

  /** Last message timestamp */
  lastMessageAt?: string;

  /** Participants in this thread */
  participants: string[];

  /** Metadata */
  metadata?: Record<string, unknown>;
}

/**
 * ScheduleInstance - runtime instance of a schedule
 */
export type ScheduleInstance = {
  /** Schedule definition */
  schedule: Schedule;

  /** Whether schedule is active */
  active: boolean;

  /** Last execution time */
  lastExecutedAt?: string;

  /** Next execution time */
  nextExecutionAt?: string;

  /** Execution count */
  executionCount: number;

  /** Metadata */
  metadata?: Record<string, unknown>;
}

/**
 * RunRequest - request to execute a tool, skill, or agent
 */
export type RunRequest = {
  /** What to execute: tool, skill, agent, or schedule */
  targetKind: 'tool' | 'skill' | 'agent' | 'schedule';

  /** ID of what to execute */
  targetId: string;

  /** Who is triggering the execution */
  triggeredBy: string;

  /** Input data */
  input?: Record<string, unknown>;

  /** Associated thread (if applicable) */
  threadId?: string;

  /** Metadata */
  metadata?: Record<string, unknown>;
}

/**
 * RunResult - result of executing a run
 */
export type RunResult = {
  /** Resulting run record */
  run: Run;

  /** Success or failure */
  success: boolean;

  /** Error message if failed */
  error?: string;

  /** Artifacts created */
  artifactsCreated: string[];

  /** Events emitted */
  events: Event[];
}

/**
 * Project statistics summary
 */
export type ProjectStats = {
  projectId: string;
  agentCount: number;
  resourceCount: number;
  artifactCount: number;
  threadCount: number;
  runCount: number;
  participantCount: number;
  eventCount: number;
  scheduleCount: number;
}

/**
 * Options for project initialization
 */
export type ProjectInitOptions = {
  /** Project definition */
  project: Project;

  /** Initial participants */
  participants?: Participant[];

  /** Initial resources */
  resources?: Resource[];

  /** Enable event emission */
  enableEvents?: boolean;

  /** Metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Options for executing a run
 */
export type ExecutionOptions = {
  /** Timeout in seconds */
  timeout?: number;

  /** Maximum retries */
  retries?: number;

  /** Retry backoff in seconds */
  retryBackoff?: number;

  /** Whether to emit events */
  emitEvents?: boolean;

  /** Whether to create run record */
  recordRun?: boolean;

  /** Metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Project service for managing project execution
 */
export type ProjectService = {
  /** Initialize a project context */
  initializeProject(options: ProjectInitOptions): Promise<ProjectState>;

  /** Get current project context */
  getProject(projectId: string): Promise<ProjectState | undefined>;

  /** Add participant to project */
  addParticipant(projectId: string, participant: Participant): Promise<void>;

  /** Add resource to project */
  addResource(projectId: string, resource: Resource): Promise<void>;

  /** Activate schedule */
  activateSchedule(projectId: string, scheduleId: string): Promise<void>;

  /** Deactivate schedule */
  deactivateSchedule(projectId: string, scheduleId: string): Promise<void>;
}

/**
 * Run service for executing tools, skills, and agents
 */
export type RunService = {
  /** Execute a run request */
  execute(projectId: string, request: RunRequest, options?: ExecutionOptions): Promise<RunResult>;

  /** Get run by ID */
  getRun(projectId: string, runId: string): Promise<Run | undefined>;

  /** Get all runs for a project */
  listRuns(projectId: string, filter?: RunFilter): Promise<Run[]>;

  /** Cancel an in-progress run */
  cancelRun(projectId: string, runId: string): Promise<void>;
}

/**
 * Filter for listing runs
 */
export type RunFilter = {
  agentId?: string;
  status?: Run['status'];
  from?: string;
  to?: string;
}

/**
 * Artifact service for managing artifacts
 */
export type ArtifactService = {
  /** Create an artifact */
  createArtifact(projectId: string, artifact: Artifact): Promise<Artifact>;

  /** Update an artifact */
  updateArtifact(projectId: string, artifactId: string, updates: Partial<Artifact>): Promise<Artifact>;

  /** Get artifact by ID */
  getArtifact(projectId: string, artifactId: string): Promise<Artifact | undefined>;

  /** Get artifact version */
  getVersion(projectId: string, artifactId: string, version: number): Promise<ArtifactVersion | undefined>;

  /** List all artifact versions */
  listVersions(projectId: string, artifactId: string): Promise<ArtifactVersion[]>;

  /** Get all artifacts in project */
  listArtifacts(projectId: string): Promise<Artifact[]>;
}

/**
 * Thread service for managing conversations
 */
export type ThreadService = {
  /** Create a thread */
  createThread(projectId: string, thread: Thread): Promise<Thread>;

  /** Add message to thread */
  addMessage(projectId: string, threadId: string, message: Record<string, unknown>): Promise<void>;

  /** Get thread by ID */
  getThread(projectId: string, threadId: string): Promise<Thread | undefined>;

  /** List all threads in project */
  listThreads(projectId: string): Promise<Thread[]>;

  /** Close a thread */
  closeThread(projectId: string, threadId: string): Promise<void>;
}

/**
 * Event service for tracking activity
 */
export type EventService = {
  /** Emit an event */
  emit(projectId: string, event: Event): Promise<void>;

  /** Get events for a project */
  listEvents(projectId: string, filter?: EventFilter): Promise<Event[]>;

  /** Get events for a specific run */
  getRunEvents(projectId: string, runId: string): Promise<Event[]>;
}

/**
 * Filter for listing events
 */
export type EventFilter = {
  from?: string;
  to?: string;
  name?: string;
  agentId?: string;
}

/**
 * Repository for persisting projects
 */
export type ProjectRepository = {
  /** Save project context */
  save(context: ProjectState): Promise<void>;

  /** Load project context */
  load(projectId: string): Promise<ProjectState | undefined>;

  /** Delete project */
  delete(projectId: string): Promise<void>;

  /** List all projects */
  list(): Promise<string[]>;
}
