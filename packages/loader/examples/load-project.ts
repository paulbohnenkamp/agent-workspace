/**
 * Example: Load a complete project
 */

import { PackageLoader, PackageRegistry } from '../src';

/**
 * Load a project and all its packages
 */
async function loadProject(projectPath: string) {
  console.log(`Loading project from: ${projectPath}\n`);

  // Create loader
  const loader = new PackageLoader({
    rootPath: projectPath,
    validateSchema: true,
    validateReferences: true,
    recursive: true,
    ignore: ['node_modules', '.git', '.DS_Store'],
  });

  // Discover all packages
  const discovery = await loader.discover();
  console.log(`Discovery completed in ${discovery.durationMs}ms`);
  console.log(`Found ${discovery.count} packages`);

  if (discovery.failed.length > 0) {
    console.log(`\n⚠ Failed to load ${discovery.failed.length} packages:`);
    for (const { path, error } of discovery.failed) {
      console.log(`  ✗ ${path}`);
      console.log(`    ${error}`);
    }
  }

  // Create registry
  const registry = new PackageRegistry(discovery.packages);

  // Print summary
  console.log(`\n📦 Packages by kind:`);
  const stats = registry.getStats();
  for (const [kind, count] of Object.entries(stats.byKind)) {
    if (count > 0) {
      console.log(`  ${kind}: ${count}`);
    }
  }

  // Print projects
  const projects = registry.getByKind('project');
  if (projects.length > 0) {
    console.log(`\n🏗 Projects:`);
    for (const project of projects) {
      console.log(`  - ${project.id} (${project.name}) v${project.version}`);
      console.log(`    Path: ${project.sourcePath}`);

      // Print agents in this project
      if ('agents' in project && project.agents) {
        for (const agentRef of project.agents) {
          const agent = registry.get(agentRef.id);
          if (agent) {
            console.log(`    └─ Agent: ${agentRef.id} (${agentRef.name})`);
          } else {
            console.log(`    └─ Agent: ${agentRef.id} (MISSING)`);
          }
        }
      }
    }
  }

  // Print agents
  const agents = registry.getByKind('agent');
  if (agents.length > 0) {
    console.log(`\n👤 Agents:`);
    for (const agent of agents) {
      console.log(`  - ${agent.id} (${agent.name}) v${agent.version}`);
      if ('instructions' in agent && agent.instructions) {
        const preview = agent.instructions.substring(0, 60);
        console.log(`    ${preview}...`);
      }
    }
  }

  // Validate references
  console.log(`\n🔍 Validating references...`);
  const resolution = registry.resolveReferences();
  console.log(`  Total references: ${resolution.total}`);
  console.log(`  Resolved: ${resolution.resolved}`);
  console.log(`  Unresolved: ${resolution.unresolved.length}`);

  if (resolution.unresolved.length > 0) {
    console.log(`\n  Unresolved references:`);
    for (const ref of resolution.unresolved) {
      console.log(`    ✗ ${ref.kind}:${ref.id} (from ${ref.field})`);
    }
  }

  if (resolution.circular.length > 0) {
    console.log(`\n  Circular dependencies detected:`);
    for (const cycle of resolution.circular) {
      console.log(`    ${cycle.join(' → ')} → ${cycle[0]}`);
    }
  }

  return { discovery, registry };
}

/**
 * Example usage
 */
export async function exampleLoadProject() {
  try {
    const result = await loadProject('./docs/examples/decision-project');
    console.log(`\n✓ Project loaded successfully`);
    return result;
  } catch (error) {
    console.error('Error loading project:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  exampleLoadProject();
}
