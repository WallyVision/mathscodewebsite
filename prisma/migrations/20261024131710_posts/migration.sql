-- CreateEnum
CREATE TYPE "PostCategory" AS ENUM ('SCHOLARSHIP', 'JOB', 'TRAVEL', 'FINANCE', 'CAREER');

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "category" "PostCategory" NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "externalUrl" TEXT,
    "organisation" TEXT,
    "location" TEXT,
    "deadline" TIMESTAMP(3),
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");

-- CreateIndex
CREATE INDEX "Post_category_status_publishedAt_idx" ON "Post"("category", "status", "publishedAt");
