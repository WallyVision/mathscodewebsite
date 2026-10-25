-- CreateEnum
CREATE TYPE "EntrySource" AS ENUM ('MEMBERSHIP', 'EXTRA');

-- AlterEnum
ALTER TYPE "PaymentPurpose" ADD VALUE 'COMPETITION_ENTRY';

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "competitionOpen" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "CompetitionEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "source" "EntrySource" NOT NULL,
    "income" INTEGER NOT NULL,
    "paymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompetitionEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CompetitionEntry_userId_subjectId_endsAt_idx" ON "CompetitionEntry"("userId", "subjectId", "endsAt");

-- CreateIndex
CREATE INDEX "CompetitionEntry_subjectId_createdAt_idx" ON "CompetitionEntry"("subjectId", "createdAt");

-- AddForeignKey
ALTER TABLE "CompetitionEntry" ADD CONSTRAINT "CompetitionEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionEntry" ADD CONSTRAINT "CompetitionEntry_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionEntry" ADD CONSTRAINT "CompetitionEntry_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
