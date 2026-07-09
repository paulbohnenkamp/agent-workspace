/**
 * Tool provider implementations
 */

import { Tool } from '@awp/types';
import { ToolProvider, ToolExecutionRequest, ToolExecutionResult, ProviderConfig } from './types';

type ToolImplementation = Record<string, unknown> & {
  type?: string;
  endpoint?: string;
  connector_type?: string;
  server?: string;
  capabilities?: string[];
  language?: string;
  module?: string;
  function?: string;
  service?: string;
  operation?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function getImplementation(tool: Tool): ToolImplementation | undefined {
  return isRecord(tool.implementation) ? tool.implementation : undefined;
}

/**
 * Base class for tool providers
 */
export abstract class BaseToolProvider implements ToolProvider {
  abstract type: string;
  protected config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  abstract canHandle(tool: Tool): boolean;

  abstract execute(request: ToolExecutionRequest): Promise<ToolExecutionResult>;

  /**
   * Default validation - check for required fields
   */
  validate(tool: Tool): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!tool.id) {
      errors.push('Tool must have an id');
    }

    if (!tool.implementation) {
      errors.push('Tool must have implementation config');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  getMetadata(): Record<string, unknown> {
    return {
      type: this.type,
      config: this.config,
    };
  }

  protected getExecutionConfig(): ToolImplementation {
    return this.config.config ?? {};
  }
}

/**
 * Provider for HTTP/API-backed tools
 */
export class ApiToolProvider extends BaseToolProvider {
  type = 'http';

  canHandle(tool: Tool): boolean {
    const impl = getImplementation(tool);
    if (!impl) return false;
    return impl.type === 'http' || impl.type === 'api';
  }

  execute(request: ToolExecutionRequest): Promise<ToolExecutionResult> {
    try {
      const impl = this.getExecutionConfig();

      // Simulate HTTP call
      const result = {
        success: true,
        output: {
          api_endpoint: impl.endpoint,
          method: impl.method ?? 'POST',
          request_id: Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString(),
          input_received: request.input,
        },
        metadata: {
          provider: 'api',
          executionTime: Math.random() * 1000,
        },
      };

      return Promise.resolve(result);
    } catch (error) {
      return Promise.resolve({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        metadata: { provider: 'api' },
      });
    }
  }

  validate(tool: Tool): { valid: boolean; errors: string[] } {
    const baseValidation = super.validate(tool);
    const errors = [...baseValidation.errors];

    const impl = getImplementation(tool);
    if (!impl) {
      errors.push('HTTP tool must have implementation config');
      return {
        valid: false,
        errors,
      };
    }
    if (!impl.endpoint) {
      errors.push('HTTP tool must have endpoint');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Provider for connector-backed tools (databases, SaaS)
 */
export class ConnectorToolProvider extends BaseToolProvider {
  type = 'connector';

  canHandle(tool: Tool): boolean {
    const impl = getImplementation(tool);
    if (!impl) return false;
    return impl.type === 'connector';
  }

  execute(request: ToolExecutionRequest): Promise<ToolExecutionResult> {
    try {
      const impl = this.getExecutionConfig();

      // Simulate connector call
      const result = {
        success: true,
        output: {
          connector_type: impl.connector_type,
          connection_id: Math.random().toString(36).substring(7),
          rows_affected: Math.floor(Math.random() * 100),
          timestamp: new Date().toISOString(),
          query_result: [
            { id: '1', name: 'Row 1' },
            { id: '2', name: 'Row 2' },
          ],
          input_received: request.input,
        },
        metadata: {
          provider: 'connector',
          executionTime: Math.random() * 500,
        },
      };

      return Promise.resolve(result);
    } catch (error) {
      return Promise.resolve({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        metadata: { provider: 'connector' },
      });
    }
  }

  validate(tool: Tool): { valid: boolean; errors: string[] } {
    const baseValidation = super.validate(tool);
    const errors = [...baseValidation.errors];

    const impl = getImplementation(tool);
    if (!impl) {
      errors.push('Connector tool must specify implementation config');
      return {
        valid: false,
        errors,
      };
    }
    if (!impl.connector_type) {
      errors.push('Connector tool must specify connector_type');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Provider for MCP server-backed tools
 */
export class McpToolProvider extends BaseToolProvider {
  type = 'mcp';

  canHandle(tool: Tool): boolean {
    const impl = getImplementation(tool);
    if (!impl) return false;
    return impl.type === 'mcp';
  }

  execute(request: ToolExecutionRequest): Promise<ToolExecutionResult> {
    try {
      const impl = this.getExecutionConfig();

      // Simulate MCP call
      const result = {
        success: true,
        output: {
          server: impl.server,
          capabilities: impl.capabilities ?? [],
          session_id: Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString(),
          mcp_response: {
            status: 'ok',
            data: request.input,
          },
        },
        metadata: {
          provider: 'mcp',
          executionTime: Math.random() * 800,
        },
      };

      return Promise.resolve(result);
    } catch (error) {
      return Promise.resolve({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        metadata: { provider: 'mcp' },
      });
    }
  }

  validate(tool: Tool): { valid: boolean; errors: string[] } {
    const baseValidation = super.validate(tool);
    const errors = [...baseValidation.errors];

    const impl = getImplementation(tool);
    if (!impl) {
      errors.push('MCP tool must specify implementation config');
      return {
        valid: false,
        errors,
      };
    }
    if (!impl.server) {
      errors.push('MCP tool must specify server');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Provider for native code-backed tools
 */
export class NativeToolProvider extends BaseToolProvider {
  type = 'function';

  canHandle(tool: Tool): boolean {
    const impl = getImplementation(tool);
    if (!impl) return false;
    return impl.type === 'function' || impl.type === 'code';
  }

  execute(request: ToolExecutionRequest): Promise<ToolExecutionResult> {
    try {
      const impl = this.getExecutionConfig();

      // Simulate function call
      const result = {
        success: true,
        output: {
          language: impl.language ?? 'python',
          module: impl.module,
          function: impl.function,
          execution_id: Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString(),
          result: {
            computed: true,
            value: this.computeResult(request.input),
          },
        },
        metadata: {
          provider: 'function',
          executionTime: Math.random() * 300,
        },
      };

      return Promise.resolve(result);
    } catch (error) {
      return Promise.resolve({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        metadata: { provider: 'function' },
      });
    }
  }

  private computeResult(input: Record<string, unknown>): number {
    // Simple computation simulation
    const numbers = input.numbers;
    if (Array.isArray(numbers) && numbers.every((value) => typeof value === 'number')) {
      return numbers.reduce((a, b) => a + b, 0);
    }
    return Object.values(input).length;
  }

  validate(tool: Tool): { valid: boolean; errors: string[] } {
    const baseValidation = super.validate(tool);
    const errors = [...baseValidation.errors];

    const impl = getImplementation(tool);
    if (!impl) {
      errors.push('Function tool must specify implementation config');
      return {
        valid: false,
        errors,
      };
    }
    if (!impl.module && !impl.function) {
      errors.push('Function tool must specify module or function');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Provider for platform service-backed tools
 */
export class PlatformServiceToolProvider extends BaseToolProvider {
  type = 'platform_service';

  canHandle(tool: Tool): boolean {
    const impl = getImplementation(tool);
    if (!impl) return false;
    return impl.type === 'platform_service' || impl.type === 'service';
  }

  execute(request: ToolExecutionRequest): Promise<ToolExecutionResult> {
    try {
      const impl = this.getExecutionConfig();

      // Simulate platform service call
      const result = {
        success: true,
        output: {
          service: impl.service,
          operation: impl.operation,
          service_id: Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString(),
          service_response: {
            status: 'success',
            data: request.input,
          },
        },
        metadata: {
          provider: 'platform_service',
          executionTime: Math.random() * 200,
        },
      };

      return Promise.resolve(result);
    } catch (error) {
      return Promise.resolve({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        metadata: { provider: 'platform_service' },
      });
    }
  }

  validate(tool: Tool): { valid: boolean; errors: string[] } {
    const baseValidation = super.validate(tool);
    const errors = [...baseValidation.errors];

    const impl = getImplementation(tool);
    if (!impl) {
      errors.push('Platform service tool must specify implementation config');
      return {
        valid: false,
        errors,
      };
    }
    if (!impl.service) {
      errors.push('Platform service tool must specify service');
    }

    if (!impl.operation) {
      errors.push('Platform service tool must specify operation');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
