-- AlterTable
ALTER TABLE "Division" ADD COLUMN     "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "machinery" TEXT,
ADD COLUMN     "products" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "videoEn" TEXT,
ADD COLUMN     "videoId" TEXT,
ADD COLUMN     "videoPt" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altEn" TEXT NOT NULL,
    "altId" TEXT NOT NULL,
    "altPt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);
