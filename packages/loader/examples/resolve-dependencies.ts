/**
 * Example: Analyze dependencies and find issues
 */

import { PackageLoader, PackageRegistry } from '../src';

/**
 * Analyze dependencies in a project
 */
async function analyzeDependencies(projectPath: string) {
  console.log(`Analyzing dependencies in: ${projectPath}\n`);

  const loader = new PackageLoader({
    rootPath: projectPath,
    recursive: true,
  });

  const discovery = await loader.discover();
  const registry = new PackageRegistry(discovery.packages);

  // Print dependency tree for each agent
  const agents = registry.getByKind('agent');
  console.log(`📊 Agent Dependencies:\n`);

  for (const agent of agents) {
    console.log(`Agent: ${agent.id}`);

    // Direct tools
    if ('tools' in agent && agent.tools && agent.tools.length > 0) {
      console.log(`  Tools:`);
      for (const toolRef of agent.tools) {
        const tool = registry.get(toolRef.id);
        const status = tool ? '✓' : '✗';
        console.log(`    ${status} ${toolRef.id}`);
      }
    }

    // Direct skills
    if ('skills' in agent && agent.skills && agent.skills.length > 0) {
      console.log(`  Skills:`);
      for (const skillRef of agent.skills) {
        const skill = registry.get(skillRef.id);
        const status = skill ? '✓' : '✗';
        console.log(`    ${status} ${skillRef.id}`);

        // Transitive tool dependencies
        if (skill && 'tools' in skill && skill.tools) {
          for (const toolRef of skill.tools) {
            const tool = registry.get(toolRef.id);
            const toolStatus = tool ? '✓' : '✗';
            console.log(`      → ${toolStatus} ${toolRef.id}`);
          }
        }
      }
    }

    // All transitive dependencies
    const allDeps = registry.getDependencies(agent.id, true);
    console.log(`  Total dependencies (transitive): ${allDeps.size}`);

    console.log();
  }

  // Find unused packages
  console.log(`\n🔍 Unused Packages:\n`);
  const allPackages = registry.getAll();
  let unusedCount = 0;

  for (const pkg of allPackages) {
    const referencers = registry.getReferencers(pkg.id);
    if (referencers.length === 0 && pkg.kind !== 'project') {
      unusedCount++;
      console.log(`  ${pkg.kind}: ${pkg.id} (${pkg.name})`);
      console.log(`    Path: ${pkg.sourcePath}`);
    }
  }

  if (unusedCount === 0) {
    console.log('  (none)');
  }

  // Find circular dependencies
  console.log(`\n⚠ Circular Dependencies:\n`);
  const validation = registry.validateReferences();
  const resolution = registry.resolveReferences();

  if (resolution.circular.length === 0) {
    console.log('  (none)');
  } else {
    for (const cycle of resolution.circular) {
      console.log(`  ${cycle.join(' → ')} → ${cycle[0]}`);
    }
  }

  // Show reference statistics
  console.log(`\n📈 Reference Statistics:`);
  console.log(`  Total packages: ${allPackages.length}`);
  console.log(`  Total references: ${resolution.total}`);
  console.log(`  Resolved: ${resolution.resolved}`);
  console.log(`  Unresolved: ${resolution.unresolved.length}`);

  return { registry, resolution };
}

/**
 * Example: Analyze a specific agent's dependencies
 */
async function analyzeAgentDependencies(projectPath: string, agentId: string) {
  console.log(`\nDetailed dependency analysis for agent: ${agentId}\n`);

  const loader = new PackageLoader({ rootPath: projectPath });
  const discovery = await loader.discover();
  const registry = new PackageRegistry(discovery.packages);

  const agent = registry.get(agentId);
  if (!agent) {
    console.error(`Agent not found: ${agentId}`);
    return;
  }

  console.log(`Agent: ${agent.name} (${agent.id})`);
  console.log(`Version: ${agent.version}`);

  // Direct dependencies
  const directTools = registry.resolveTools(agent);
  const directSkills = registry.resolveSkills(agent);

  console.log(`\nDirect dependencies:`);
  console.log(`  ${directTools.length} tools`);
  console.log(`  ${directSkills.length} skills`);

  // Transitive dependencies
  const allDeps = registry.getDependencies(agent.id, true);
  console.log(`\nTransitive dependencies: ${allDeps.size}`);

  const depsByKind: Record<string, number> = {};
  for (const dep of allDeps.values()) {
    depsByKind[dep.kind] = (depsByKind[dep.kind] || 0) + 1;
  }

  for (const [kind, count] of Object.entries(depsByKind)) {
    console.log(`  ${kind}: ${count}`);
  }

  // Reverse dependencies (who uses this agent?)
  const referencers = registry.getReferencers(agent.id);
  console.log(`\nReversed dependencies (used by ${referencers.length} packages):`);
  for (const refId of referencers) {
    const pkg = registry.get(refId);
    if (pkg) {
      console.log(`  ${pkg.kind}: ${pkg.id}`);
    }
  }
}

/**
 * Example usage
 */
export async function exampleAnalyzeDependencies() {
  try {
    const projectPath = './docs/examples/decision-project';

    // Analyze all dependencies
    await analyzeDependencies(projectPath);

    // Analyze specific agent
    await analyzeAgentDependencies(projectPath, 'decision-analyzer');
  } catch (error) {
    console.error('Error analyzing dependencies:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  exampleAnalyzeDependencies();
}
