# Persistence Implementation Plan

**Phase:** 2b (Short-term)
**Timeline:** 2-3 weeks
**Owner:** Platform Architecture Team

---

## Overview

This document provides a step-by-step implementation guide for aligning persistence with Phase 2 architecture.

## Phase 2b: Immediate Implementation

### Step 1: Schema Cleanup (2-3 days)

**Objective:** Remove old schemas, create new ones

#### 1.1 Delete Old Schemas

```bash
# Files to delete from packages/schemas/
rm workspace-definition.schema.json
rm workspace-instance.schema.json
rm component-tree.schema.json
rm artifact-definition.schema.json
rm artifact-instance.schema.json
rm playbook-definition.schema.json
rm playbook-instance.schema.json
rm work-item.schema.json
rm action.schema.json
rm agent-session.schema.json
rm workspace-state.schema.json
```

**Checklist:**
- [ ] Verify no code imports these schemas
- [ ] Check git history for any recent changes
- [ ] Update .gitignore if needed
- [ ] Commit as cleanup

#### 1.2 Create New Schemas

Create `packages/schemas/project.schema.json`:
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://agent-workspace.dev/schemas/project.schema.json",
  "title": "Project",
  "type": "object",
  "required": ["id", "name", "version", "createdAt", "status"],
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "version": { "type": "string" },
    "description": { "type": "string" },
    "createdAt": { "type": "string", "format": "date-time" },
    "updatedAt": { "type": "string", "format": "date-time" },
    "createdBy": { "type": "string" },
    "status": { "type": "string", "enum": ["active", "archived", "deleted"] },
    "agents": {
      "type": "array",
      "items": { "type": "object", "properties": { "id": { "type": "string" } } }
    },
    "resources": {
      "type": "array",
      "items": { "type": "object", "properties": { "id": { "type": "string" } } }
    },
    "schedules": {
      "type": "array",
      "items": { "type": "object", "properties": { "id": { "type": "string" } } }
    },
    "metadata": { "type": "object" }
  },
  "additionalProperties": false
}
```

Create `packages/schemas/artifact.schema.json`:
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://agent-workspace.dev/schemas/artifact.schema.json",
  "title": "Artifact",
  "type": "object",
  "required": ["id", "projectId", "type", "status", "version", "createdAt"],
  "properties": {
    "id": { "type": "string" },
    "projectId": { "type": "string" },
    "type": { "type": "string" },
    "title": { "type": "string" },
    "content": { "type": "object" },
    "status": { "type": "string", "enum": ["draft", "active", "archived"] },
    "version": { "type": "number" },
    "versions": { "type": "array" },
    "createdAt": { "type": "string", "format": "date-time" },
    "createdBy": { "type": "string" },
    "updatedAt": { "type": "string", "format": "date-time" },
    "updatedBy": { "type": "string" },
    "editors": { "type": "array", "items": { "type": "string" } },
    "runId": { "type": "string" },
    "threadId": { "type": "string" },
    "metadata": { "type": "object" }
  },
  "additionalProperties": false
}
```

Create `packages/schemas/resource.schema.json`:
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://agent-workspace.dev/schemas/resource.schema.json",
  "title": "Resource",
  "type": "object",
  "required": ["id", "projectId", "name", "type", "status", "createdAt"],
  "properties": {
    "id": { "type": "string" },
    "projectId": { "type": "string" },
    "name": { "type": "string" },
    "type": { "type": "string" },
    "content": { "type": "object" },
    "schema": { "type": "object" },
    "status": { "type": "string", "enum": ["active", "archived"] },
    "createdAt": { "type": "string", "format": "date-time" },
    "createdBy": { "type": "string" },
    "accessLevel": { "type": "string", "enum": ["public", "private", "restricted"] },
    "metadata": { "type": "object" }
  },
  "additionalProperties": false
}
```

Create `packages/schemas/schedule-execution.schema.json`:
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://agent-workspace.dev/schemas/schedule-execution.schema.json",
  "title": "ScheduleExecution",
  "type": "object",
  "required": ["id", "projectId", "scheduleId", "triggeredAt", "status"],
  "properties": {
    "id": { "type": "string" },
    "projectId": { "type": "string" },
    "scheduleId": { "type": "string" },
    "triggeredAt": { "type": "string", "format": "date-time" },
    "executedAt": { "type": "string", "format": "date-time" },
    "completedAt": { "type": "string", "format": "date-time" },
    "status": { "type": "string", "enum": ["scheduled", "running", "succeeded", "failed"] },
    "runId": { "type": "string" },
    "error": { "type": "string" },
    "nextExecutionAt": { "type": "string", "format": "date-time" },
    "metadata": { "type": "object" }
  },
  "additionalProperties": false
}
```

