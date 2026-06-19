/**
 * Example: Tool execution with multiple providers
 */

import { ToolRegistry } from '../src/tool-registry';
import { Tool } from '@awp/types';

/**
 * Execute various tool types
 */
async function demonstrateToolExecution() {
  console.log('🔨 Tool Execution Example\n');

  // Create registry with default providers
  const registry = new ToolRegistry();

  // Define tools with different backing mechanisms
  const tools: Tool[] = [
    {
      kind: 'tool',
      id: 'web-search',
      name: 'Web Search',
      version: '1.0.0',
      sourcePath: '/tools/web-search/web-search.yaml',
      description: 'Search the web for information',
      implementation: {
        type: 'http',
        endpoint: 'https://api.search.example.com/search',
        method: 'POST',
      },
    },

    {
      kind: 'tool',
      id: 'company-database',
      name: 'Company Database',
      version: '1.0.0',
      sourcePath: '/tools/company-database/company-database.yaml',
      description: 'Query company database',
      implementation: {
        type: 'connector',
        connector_type: 'postgres',
      },
    },

    {
      kind: 'tool',
      id: 'document-retrieval',
      name: 'Document Retrieval',
      version: '1.0.0',
      sourcePath: '/tools/document-retrieval/document-retrieval.yaml',
      description: 'Retrieve documents via MCP',
      implementation: {
        type: 'mcp',
        server: 'claude-document-server',
      },
    },

    {
      kind: 'tool',
      id: 'financial-calculator',
      name: 'Financial Calculator',
      version: '1.0.0',
      sourcePath: '/tools/financial-calculator/financial-calculator.yaml',
      description: 'Calculate financial metrics',
      implementation: {
        type: 'function',
        language: 'python',
        module: 'financial_tools',
        function: 'calculate_metrics',
      },
    },

    {
      kind: 'tool',
      id: 'artifact-manager',
      name: 'Artifact Manager',
      version: '1.0.0',
      sourcePath: '/tools/artifact-manager/artifact-manager.yaml',
      description: 'Create and manage artifacts',
      implementation: {
        type: 'platform_service',
        service: 'artifact_manager',
        operation: 'create',
      },
    },
  ];

  // Register all tools
  console.log('📦 Registering Tools:\n');
  for (const tool of tools) {
    const success = registry.registerTool(tool);
    const status = success ? '✓' : '✗';
    console.log(`  ${status} ${tool.name} (${(tool.implementation as any)?.type})`);
  }
  console.log();

  // Show registered tools
  console.log('📋 Registered Tools:');
  const registeredTools = registry.getTools();
  console.log(`  Total: ${registeredTools.length}\n`);

  // Execute each tool
  console.log('⚙️  Executing Tools:\n');

  for (const tool of tools) {
    console.log(`Executing: ${tool.name}`);

    const result = await registry.execute({
      toolId: tool.id,
      input: {
        query: 'test query',
        limit: 10,
      },
    });

    if (result.success) {
      console.log(`  ✓ Success`);
      console.log(`  Provider: ${result.metadata?.provider}`);
      console.log(`  Response keys: ${Object.keys(result.output || {}).join(', ')}`);
    } else {
      console.log(`  ✗ Failed: ${result.error}`);
    }
    console.log();
  }

  // Show statistics
  console.log('📊 Execution Statistics:');
  const stats = registry.getStats();
  console.log(`  Total Registrations: ${stats.tools}`);
  console.log(`  Available Providers: ${stats.providers}`);

  const execution = stats.execution;
  console.log(`  Total Executions: ${execution.total}`);
  console.log(`  Successful: ${execution.successful}`);
  console.log(`  Failed: ${execution.failed}`);
  console.log(`  Success Rate: ${((execution.successful / execution.total) * 100).toFixed(1)}%\n`);

  console.log('By Provider:');
  for (const [provider, count] of Object.entries(execution.byProvider)) {
    console.log(`  ${provider}: ${count}`);
  }
}

/**
 * Show tool abstraction - same interface, different backing
 */
async function demonstrateToolAbstraction() {
  console.log('\n🎯 Tool Abstraction Demonstration\n');

  const registry = new ToolRegistry();

  // Three different tools that look the same to the agent
  // but are backed by different mechanisms

  const searchApiTool: Tool = {
    kind: 'tool',
    id: 'search-api',
    name: 'Search',
    version: '1.0.0',
    sourcePath: '/tools/search-api/search-api.yaml',
    description: 'Search for information',
    implementation: { type: 'http', endpoint: 'https://...' },
  };

  const searchMcpTool: Tool = {
    kind: 'tool',
    id: 'search-mcp',
    name: 'Search',
    version: '1.0.0',
    sourcePath: '/tools/search-mcp/search-mcp.yaml',
    description: 'Search for information',
    implementation: { type: 'mcp', server: 'search-server' },
  };

  const searchDbTool: Tool = {
    kind: 'tool',
    id: 'search-db',
    name: 'Search',
    version: '1.0.0',
    sourcePath: '/tools/search-db/search-db.yaml',
    description: 'Search for information',
    implementation: { type: 'connector', connector_type: 'postgres' },
  };

  registry.registerTool(searchApiTool);
  registry.registerTool(searchMcpTool);
  registry.registerTool(searchDbTool);

  console.log('From the Agent perspective:');
  console.log('All three tools have the same interface:\n');

  const tools = [searchApiTool, searchMcpTool, searchDbTool];

  for (const tool of tools) {
    console.log(`Tool: ${tool.id}`);
    console.log(`  Name: ${tool.name}`);
    console.log(`  Description: ${tool.description}\n`);
  }

  console.log('Agent uses all three identically:');
  console.log('  1. Call tool with input\n');
  console.log('  2. Receive output\n');
  console.log('  3. Continue working\n');

  console.log('Platform handles the differences transparently:');
  for (const tool of tools) {
    const provider = registry.getProvider(tool);
    console.log(
      `  ${tool.id} → ${provider?.type} provider → ` +
        (provider?.type === 'http'
          ? 'HTTP call to API'
          : provider?.type === 'mcp'
            ? 'MCP server call'
            : 'Database query'),
    );
  }

  console.log('\n✓ Agent sees abstraction, platform handles mechanism');
}

/**
 * Run examples
 */
async function runExamples() {
  try {
    await demonstrateToolExecution();
    await demonstrateToolAbstraction();

    console.log('\n✓ Tool model examples completed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  runExamples();
}

export { demonstrateToolExecution, demonstrateToolAbstraction };
