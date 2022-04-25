/*
  Warnings:

  - A unique constraint covering the columns `[thumbnailFileId]` on the table `DataObject` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dataObjectId` to the `List` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_List" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "dataObjectId" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverFileReferenceId" TEXT,
    CONSTRAINT "List_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "List_dataObjectId_fkey" FOREIGN KEY ("dataObjectId") REFERENCES "DataObject" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "List_coverFileReferenceId_fkey" FOREIGN KEY ("coverFileReferenceId") REFERENCES "FileReference" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_List" ("coverFileReferenceId", "createdAt", "description", "id", "title", "updatedAt", "userId") SELECT "coverFileReferenceId", "createdAt", "description", "id", "title", "updatedAt", "userId" FROM "List";
DROP TABLE "List";
ALTER TABLE "new_List" RENAME TO "List";
CREATE UNIQUE INDEX "List_dataObjectId_key" ON "List"("dataObjectId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "DataObject_thumbnailFileId_key" ON "DataObject"("thumbnailFileId");
