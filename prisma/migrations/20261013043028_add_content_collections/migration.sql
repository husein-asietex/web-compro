-- CreateTable
CREATE TABLE "ContentCollection" (
    "key" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "draft" JSONB,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentCollection_pkey" PRIMARY KEY ("key")
);