**Checklist:**
- [ ] Create all 4 new schemas
- [ ] Validate JSON syntax
- [ ] Test with schema validators
- [ ] Add to index.d.ts and index.js
- [ ] Update README.md

#### 1.3 Update Existing Schemas

**Update `run.schema.json`:**
```diff
+ "triggeredBy": { "type": "string" },
+ "threadId": { "type": "string" },
+ "artifactIds": { "type": "array" },
+ "durationMs": { "type": "number" },
- "workspaceId": { "type": "string" }
+ "projectId": { "type": "string" }
```

**Update `thread.schema.json`:**
```diff
+ "targetKind": { "type": "string", "enum": ["artifact", "run", "agent"] },
+ "targetId": { "type": "string" },
- "workspaceId": { "type": "string" }
+ "projectId": { "type": "string" }
```

**Update `event.schema.json`:**
Add comment documenting Phase 2 events:
```json
{
  "$comment": "Phase 2 events: run.started, run.succeeded, run.failed, artifact.created, artifact.updated, thread.created, participant.joined, resource.added, schedule.executed"
}
```

**Checklist:**
- [ ] Update all 3 schemas
- [ ] Validate no breaking changes to existing fields
- [ ] Test with existing code
- [ ] Commit changes

#### 1.4 Update Schema Package

**Update `packages/schemas/index.d.ts`:**

Remove exports:
```typescript
// DELETE:
export type WorkspaceDefinition = any;
export type PlaybookDefinition = any;
export type WorkItem = any;
export type ArtifactDefinition = any;
export type ArtifactInstance = any;
export type AgentSession = any;
```

Add exports:
```typescript
// ADD:
export type Project = any;
export type Artifact = any;
export type Resource = any;
export type ScheduleExecution = any;
```

**Update `packages/schemas/README.md`:**

Add section: "Phase 2 Schema Model"
- Explain Project-centric model
- Show file structure
- Document each schema

Remove section: "Phase 1 Concepts" (if present)

**Checklist:**
- [ ] Update index.d.ts
- [ ] Update index.js
- [ ] Update README.md
- [ ] Test TypeScript compilation
- [ ] Commit

---

### Step 2: Implement FileProjectRepository (4-5 days)

**Objective:** Complete file-based persistence implementation

#### 2.1 Design File Structure

Directory layout:
```
projects/
  {projectId}/
    .metadata/
      project.json              # Project metadata
      
    runs/
      {runId}.json              # Individual runs
      
    artifacts/
      {artifactId}.json         # Artifact + versions
      
    threads/
      {threadId}/
        thread.json             # Thread metadata
        messages/
          {messageId}.json      # Individual messages
      
    resources/
      {resourceId}.json         # Individual resources
      
    schedules/
      executions/
        {scheduleId}/
          {executionId}.json    # Execution records
      
    events/
      events.jsonl              # Append-only event log
      
    .backups/
      project-{timestamp}.json  # Automatic backups
```

#### 2.2 Implement FileProjectRepository

**File:** `packages/runtime/src/file-repository.ts`

