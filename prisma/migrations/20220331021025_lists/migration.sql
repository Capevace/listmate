/*
  Warnings:

  - You are about to drop the column `dataObjectId` on the `ListItem` table. All the data in the column will be lost.
  - The required column `id` was added to the `DataObjectRemote` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `remoteId` to the `ListItem` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DataObjectRemote" (
    "id" TEXT NOT NULL,
    "dataObjectId" TEXT NOT NULL,
    "api" TEXT NOT NULL,
    "foreignId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,

    PRIMARY KEY ("api", "foreignId"),
    CONSTRAINT "DataObjectRemote_dataObjectId_fkey" FOREIGN KEY ("dataObjectId") REFERENCES "DataObject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DataObjectRemote" ("api", "createdAt", "dataObjectId", "foreignId", "updatedAt") SELECT "api", "createdAt", "dataObjectId", "foreignId", "updatedAt" FROM "DataObjectRemote";
DROP TABLE "DataObjectRemote";
ALTER TABLE "new_DataObjectRemote" RENAME TO "DataObjectRemote";
CREATE UNIQUE INDEX "DataObjectRemote_id_key" ON "DataObjectRemote"("id");
CREATE TABLE "new_ListItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "position" INTEGER NOT NULL,
    "listId" TEXT NOT NULL,
    "remoteId" TEXT NOT NULL,
    CONSTRAINT "ListItem_remoteId_fkey" FOREIGN KEY ("remoteId") REFERENCES "DataObjectRemote" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ListItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ListItem" ("createdAt", "id", "listId", "position", "updatedAt") SELECT "createdAt", "id", "listId", "position", "updatedAt" FROM "ListItem";
DROP TABLE "ListItem";
ALTER TABLE "new_ListItem" RENAME TO "ListItem";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
