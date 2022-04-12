/*
  Warnings:

  - You are about to drop the column `dataObjectId` on the `FileReference` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DataObject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "thumbnailFileId" TEXT,
    CONSTRAINT "DataObject_thumbnailFileId_fkey" FOREIGN KEY ("thumbnailFileId") REFERENCES "FileReference" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_DataObject" ("createdAt", "id", "title", "type", "updatedAt") SELECT "createdAt", "id", "title", "type", "updatedAt" FROM "DataObject";
DROP TABLE "DataObject";
ALTER TABLE "new_DataObject" RENAME TO "DataObject";
CREATE TABLE "new_FileReference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mimeType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_FileReference" ("createdAt", "id", "mimeType") SELECT "createdAt", "id", "mimeType" FROM "FileReference";
DROP TABLE "FileReference";
ALTER TABLE "new_FileReference" RENAME TO "FileReference";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
