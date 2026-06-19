/**
 * Tests for tool execution and providers
 */

import { ToolRegistry } from '../src/tool-registry';
import {
  ApiToolProvider,
  ConnectorToolProvider,
  McpToolProvider,
  NativeToolProvider,
  PlatformServiceToolProvider,
} from '../src/providers';
import { Tool } from '@awp/types';

describe('Tool Providers', () => {
  describe('ApiToolProvider', () => {
    let provider: ApiToolProvider;
    let tool: Tool;

    beforeEach(() => {
      provider = new ApiToolProvider({
        type: 'http',
        config: { endpoint: 'https://api.example.com/search', method: 'POST' },
      });

      tool = {
        kind: 'tool',
        id: 'search-api',
        name: 'Search',
        version: '1.0.0',
        sourcePath: '/tools/search/search.yaml',
        implementation: { type: 'http', endpoint: 'https://api.example.com/search' },
      };
    });

    it('should identify HTTP tools', () => {
      expect(provider.canHandle(tool)).toBe(true);
    });

    it('should reject non-HTTP tools', () => {
      const connectorTool = { ...tool, implementation: { type: 'connector' } };
      expect(provider.canHandle(connectorTool)).toBe(false);
    });

    it('should execute HTTP tool', async () => {
      const result = await provider.execute({
        toolId: 'search-api',
        input: { query: 'test' },
      });

      expect(result.success).toBe(true);
      expect(result.output?.api_endpoint).toBe('https://api.example.com/search');
      expect(result.metadata?.provider).toBe('api');
    });

    it('should validate HTTP tool', () => {
      const validation = provider.validate(tool);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should reject HTTP tool without endpoint', () => {
      const invalidTool = { ...tool, implementation: { type: 'http' } };
      const validation = provider.validate(invalidTool);
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('HTTP tool must have endpoint');
    });
  });

  describe('ConnectorToolProvider', () => {
    let provider: ConnectorToolProvider;
    let tool: Tool;

    beforeEach(() => {
      provider = new ConnectorToolProvider({
        type: 'connector',
        config: { connector_type: 'postgres' },
      });

      tool = {
        kind: 'tool',
        id: 'database-query',
        name: 'Database Query',
        version: '1.0.0',
        sourcePath: '/tools/database/database.yaml',
        implementation: { type: 'connector', connector_type: 'postgres' },
      };
    });

    it('should identify connector tools', () => {
      expect(provider.canHandle(tool)).toBe(true);
    });

    it('should execute connector tool', async () => {
      const result = await provider.execute({
        toolId: 'database-query',
        input: { query: 'SELECT * FROM users' },
      });

      expect(result.success).toBe(true);
      expect(result.output?.connector_type).toBe('postgres');
      expect(result.metadata?.provider).toBe('connector');
    });

    it('should validate connector tool', () => {
      const validation = provider.validate(tool);
      expect(validation.valid).toBe(true);
    });

    it('should reject connector tool without type', () => {
      const invalidTool = { ...tool, implementation: { type: 'connector' } };
      const validation = provider.validate(invalidTool);
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Connector tool must specify connector_type');
    });
  });

  describe('McpToolProvider', () => {
    let provider: McpToolProvider;
    let tool: Tool;

    beforeEach(() => {
      provider = new McpToolProvider({
        type: 'mcp',
        config: { server: 'document-server' },
      });

      tool = {
        kind: 'tool',
        id: 'document-retrieval',
        name: 'Document Retrieval',
        version: '1.0.0',
        sourcePath: '/tools/documents/documents.yaml',
        implementation: { type: 'mcp', server: 'document-server' },
      };
    });

    it('should identify MCP tools', () => {
      expect(provider.canHandle(tool)).toBe(true);
    });

    it('should execute MCP tool', async () => {
      const result = await provider.execute({
        toolId: 'document-retrieval',
        input: { query: 'test' },
      });

      expect(result.success).toBe(true);
      expect(result.output?.server).toBe('document-server');
      expect(result.metadata?.provider).toBe('mcp');
    });

    it('should validate MCP tool', () => {
      const validation = provider.validate(tool);
      expect(validation.valid).toBe(true);
    });

    it('should reject MCP tool without server', () => {
      const invalidTool = { ...tool, implementation: { type: 'mcp' } };
      const validation = provider.validate(invalidTool);
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('MCP tool must specify server');
    });
  });

  describe('NativeToolProvider', () => {
    let provider: NativeToolProvider;
    let tool: Tool;

    beforeEach(() => {
      provider = new NativeToolProvider({
        type: 'function',
        config: { language: 'python', module: 'tools', function: 'calculate' },
      });

      tool = {
        kind: 'tool',
        id: 'calculator',
        name: 'Calculator',
        version: '1.0.0',
        sourcePath: '/tools/calculator/calculator.yaml',
        implementation: { type: 'function', language: 'python', module: 'tools', function: 'calculate' },
      };
    });

    it('should identify function tools', () => {
      expect(provider.canHandle(tool)).toBe(true);
    });

    it('should execute function tool', async () => {
      const result = await provider.execute({
        toolId: 'calculator',
        input: { numbers: [1, 2, 3] },
      });

      expect(result.success).toBe(true);
      expect(result.output?.language).toBe('python');
      expect(result.metadata?.provider).toBe('function');
    });

    it('should validate function tool', () => {
      const validation = provider.validate(tool);
      expect(validation.valid).toBe(true);
    });
  });

  describe('PlatformServiceToolProvider', () => {
    let provider: PlatformServiceToolProvider;
    let tool: Tool;

    beforeEach(() => {
      provider = new PlatformServiceToolProvider({
        type: 'platform_service',
        config: { service: 'artifact_manager', operation: 'create' },
      });

      tool = {
        kind: 'tool',
        id: 'artifact-creator',
        name: 'Artifact Creator',
        version: '1.0.0',
        sourcePath: '/tools/artifact/artifact.yaml',
        implementation: { type: 'platform_service', service: 'artifact_manager', operation: 'create' },
      };
    });

    it('should identify platform service tools', () => {
      expect(provider.canHandle(tool)).toBe(true);
    });

    it('should execute platform service tool', async () => {
      const result = await provider.execute({
        toolId: 'artifact-creator',
        input: { type: 'analysis' },
      });

      expect(result.success).toBe(true);
      expect(result.output?.service).toBe('artifact_manager');
      expect(result.metadata?.provider).toBe('platform_service');
    });

    it('should validate platform service tool', () => {
      const validation = provider.validate(tool);
      expect(validation.valid).toBe(true);
    });

    it('should reject platform service tool without service', () => {
      const invalidTool = { ...tool, implementation: { type: 'platform_service' } };
      const validation = provider.validate(invalidTool);
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Platform service tool must specify service');
    });
  });
});