```typescript
import * as fs from 'fs/promises';
import * as path from 'path';
import { ProjectContext } from './types';
import { ProjectRepository } from './types';

export class FileProjectRepository implements ProjectRepository {
  constructor(private basePath: string = './projects') {
    // Ensure base directory exists
  }

  private getProjectPath(projectId: string): string {
    return path.join(this.basePath, projectId);
  }

  private getMetadataPath(projectId: string): string {
    return path.join(this.getProjectPath(projectId), '.metadata', 'project.json');
  }

  async save(context: ProjectContext): Promise<void> {
    const projectPath = this.getProjectPath(context.project.id);
    
    // Create directories
    await fs.mkdir(projectPath, { recursive: true });
    await fs.mkdir(path.join(projectPath, '.metadata'), { recursive: true });
    await fs.mkdir(path.join(projectPath, 'runs'), { recursive: true });
    await fs.mkdir(path.join(projectPath, 'artifacts'), { recursive: true });
    await fs.mkdir(path.join(projectPath, 'threads'), { recursive: true });
    await fs.mkdir(path.join(projectPath, 'resources'), { recursive: true });
    
    // 1. Save project metadata
    await this.saveProjectMetadata(context);
    
    // 2. Save runs
    await this.saveRuns(context);
    
    // 3. Save artifacts
    await this.saveArtifacts(context);
    
    // 4. Save threads
    await this.saveThreads(context);
    
    // 5. Save resources
    await this.saveResources(context);
    
    // 6. Append events
    await this.appendEvents(context);
  }

  async load(projectId: string): Promise<ProjectContext | undefined> {
    const projectPath = this.getProjectPath(projectId);
    
    // Check if project exists
    try {
      await fs.access(projectPath);
    } catch {
      return undefined;
    }
    
    // Load project metadata
    const project = await this.loadProjectMetadata(projectId);
    if (!project) return undefined;
    
    // Load all components
    const runs = await this.loadRuns(projectId);
    const artifacts = await this.loadArtifacts(projectId);
    const threads = await this.loadThreads(projectId);
    const resources = await this.loadResources(projectId);
    const events = await this.loadEvents(projectId);
    
    // Reconstruct ProjectContext
    const context: ProjectContext = {
      project,
      agents: [],  // Loaded separately from packages
      runs: new Map(runs.map(r => [r.id, r])),
      artifacts: new Map(artifacts.map(a => [a.id, { artifact: a, versions: [], editors: new Set(), lastModified: a.updatedAt }])),
      threads: new Map(threads.map(t => [t.id, { thread: t, participants: new Set(), messageCount: 0, lastMessageAt: undefined }])),
      resources,
      agentSessions: new Map(),
      participants: new Map(),
      events,
      schedules: [],
      metadata: {}
    };
    
    return context;
  }

  async delete(projectId: string): Promise<void> {
    const projectPath = this.getProjectPath(projectId);
    
    // Archive instead of delete
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const archivePath = path.join(this.basePath, '.archived', projectId + '-' + timestamp);
    
    try {
      await fs.mkdir(path.dirname(archivePath), { recursive: true });
      await fs.rename(projectPath, archivePath);
    } catch (error) {
      console.error(`Failed to archive project ${projectId}:`, error);
      throw error;
    }
  }

  async list(): Promise<string[]> {
    try {
      const entries = await fs.readdir(this.basePath, { withFileTypes: true });
      return entries
        .filter(e => e.isDirectory() && !e.name.startsWith('.'))
        .map(e => e.name);
    } catch {
      return [];
    }
  }

  private async saveProjectMetadata(context: ProjectContext): Promise<void> {
    const metadataPath = this.getMetadataPath(context.project.id);
    const metadata = { ...context.project };
    
    await this.writeJsonFile(metadataPath, metadata);
  }

  private async loadProjectMetadata(projectId: string): Promise<any | undefined> {
    const metadataPath = this.getMetadataPath(projectId);
    
    try {
      const data = await fs.readFile(metadataPath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return undefined;
    }
  }

  private async saveRuns(context: ProjectContext): Promise<void> {
    const runsPath = path.join(this.getProjectPath(context.project.id), 'runs');
    
    for (const run of context.runs.values()) {
      const runPath = path.join(runsPath, run.id + '.json');
      await this.writeJsonFile(runPath, run);
    }
  }

  private async loadRuns(projectId: string): Promise<any[]> {
    const runsPath = path.join(this.getProjectPath(projectId), 'runs');
    
    try {
      const files = await fs.readdir(runsPath);
      const runs = [];
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const data = await fs.readFile(path.join(runsPath, file), 'utf-8');
          runs.push(JSON.parse(data));
        }
      }
      
      return runs;
    } catch {
      return [];
    }
  }

  // Similar methods for artifacts, threads, resources, events
  // ... (abbreviated for space)

  private async writeJsonFile(filePath: string, data: any): Promise<void> {
    const content = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, content, 'utf-8');
  }

  private async appendEvents(context: ProjectContext): Promise<void> {
    const eventsPath = path.join(this.getProjectPath(context.project.id), 'events', 'events.jsonl');
    const eventsDir = path.dirname(eventsPath);
    
    await fs.mkdir(eventsDir, { recursive: true });
    
    // Append new events as JSONL
    const lines = context.events
      .map(e => JSON.stringify(e))
      .join('\n');
    
    await fs.appendFile(eventsPath, lines + '\n', 'utf-8');
  }

  private async loadEvents(projectId: string): Promise<any[]> {
    const eventsPath = path.join(this.getProjectPath(projectId), 'events', 'events.jsonl');
    
    try {
      const content = await fs.readFile(eventsPath, 'utf-8');
      return content
        .split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line));
    } catch {
      return [];
    }
  }
}
```

