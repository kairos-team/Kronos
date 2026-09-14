-- AlterTable
ALTER TABLE "Installment" ADD COLUMN "receiptFileName" TEXT;
ALTER TABLE "Installment" ADD COLUMN "receiptFileType" TEXT;

-- CreateTable
CREATE TABLE "Receipt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "installmentId" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Receipt_installmentId_fkey" FOREIGN KEY ("installmentId") REFERENCES "Installment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_installmentId_key" ON "Receipt"("installmentId");
