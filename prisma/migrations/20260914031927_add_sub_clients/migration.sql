-- CreateTable
CREATE TABLE "SubClient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SubClient_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Service" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "subClientId" TEXT,
    "description" TEXT NOT NULL,
    "totalValue" REAL NOT NULL,
    "paymentType" TEXT NOT NULL,
    "installmentsCount" INTEGER NOT NULL DEFAULT 1,
    "firstPaymentDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Service_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Service_subClientId_fkey" FOREIGN KEY ("subClientId") REFERENCES "SubClient" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Service" ("clientId", "createdAt", "description", "firstPaymentDate", "id", "installmentsCount", "paymentType", "totalValue") SELECT "clientId", "createdAt", "description", "firstPaymentDate", "id", "installmentsCount", "paymentType", "totalValue" FROM "Service";
DROP TABLE "Service";
ALTER TABLE "new_Service" RENAME TO "Service";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "SubClient_clientId_name_key" ON "SubClient"("clientId", "name");