**Checklist:**
- [ ] Implement all methods
- [ ] Handle directory creation
- [ ] Handle missing files gracefully
- [ ] Archive on delete
- [ ] JSONL format for events
- [ ] Atomic writes with temp files
- [ ] Error handling and recovery

#### 2.3 Add Tests

**File:** `packages/runtime/__tests__/file-repository.test.ts`

```typescript
import { FileProjectRepository } from '../src/file-repository';
import { ProjectContext } from '../src/types';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

describe('FileProjectRepository', () => {
  let repo: FileProjectRepository;
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'awp-test-'));
    repo = new FileProjectRepository(tempDir);
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true });
  });

  it('should save and load project', async () => {
    const context: ProjectContext = {
      project: { id: 'p1', name: 'Test', version: '1.0.0', ... },
      agents: [],
      runs: new Map(),
      artifacts: new Map(),
      threads: new Map(),
      resources: [],
      // ... other fields
    };

    await repo.save(context);
    const loaded = await repo.load('p1');

    expect(loaded?.project.id).toBe('p1');
  });

  it('should return undefined for missing project', async () => {
    const loaded = await repo.load('missing');
    expect(loaded).toBeUndefined();
  });

  it('should list projects', async () => {
    // Create a few projects
    const ids = ['p1', 'p2', 'p3'];
    
    for (const id of ids) {
      const context = { project: { id, ... }, ... };
      await repo.save(context);
    }

    const projects = await repo.list();
    expect(projects).toContain('p1');
    expect(projects).toContain('p2');
  });

  it('should archive project on delete', async () => {
    const context = { project: { id: 'p1', ... }, ... };
    await repo.save(context);
    
    await repo.delete('p1');
    
    // Project should not be loadable
    const loaded = await repo.load('p1');
    expect(loaded).toBeUndefined();
  });
});
```

**Checklist:**
- [ ] Create test file
- [ ] Test save/load
- [ ] Test delete/archive
- [ ] Test list
- [ ] Test error handling
- [ ] All tests pass

#### 2.4 Update Runtime Package

**Update `packages/runtime/src/index.ts`:**

