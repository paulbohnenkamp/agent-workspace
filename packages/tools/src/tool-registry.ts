/**
 * Tool registry - manages tools and their providers
 */

import { Tool } from '@awp/types';
import {
  ToolProvider,
  ToolExecutionRequest,
  ToolExecutionResult,
  ToolBinding,
  IToolRegistry,
  ToolRegistryExecutionStats,
  ToolRegistryStats,
} from './types';
import {
  ApiToolProvider,
  ConnectorToolProvider,
  McpToolProvider,
  NativeToolProvider,
  PlatformServiceToolProvider,
} from './providers';

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Registry for managing tools and their execution providers
 */
export class ToolRegistry implements IToolRegistry {
  private providers: ToolProvider[] = [];
  private toolBindings = new Map<string, ToolBinding>();
  private executionStats: ToolRegistryExecutionStats = {
    total: 0,
    successful: 0,
    failed: 0,
    byProvider: {},
  };

  constructor() {
    this.initializeDefaultProviders();
  }

  /**
   * Initialize default providers for all backing types
   */
  private initializeDefaultProviders(): void {
    this.registerProvider(new ApiToolProvider({ type: 'http' }));
    this.registerProvider(new ConnectorToolProvider({ type: 'connector' }));
    this.registerProvider(new McpToolProvider({ type: 'mcp' }));
    this.registerProvider(new NativeToolProvider({ type: 'function' }));
    this.registerProvider(new PlatformServiceToolProvider({ type: 'platform_service' }));
  }

  /**
   * Register a provider
   */
  registerProvider(provider: ToolProvider): void {
    this.providers.push(provider);
  }

  /**
   * Register a tool with the registry
   */
  registerTool(tool: Tool, provider?: ToolProvider): boolean {
    // Find provider if not specified
    const selectedProvider = provider ?? this.getProvider(tool);

    if (!selectedProvider) {
      console.error(`No provider found for tool: ${tool.id}`);
      return false;
    }

    // Validate tool
    const validation = selectedProvider.validate(tool);
    if (!validation.valid) {
      console.error(`Tool validation failed for ${tool.id}: ${validation.errors.join(', ')}`);
      return false;
    }

    // Create binding
    const binding: ToolBinding = {
      tool,
      provider: selectedProvider,
      providerConfig: {
        type: selectedProvider.type,
        config: isRecord(tool.implementation) ? tool.implementation : {},
      },
    };

    this.toolBindings.set(tool.id, binding);
    return true;
  }

  /**
   * Get provider for a tool
   */
  getProvider(tool: Tool): ToolProvider | undefined {
    return this.providers.find((p) => p.canHandle(tool));
  }

  /**
   * Get tool binding
   */
  getToolBinding(toolId: string): ToolBinding | undefined {
    return this.toolBindings.get(toolId);
  }

  /**
   * Execute a tool
   */
  async execute(request: ToolExecutionRequest): Promise<ToolExecutionResult> {
    this.executionStats.total++;

    const binding = this.toolBindings.get(request.toolId);
    if (!binding) {
      const result: ToolExecutionResult = {
        success: false,
        error: `Tool not found: ${request.toolId}`,
      };
      this.executionStats.failed++;
      return result;
    }

    try {
      // Execute with timeout if specified
      let executionPromise = binding.provider.execute(request);

      if (request.options?.timeout) {
        executionPromise = Promise.race([
          executionPromise,
          new Promise<ToolExecutionResult>((_, reject) =>
            setTimeout(
              () => reject(new Error(`Timeout after ${request.options?.timeout}s`)),
              request.options!.timeout! * 1000,
            ),
          ),
        ]);
      }

      const result = await executionPromise;

      if (result.success) {
        this.executionStats.successful++;
      } else {
        this.executionStats.failed++;
      }

      // Track by provider
      const providerType = binding.provider.type;
      this.executionStats.byProvider[providerType] = (this.executionStats.byProvider[providerType] ?? 0) + 1;

      return result;
    } catch (error) {
      this.executionStats.failed++;

      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        metadata: {
          provider: binding.provider.type,
        },
      };
    }
  }

  /**
   * Get all providers
   */
  getProviders(): ToolProvider[] {
    return [...this.providers];
  }

  /**
   * Get all registered tools
   */
  getTools(): Tool[] {
    return Array.from(this.toolBindings.values()).map((b) => b.tool);
  }

  /**
   * Get stats
   */
  getStats(): ToolRegistryStats {
    return {
      tools: this.toolBindings.size,
      providers: this.providers.length,
      execution: this.executionStats,
    };
  }

  /**
   * Clear all tools and stats
   */
  clear(): void {
    this.toolBindings.clear();
    this.executionStats = {
      total: 0,
      successful: 0,
      failed: 0,
      byProvider: {},
    };
  }
}
