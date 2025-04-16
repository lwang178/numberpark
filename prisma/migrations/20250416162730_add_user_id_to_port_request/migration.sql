-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PortRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL DEFAULT 'unknown',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "transferPin" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_PortRequest" ("accountNumber", "address", "city", "createdAt", "firstName", "id", "lastName", "state", "transferPin", "zip") SELECT "accountNumber", "address", "city", "createdAt", "firstName", "id", "lastName", "state", "transferPin", "zip" FROM "PortRequest";
DROP TABLE "PortRequest";
ALTER TABLE "new_PortRequest" RENAME TO "PortRequest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