```typescript
export { ProjectRuntime } from './project-runtime';
export { InMemoryProjectRepository, FileProjectRepository } from './repositories';
export type { ProjectRepository, ProjectContext, ... } from './types';
```

**Update `packages/runtime/README.md`:**

Add section: "Persistence"
- Explain InMemoryProjectRepository
- Explain FileProjectRepository
- Show usage examples

**Checklist:**
- [ ] Export new class
- [ ] Update documentation
- [ ] Add examples
- [ ] All tests pass

---

### Step 3: Create @awp/persistence Package (3-4 days)

**Objective:** Extract and enhance persistence interfaces

#### 3.1 Create Package Structure

```
packages/persistence/
  src/
    types.ts          # Repository interfaces
    memory.ts         # InMemoryProjectRepository
    file.ts           # FileProjectRepository
    utils.ts          # Backup, restore, migration
    index.ts          # Exports
  examples/
    backup-restore.ts
  __tests__/
    repositories.test.ts
  package.json
  tsconfig.json
  README.md
```

#### 3.2 Implement Utilities

**File:** `packages/persistence/src/utils.ts`

```typescript
export interface BackupOptions {
  timestamp?: boolean;
  compress?: boolean;
  verify?: boolean;
}

export async function backupProject(
  repo: ProjectRepository,
  projectId: string,
  backupPath: string,
  options?: BackupOptions
): Promise<void> {
  // Load project
  const context = await repo.load(projectId);
  if (!context) throw new Error(`Project not found: ${projectId}`);
  
  // Create backup file
  const timestamp = options?.timestamp ? `-${new Date().toISOString()}` : '';
  const backupFile = `${backupPath}/${projectId}${timestamp}.backup.json`;
  
  // Save backup
  await fs.writeFile(
    backupFile,
    JSON.stringify(context, null, 2)
  );
  
  console.log(`Backup created: ${backupFile}`);
}

export async function restoreProject(
  repo: ProjectRepository,
  backupFile: string
): Promise<void> {
  // Load backup
  const data = await fs.readFile(backupFile, 'utf-8');
  const context = JSON.parse(data);
  
  // Verify
  if (!context.project?.id) {
    throw new Error('Invalid backup file');
  }
  
  // Restore
  await repo.save(context);
  
  console.log(`Project restored from: ${backupFile}`);
}
```

**Checklist:**
- [ ] Implement backup function
- [ ] Implement restore function
- [ ] Implement verification
- [ ] Error handling
- [ ] Tests for utilities

---

### Step 4: Update ProjectRuntime Integration (2-3 days)

**Objective:** Wire up persistence into ProjectRuntime

#### 4.1 Update ProjectRuntime Constructor

```typescript
export class ProjectRuntime {
  constructor(
    private registry: PackageRegistry,
    private repository: ProjectRepository = new InMemoryProjectRepository()
  ) {
    // Now can use repository for persistence
  }

  async initializeProject(options: InitializeOptions): Promise<ProjectContext> {
    const context = await super.initializeProject(options);
    
    // Persist after initialization
    await this.repository.save(context);
    
    return context;
  }

  async executeRun(projectId: string, request: RunRequest): Promise<RunResult> {
    // Execute run
    const result = await super.executeRun(projectId, request);
    
    // Persist updated context
    const context = this.getProjectContext(projectId);
    if (context) {
      await this.repository.save(context);
    }
    
    return result;
  }
}
```

**Checklist:**
- [ ] Add repository parameter
- [ ] Update initialization
- [ ] Update execution
- [ ] Persist after each mutation
- [ ] Handle errors gracefully

#### 4.2 Create Example with FileRepository

**File:** `packages/runtime/examples/file-persistence.ts`

