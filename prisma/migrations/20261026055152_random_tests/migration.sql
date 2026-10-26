-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "forTests" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "drawCount" INTEGER,
ADD COLUMN     "drawnAt" TIMESTAMP(3);
