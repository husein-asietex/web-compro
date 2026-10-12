ALTER TABLE "SiteSetting"
ADD COLUMN "catalogLabelEn" TEXT NOT NULL DEFAULT 'Explore e-catalog',
ADD COLUMN "catalogLabelId" TEXT NOT NULL DEFAULT 'Buka e-catalog',
ADD COLUMN "catalogLabelPt" TEXT NOT NULL DEFAULT 'Ver e-catalog',
ADD COLUMN "catalogPlacements" TEXT[] NOT NULL DEFAULT ARRAY['home', 'products', 'division']::TEXT[],
ADD COLUMN "catalogOpenNewTab" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "MediaAsset"
ADD COLUMN "credit" TEXT,
ADD COLUMN "approved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "pageId" TEXT,
ADD COLUMN "divisionId" TEXT;

CREATE TABLE "NetworkLocation" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "address" TEXT,
  "kind" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "NetworkLocation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "NetworkLocation_slug_key" ON "NetworkLocation"("slug");

ALTER TABLE "MediaAsset"
ADD CONSTRAINT "MediaAsset_pageId_fkey"
FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "MediaAsset"
ADD CONSTRAINT "MediaAsset_divisionId_fkey"
FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE SET NULL ON UPDATE CASCADE;