```typescript
import { ProjectRuntime } from '../src';
import { FileProjectRepository } from '../src/repositories';
import { PackageLoader } from '@awp/loader';

async function demonstrateFilePersistence() {
  console.log('📁 File Persistence Example\n');

  // Create repository with file storage
  const fileRepo = new FileProjectRepository('./projects');

  // Load packages
  const loader = new PackageLoader({ rootPath: './my-project' });
  const discovery = await loader.discover();
  const registry = new PackageRegistry(discovery.packages);

  // Create runtime with file persistence
  const runtime = new ProjectRuntime(registry, fileRepo);

  // Initialize project
  console.log('Creating project...');
  const context = await runtime.initializeProject({
    project: discovery.packages[0].package as Project,
  });

  console.log(`✓ Project created and saved to ./projects/${context.project.id}\n`);

  // Execute run
  console.log('Executing run...');
  const result = await runtime.executeRun(context.project.id, {
    targetKind: 'agent',
    targetId: 'analyzer',
    triggeredBy: 'user-001',
  });

  console.log(`✓ Run executed and persisted\n`);

  // Reload project
  console.log('Reloading project from disk...');
  const reloaded = await fileRepo.load(context.project.id);

  if (reloaded) {
    console.log(`✓ Project reloaded: ${reloaded.runs.size} runs, ${reloaded.artifacts.size} artifacts\n`);
  }

  // List all projects
  console.log('Listing all projects...');
  const projects = await fileRepo.list();
  console.log(`✓ Found ${projects.length} projects`);
  for (const id of projects) {
    console.log(`  - ${id}`);
  }
}
```

**Checklist:**
- [ ] Create example file
- [ ] Show file creation
- [ ] Show persistence
- [ ] Show reload
- [ ] Works end-to-end

---

## Phase 2c: Database Persistence (Future)

### Planned for Phase 3:

1. **DatabaseProjectRepository**
   - PostgreSQL/MySQL implementation
   - Connection pooling
   - Transaction support

2. **SQL Schema**
   - Tables for each concept
   - Proper indexing
   - Foreign keys

3. **Query APIs**
   - Find runs by agent
   - Find artifacts by status
   - Find threads by participant
   - Event filtering

4. **Migration Tools**
   - File → Database
   - Backup before migration
   - Verification after

---

## Testing Strategy

### Unit Tests
- Each repository implementation
- Utility functions
- Error handling

### Integration Tests
- Save and load consistency
- Directory creation
- File handling
- Archive on delete

### Performance Tests
- Large project loading
- Concurrent saves
- Query performance

### Compatibility Tests
- Old data handling
- Migration correctness
- Backward compatibility

---

## Rollout Plan

### Week 1
- [ ] PR 1: Schema cleanup (delete old, create new)
- [ ] PR 2: Update existing schemas
- [ ] Merge and verify no breakage

### Week 2
- [ ] PR 3: FileProjectRepository implementation
- [ ] PR 4: Tests and documentation
- [ ] Merge and verify

### Week 3
- [ ] PR 5: @awp/persistence package
- [ ] PR 6: ProjectRuntime integration
- [ ] Examples and documentation

### Week 4+
- [ ] Database persistence (Phase 3)
- [ ] Query APIs
- [ ] Migration tools

---

## Risk Mitigation

### Risk 1: Breaking Changes
**Mitigation:**
- Thorough compatibility testing
- Clear deprecation path
- Migration guide

### Risk 2: Data Loss
**Mitigation:**
- Atomic file operations
- Automatic backups
- Archive on delete

### Risk 3: Performance
**Mitigation:**
- Test with large datasets
- Profile file operations
- Optimize indexing (database)

---

## Success Criteria

✅ All old schemas deleted
✅ All new schemas created and validated
✅ FileProjectRepository fully implemented
✅ 100% test coverage
✅ Zero breaking changes to public API
✅ Documentation updated
✅ Examples working end-to-end
✅ No performance regressions

---

## Conclusion

This plan provides a clear, implementable path to align persistence with Phase 2 architecture. Each step is concrete and measurable.

**Start with schema cleanup, move to FileProjectRepository, then create persistence package. Database comes later in Phase 3.**
