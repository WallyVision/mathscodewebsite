-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'PAID');

-- CreateTable
CREATE TABLE "SubjectTeamMember" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubjectTeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamPayout" (
    "id" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamPayout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SubjectTeamMember_userId_idx" ON "SubjectTeamMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectTeamMember_subjectId_userId_key" ON "SubjectTeamMember"("subjectId", "userId");

-- CreateIndex
CREATE INDEX "TeamPayout_userId_period_idx" ON "TeamPayout"("userId", "period");

-- CreateIndex
CREATE UNIQUE INDEX "TeamPayout_period_subjectId_userId_key" ON "TeamPayout"("period", "subjectId", "userId");

-- AddForeignKey
ALTER TABLE "SubjectTeamMember" ADD CONSTRAINT "SubjectTeamMember_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectTeamMember" ADD CONSTRAINT "SubjectTeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamPayout" ADD CONSTRAINT "TeamPayout_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamPayout" ADD CONSTRAINT "TeamPayout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