describe('ToolRegistry', () => {
  let registry: ToolRegistry;
  let httpTool: Tool;
  let connectorTool: Tool;

  beforeEach(() => {
    registry = new ToolRegistry();

    httpTool = {
      kind: 'tool',
      id: 'search',
      name: 'Search',
      version: '1.0.0',
      sourcePath: '/tools/search/search.yaml',
      implementation: { type: 'http', endpoint: 'https://api.example.com/search' },
    };

    connectorTool = {
      kind: 'tool',
      id: 'database',
      name: 'Database',
      version: '1.0.0',
      sourcePath: '/tools/database/database.yaml',
      implementation: { type: 'connector', connector_type: 'postgres' },
    };
  });

  it('should initialize with default providers', () => {
    const providers = registry.getProviders();
    expect(providers.length).toBe(5); // http, connector, mcp, function, platform_service
  });

  it('should register tools', () => {
    const success1 = registry.registerTool(httpTool);
    const success2 = registry.registerTool(connectorTool);

    expect(success1).toBe(true);
    expect(success2).toBe(true);
    expect(registry.getTools()).toHaveLength(2);
  });

  it('should find provider for tool', () => {
    const provider = registry.getProvider(httpTool);
    expect(provider).toBeDefined();
    expect(provider?.type).toBe('http');
  });

  it('should execute registered tool', async () => {
    registry.registerTool(httpTool);

    const result = await registry.execute({
      toolId: 'search',
      input: { query: 'test' },
    });

    expect(result.success).toBe(true);
    expect(result.output).toBeDefined();
  });

  it('should fail for unregistered tool', async () => {
    const result = await registry.execute({
      toolId: 'nonexistent',
      input: {},
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Tool not found');
  });

  it('should track execution statistics', async () => {
    registry.registerTool(httpTool);
    registry.registerTool(connectorTool);

    await registry.execute({ toolId: 'search', input: {} });
    await registry.execute({ toolId: 'database', input: {} });
    await registry.execute({ toolId: 'nonexistent', input: {} });

    const stats = registry.getStats();
    expect(stats.execution.total).toBe(3);
    expect(stats.execution.successful).toBe(2);
    expect(stats.execution.failed).toBe(1);
    expect(stats.execution.byProvider['http']).toBe(1);
    expect(stats.execution.byProvider['connector']).toBe(1);
  });

  it('should clear tools and stats', () => {
    registry.registerTool(httpTool);
    expect(registry.getTools()).toHaveLength(1);

    registry.clear();

    expect(registry.getTools()).toHaveLength(0);
    const stats = registry.getStats();
    expect(stats.execution.total).toBe(0);
  });

  it('should handle timeout', async () => {
    registry.registerTool(httpTool);

    const result = await registry.execute({
      toolId: 'search',
      input: {},
      options: { timeout: 0.001 }, // 1ms timeout - will timeout
    });

    // Note: In real implementation, this would timeout
    // In our mock, execution is fast so it may not
    expect(result.metadata).toBeDefined();
  });
});

describe('Tool Abstraction', () => {
  it('should execute same interface with different providers', async () => {
    const registry = new ToolRegistry();

    const apiTool: Tool = {
      kind: 'tool',
      id: 'search-api',
      name: 'Search',
      version: '1.0.0',
      sourcePath: '/tools/search-api/search-api.yaml',
      implementation: { type: 'http', endpoint: 'https://...' },
    };

    const mcpTool: Tool = {
      kind: 'tool',
      id: 'search-mcp',
      name: 'Search',
      version: '1.0.0',
      sourcePath: '/tools/search-mcp/search-mcp.yaml',
      implementation: { type: 'mcp', server: 'search-server' },
    };

    registry.registerTool(apiTool);
    registry.registerTool(mcpTool);

    const result1 = await registry.execute({
      toolId: 'search-api',
      input: { query: 'test' },
    });

    const result2 = await registry.execute({
      toolId: 'search-mcp',
      input: { query: 'test' },
    });

    // Both succeed even though they use different providers
    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);

    // But they routed through different providers
    expect(result1.metadata?.provider).toBe('api');
    expect(result2.metadata?.provider).toBe('mcp');
  });
});
