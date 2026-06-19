/**
 * Tests for PackageLoader
 */

import { PackageLoader, PackageRegistry } from '../src';
import { Agent, Tool, Skill } from '@awp/types';

describe('PackageLoader', () => {
  describe('discovery', () => {
    it('should discover packages from filesystem', async () => {
      const loader = new PackageLoader({
        rootPath: './docs/examples/decision-project',
        recursive: true,
      });

      const result = await loader.discover();

      expect(result).toBeDefined();
      expect(result.count).toBeGreaterThan(0);
      expect(result.packages).toBeDefined();
      expect(Array.isArray(result.packages)).toBe(true);
    });

    it('should handle missing directories', async () => {
      const loader = new PackageLoader({
        rootPath: './non-existent-path',
      });

      const result = await loader.discover();

      expect(result.failed.length).toBeGreaterThan(0);
    });

    it('should ignore specified directories', async () => {
      const loader = new PackageLoader({
        rootPath: './docs/examples/decision-project',
        ignore: ['tools', 'skills'],
      });

      const result = await loader.discover();

      // Should have discovered packages but skipped certain directories
      const hasTools = result.packages.some((p) => p.package.kind === 'tool');
      expect(hasTools).toBe(false);
    });
  });

  describe('validation', () => {
    it('should validate package structure', () => {
      const loader = new PackageLoader({
        rootPath: './docs/examples/decision-project',
      });

      const validPackage: Agent = {
        kind: 'agent',
        id: 'test-agent',
        name: 'Test Agent',
        version: '1.0.0',
        sourcePath: '/test/agent.yaml',
      };

      const result = loader.validate(validPackage);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      const loader = new PackageLoader({
        rootPath: './docs/examples/decision-project',
      });

      const invalidPackage = {
        id: 'test',
        // Missing: kind, name, version, sourcePath
      } as any;

      const result = loader.validate(invalidPackage);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should detect type errors', () => {
      const loader = new PackageLoader({
        rootPath: './docs/examples/decision-project',
      });

      const invalidPackage = {
        kind: 'agent',
        id: 123, // Should be string
        name: 'Test',
        version: '1.0.0',
        sourcePath: '/test/agent.yaml',
      } as any;

      const result = loader.validate(invalidPackage);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.path === 'id')).toBe(true);
    });
  });
});

describe('PackageRegistry', () => {
  let registry: PackageRegistry;
  let agent: Agent;
  let tool: Tool;
  let skill: Skill;

  beforeEach(() => {
    agent = {
      kind: 'agent',
      id: 'analyzer',
      name: 'Analyzer',
      version: '1.0.0',
      sourcePath: '/agents/analyzer/agent.yaml',
      tools: [{ id: 'search' }],
      skills: [{ id: 'analysis' }],
    };

    tool = {
      kind: 'tool',
      id: 'search',
      name: 'Search',
      version: '1.0.0',
      sourcePath: '/tools/search/search.yaml',
    };

    skill = {
      kind: 'skill',
      id: 'analysis',
      name: 'Analysis',
      version: '1.0.0',
      sourcePath: '/skills/analysis/analysis.yaml',
      tools: [{ id: 'search' }],
    };

    registry = new PackageRegistry([
      { package: agent, sourcePath: agent.sourcePath, success: true },
      { package: tool, sourcePath: tool.sourcePath, success: true },
      { package: skill, sourcePath: skill.sourcePath, success: true },
    ]);
  });

  describe('retrieval', () => {
    it('should get package by ID', () => {
      const retrieved = registry.get('analyzer');
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe('analyzer');
    });

    it('should get packages by kind', () => {
      const agents = registry.getByKind('agent');
      expect(agents.length).toBe(1);
      expect(agents[0].id).toBe('analyzer');
    });

    it('should check if package exists', () => {
      expect(registry.has('analyzer')).toBe(true);
      expect(registry.has('non-existent')).toBe(false);
    });
  });

  describe('references', () => {
    it('should extract references from packages', () => {
      const refs = registry.getReferences('analyzer');
      expect(refs.length).toBe(2); // One tool, one skill
    });

    it('should resolve tools in agent', () => {
      const tools = registry.resolveTools(agent);
      expect(tools.length).toBe(1);
      expect(tools[0].id).toBe('search');
    });

    it('should resolve skills in agent', () => {
      const skills = registry.resolveSkills(agent);
      expect(skills.length).toBe(1);
      expect(skills[0].id).toBe('analysis');
    });

    it('should find packages that reference a package', () => {
      const referencers = registry.getReferencers('search');
      expect(referencers).toContain('analyzer');
      expect(referencers).toContain('analysis');
    });
  });

  describe('dependencies', () => {
    it('should build dependency graph', () => {
      const deps = registry.getDependencies('analyzer', true);
      expect(deps.has('search')).toBe(true);
      expect(deps.has('analysis')).toBe(true);
    });

    it('should handle transitive dependencies', () => {
      const deps = registry.getDependencies('analyzer', true);
      // analyzer → skill → tool
      // So should include both skill and tool
      expect(deps.size).toBeGreaterThan(0);
    });

    it('should not include non-existent dependencies', () => {
      const agentWithMissing = {
        ...agent,
        tools: [{ id: 'non-existent' }],
      };

      registry.register({
        package: agentWithMissing,
        sourcePath: agentWithMissing.sourcePath,
        success: true,
      });

      const issues = registry.validateReferences();
      const agentIssues = issues.find((i) => i.id === agentWithMissing.id);
      expect(agentIssues?.missing.length).toBeGreaterThan(0);
    });
  });

  describe('validation', () => {
    it('should validate all references', () => {
      const issues = registry.validateReferences();
      // Should have no issues for valid references
      expect(issues.filter((i) => i.missing.length > 0)).toHaveLength(0);
    });

    it('should resolve references', () => {
      const resolution = registry.resolveReferences();
      expect(resolution.total).toBeGreaterThan(0);
      expect(resolution.resolved).toBe(resolution.total);
      expect(resolution.unresolved).toHaveLength(0);
    });

    it('should detect circular dependencies', () => {
      // Create circular reference: A → B → A
      const pkgA = {
        kind: 'tool' as const,
        id: 'package-a',
        name: 'A',
        version: '1.0.0',
        sourcePath: '/a/a.yaml',
        tools: [{ id: 'package-b' }],
      };

      const pkgB = {
        kind: 'tool' as const,
        id: 'package-b',
        name: 'B',
        version: '1.0.0',
        sourcePath: '/b/b.yaml',
        tools: [{ id: 'package-a' }],
      };

      registry.clear();
      registry.register({ package: pkgA, sourcePath: pkgA.sourcePath, success: true });
      registry.register({ package: pkgB, sourcePath: pkgB.sourcePath, success: true });

      const resolution = registry.resolveReferences();
      expect(resolution.circular.length).toBeGreaterThan(0);
    });
  });

  describe('statistics', () => {
    it('should provide registry statistics', () => {
      const stats = registry.getStats();
      expect(stats.total).toBe(3);
      expect(stats.byKind.agent).toBe(1);
      expect(stats.byKind.tool).toBe(1);
      expect(stats.byKind.skill).toBe(1);
      expect(stats.totalReferences).toBeGreaterThan(0);
    });
  });

  describe('serialization', () => {
    it('should export registry as JSON', () => {
      const json = registry.toJSON();
      expect(json.packages).toBeDefined();
      expect(Array.isArray(json.packages)).toBe(true);
      expect(json.references).toBeDefined();
      expect(Array.isArray(json.references)).toBe(true);
    });
  });
});
