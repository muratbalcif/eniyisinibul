CREATE TABLE "AmazonDiscoveryJob" (
  "id" TEXT NOT NULL,
  "groupKey" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  "targetCount" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'DRAFT',
  "keywords" JSONB NOT NULL,
  "discoveredCount" INTEGER NOT NULL DEFAULT 0,
  "importedCount" INTEGER NOT NULL DEFAULT 0,
  "errorMessage" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "startedAt" TIMESTAMP(3),
  "finishedAt" TIMESTAMP(3),
  CONSTRAINT "AmazonDiscoveryJob_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "AmazonDiscoveryJob_targetCount_check" CHECK ("targetCount" BETWEEN 10 AND 500),
  CONSTRAINT "AmazonDiscoveryJob_status_check" CHECK ("status" IN ('DRAFT', 'QUEUED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED'))
);
CREATE INDEX "AmazonDiscoveryJob_status_createdAt_idx" ON "AmazonDiscoveryJob"("status", "createdAt");
