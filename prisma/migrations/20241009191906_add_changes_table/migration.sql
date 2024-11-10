-- CreateTable
CREATE TABLE "changes" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tableName" TEXT NOT NULL,
    "changeType" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "data" JSONB,

    CONSTRAINT "changes_pkey" PRIMARY KEY ("id")
);
