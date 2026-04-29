-- CreateTable
CREATE TABLE "GuestCreditUsage" (
    "id" SERIAL NOT NULL,
    "guestId" TEXT NOT NULL,
    "usageDay" TEXT NOT NULL,
    "quizCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuestCreditUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuestCreditUsage_guestId_usageDay_key" ON "GuestCreditUsage"("guestId", "usageDay");
