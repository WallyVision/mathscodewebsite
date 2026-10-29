-- CreateTable
CREATE TABLE "WrittenQuestion" (
    "id" TEXT NOT NULL,
    "pastPaperId" TEXT NOT NULL,
    "topicId" TEXT,
    "section" TEXT,
    "label" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "marks" INTEGER,
    "body" TEXT NOT NULL,
    "solution" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WrittenQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WrittenQuestion_topicId_idx" ON "WrittenQuestion"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "WrittenQuestion_pastPaperId_label_key" ON "WrittenQuestion"("pastPaperId", "label");

-- AddForeignKey
ALTER TABLE "WrittenQuestion" ADD CONSTRAINT "WrittenQuestion_pastPaperId_fkey" FOREIGN KEY ("pastPaperId") REFERENCES "PastPaper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WrittenQuestion" ADD CONSTRAINT "WrittenQuestion_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
