-- CreateTable
CREATE TABLE "FoundingMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "subjectId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activatedAt" TIMESTAMP(3),

    CONSTRAINT "FoundingMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FoundingMember_userId_key" ON "FoundingMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FoundingMember_number_key" ON "FoundingMember"("number");

-- CreateIndex
CREATE UNIQUE INDEX "FoundingMember_paymentId_key" ON "FoundingMember"("paymentId");

-- AddForeignKey
ALTER TABLE "FoundingMember" ADD CONSTRAINT "FoundingMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoundingMember" ADD CONSTRAINT "FoundingMember_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoundingMember" ADD CONSTRAINT "FoundingMember_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
