/**
 * Tool execution types and interfaces
 */

import { Tool } from '@awp/types';

/**
 * Tool execution request
 */
export type ToolExecutionRequest = {
  /** Tool ID being executed */
  toolId: string;

  /** Input data matching tool's input schema */
  input: Record<string, unknown>;

  /** Execution options */
  options?: ToolExecutionOptions;
}

/**
 * Tool execution options
 */
export type ToolExecutionOptions = {
  /** Timeout in seconds */
  timeout?: number;

  /** Maximum retries */
  retries?: number;

  /** Retry backoff in seconds */
  retryBackoff?: number;

  /** Additional context */
  context?: Record<string, unknown>;
}

/**
 * Tool execution result
 */
export type ToolExecutionResult = {
  /** Success or failure */
  success: boolean;

  /** Output data (matches tool's output schema) */
  output?: Record<string, unknown>;

  /** Error message if failed */
  error?: string;

  /** Execution metadata */
  metadata?: {
    executionTime?: number;
    retries?: number;
    provider?: string;
  };
}

/**
 * Tool provider abstraction
 * Defines how a tool is executed
 */
export type ToolProvider = {
  /** Provider type identifier */
  type: string;

  /** Whether this provider can handle the tool */
  canHandle(tool: Tool): boolean;

  /** Execute tool with given input */
  execute(request: ToolExecutionRequest): Promise<ToolExecutionResult>;

  /** Validate tool configuration */
  validate(tool: Tool): { valid: boolean; errors: string[] };

  /** Get provider-specific metadata */
  getMetadata?(): Record<string, unknown>;
}

/**
 * Provider configuration
 */
export type ProviderConfig = {
  /** Provider type */
  type: string;

  /** Provider-specific config */
  config?: Record<string, unknown>;

  /** Credentials or auth config */
  auth?: {
    type: string;
    credentials?: Record<string, unknown>;
    envVars?: Record<string, string>;
  };
}

/**
 * Tool with provider binding
 */
export type ToolBinding = {
  /** Tool definition */
  tool: Tool;

  /** Provider handling this tool */
  provider: ToolProvider;

  /** Provider config */
  providerConfig: ProviderConfig;
}

/**
 * Execution statistics for the tool registry
 */
export type ToolRegistryExecutionStats = {
  total: number;
  successful: number;
  failed: number;
  byProvider: Record<string, number>;
}

/**
 * Tool registry stats
 */
export type ToolRegistryStats = {
  tools: number;
  providers: number;
  execution: ToolRegistryExecutionStats;
}

/**
 * Tool execution context
 */
export type ToolExecutionContext = {
  /** Project ID */
  projectId: string;

  /** Agent ID */
  agentId: string;

  /** Run ID */
  runId?: string;

  /** Additional context */
  context?: Record<string, unknown>;
}

/**
 * Tool provider registry
 */
export type IToolRegistry = {
  /** Register a provider */
  registerProvider(provider: ToolProvider): void;

  /** Get provider for tool */
  getProvider(tool: Tool): ToolProvider | undefined;

  /** Execute tool */
  execute(request: ToolExecutionRequest): Promise<ToolExecutionResult>;

  /** Get all providers */
  getProviders(): ToolProvider[];

  /** Get stats */
  getStats(): ToolRegistryStats;
}
