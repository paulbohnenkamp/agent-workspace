/**
 * Tool execution types and interfaces
 */

import { Tool } from '@awp/types';

/**
 * Tool execution request
 */
export interface ToolExecutionRequest {
  /** Tool ID being executed */
  toolId: string;

  /** Input data matching tool's input schema */
  input: Record<string, any>;

  /** Execution options */
  options?: ToolExecutionOptions;
}

/**
 * Tool execution options
 */
export interface ToolExecutionOptions {
  /** Timeout in seconds */
  timeout?: number;

  /** Maximum retries */
  retries?: number;

  /** Retry backoff in seconds */
  retryBackoff?: number;

  /** Additional context */
  context?: Record<string, any>;
}

/**
 * Tool execution result
 */
export interface ToolExecutionResult {
  /** Success or failure */
  success: boolean;

  /** Output data (matches tool's output schema) */
  output?: Record<string, any>;

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
export interface ToolProvider {
  /** Provider type identifier */
  type: string;

  /** Whether this provider can handle the tool */
  canHandle(tool: Tool): boolean;

  /** Execute tool with given input */
  execute(request: ToolExecutionRequest): Promise<ToolExecutionResult>;

  /** Validate tool configuration */
  validate(tool: Tool): { valid: boolean; errors: string[] };

  /** Get provider-specific metadata */
  getMetadata?(): Record<string, any>;
}

/**
 * Provider configuration
 */
export interface ProviderConfig {
  /** Provider type */
  type: string;

  /** Provider-specific config */
  config?: Record<string, any>;

  /** Credentials or auth config */
  auth?: {
    type: string;
    credentials?: Record<string, any>;
    envVars?: Record<string, string>;
  };
}

/**
 * Tool with provider binding
 */
export interface ToolBinding {
  /** Tool definition */
  tool: Tool;

  /** Provider handling this tool */
  provider: ToolProvider;

  /** Provider config */
  providerConfig: ProviderConfig;
}

/**
 * Tool execution context
 */
export interface ToolExecutionContext {
  /** Project ID */
  projectId: string;

  /** Agent ID */
  agentId: string;

  /** Run ID */
  runId?: string;

  /** Additional context */
  context?: Record<string, any>;
}

/**
 * Tool provider registry
 */
export interface IToolRegistry {
  /** Register a provider */
  registerProvider(provider: ToolProvider): void;

  /** Get provider for tool */
  getProvider(tool: Tool): ToolProvider | undefined;

  /** Execute tool */
  execute(request: ToolExecutionRequest): Promise<ToolExecutionResult>;

  /** Get all providers */
  getProviders(): ToolProvider[];

  /** Get stats */
  getStats(): Record<string, any>;
}
