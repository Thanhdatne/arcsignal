-- CreateTable
CREATE TABLE "Treasury" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "totalValueLocked" REAL NOT NULL DEFAULT 0,
    "reserveBalance" REAL NOT NULL DEFAULT 0,
    "pendingPayouts" REAL NOT NULL DEFAULT 0,
    "settlementPool" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
