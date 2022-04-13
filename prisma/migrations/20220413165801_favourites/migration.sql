-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DataObject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isFavourite" BOOLEAN NOT NULL DEFAULT false,
    "thumbnailFileId" TEXT,
    CONSTRAINT "DataObject_thumbnailFileId_fkey" FOREIGN KEY ("thumbnailFileId") REFERENCES "FileReference" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_DataObject" ("createdAt", "id", "thumbnailFileId", "title", "type", "updatedAt") SELECT "createdAt", "id", "thumbnailFileId", "title", "type", "updatedAt" FROM "DataObject";
DROP TABLE "DataObject";
ALTER TABLE "new_DataObject" RENAME TO "DataObject";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
