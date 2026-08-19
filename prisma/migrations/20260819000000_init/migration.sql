CREATE SCHEMA IF NOT EXISTS "public";

CREATE TABLE "ProjectRecord" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ProjectRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProjectMembership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProjectMembership_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ThreadRecord" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "matterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ThreadRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MessageRecord" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MessageRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AssistantRunRecord" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    CONSTRAINT "AssistantRunRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AssistantCitation" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    CONSTRAINT "AssistantCitation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EventRecord" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "payload" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EventRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProjectionRecord" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "projection" TEXT NOT NULL,
    "recordKey" TEXT NOT NULL,
    "state" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ProjectionRecord_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");
CREATE INDEX "ProjectMembership_projectId_idx" ON "ProjectMembership"("projectId");
CREATE UNIQUE INDEX "ProjectMembership_userId_projectId_key" ON "ProjectMembership"("userId", "projectId");
CREATE INDEX "ThreadRecord_projectId_matterId_idx" ON "ThreadRecord"("projectId", "matterId");
CREATE INDEX "MessageRecord_threadId_createdAt_idx" ON "MessageRecord"("threadId", "createdAt");
CREATE INDEX "AssistantRunRecord_projectId_startedAt_idx" ON "AssistantRunRecord"("projectId", "startedAt");
CREATE INDEX "EventRecord_projectId_occurredAt_idx" ON "EventRecord"("projectId", "occurredAt");
CREATE INDEX "EventRecord_projectId_targetId_idx" ON "EventRecord"("projectId", "targetId");
CREATE INDEX "ProjectionRecord_projectId_projection_idx" ON "ProjectionRecord"("projectId", "projection");
CREATE UNIQUE INDEX "ProjectionRecord_projectId_projection_recordKey_key" ON "ProjectionRecord"("projectId", "projection", "recordKey");

ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProjectMembership" ADD CONSTRAINT "ProjectMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProjectMembership" ADD CONSTRAINT "ProjectMembership_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ThreadRecord" ADD CONSTRAINT "ThreadRecord_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MessageRecord" ADD CONSTRAINT "MessageRecord_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "ThreadRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AssistantRunRecord" ADD CONSTRAINT "AssistantRunRecord_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AssistantRunRecord" ADD CONSTRAINT "AssistantRunRecord_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "ThreadRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AssistantCitation" ADD CONSTRAINT "AssistantCitation_runId_fkey" FOREIGN KEY ("runId") REFERENCES "AssistantRunRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventRecord" ADD CONSTRAINT "EventRecord_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProjectionRecord" ADD CONSTRAINT "ProjectionRecord_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
