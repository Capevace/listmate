-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FileReference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mimeType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataObjectId" TEXT,
    CONSTRAINT "FileReference_dataObjectId_fkey" FOREIGN KEY ("dataObjectId") REFERENCES "DataObject" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FileReference" ("createdAt", "id", "mimeType") SELECT "createdAt", "id", "mimeType" FROM "FileReference";
DROP TABLE "FileReference";
ALTER TABLE "new_FileReference" RENAME TO "FileReference";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
