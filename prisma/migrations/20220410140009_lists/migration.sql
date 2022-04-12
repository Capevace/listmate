/*
  Warnings:

  - The primary key for the `DataObjectValue` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `api` on the `DataObjectValue` table. All the data in the column will be lost.
  - You are about to drop the column `foreignId` on the `DataObjectValue` table. All the data in the column will be lost.
  - You are about to drop the column `remoteId` on the `ListItem` table. All the data in the column will be lost.
  - Added the required column `dataObjectId` to the `DataObjectValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataObjectId` to the `ListItem` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DataObjectValue" (
    "dataObjectId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "valueDataObjectId" TEXT,

    PRIMARY KEY ("dataObjectId", "key"),
    CONSTRAINT "DataObjectValue_dataObjectId_fkey" FOREIGN KEY ("dataObjectId") REFERENCES "DataObject" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DataObjectValue_valueDataObjectId_fkey" FOREIGN KEY ("valueDataObjectId") REFERENCES "DataObject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DataObjectValue" ("key", "value", "valueDataObjectId") SELECT "key", "value", "valueDataObjectId" FROM "DataObjectValue";
DROP TABLE "DataObjectValue";
ALTER TABLE "new_DataObjectValue" RENAME TO "DataObjectValue";
CREATE TABLE "new_ListItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "position" INTEGER NOT NULL,
    "listId" TEXT NOT NULL,
    "dataObjectId" TEXT NOT NULL,
    CONSTRAINT "ListItem_dataObjectId_fkey" FOREIGN KEY ("dataObjectId") REFERENCES "DataObject" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ListItem" ("createdAt", "id", "listId", "position", "updatedAt") SELECT "createdAt", "id", "listId", "position", "updatedAt" FROM "ListItem";
DROP TABLE "ListItem";
ALTER TABLE "new_ListItem" RENAME TO "ListItem";
CREATE TABLE "new_DataObjectRemote" (
    "id" TEXT NOT NULL,
    "dataObjectId" TEXT NOT NULL,
    "api" TEXT NOT NULL,
    "foreignId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,

    PRIMARY KEY ("api", "foreignId"),
    CONSTRAINT "DataObjectRemote_dataObjectId_fkey" FOREIGN KEY ("dataObjectId") REFERENCES "DataObject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DataObjectRemote" ("api", "createdAt", "dataObjectId", "foreignId", "id", "updatedAt") SELECT "api", "createdAt", "dataObjectId", "foreignId", "id", "updatedAt" FROM "DataObjectRemote";
DROP TABLE "DataObjectRemote";
ALTER TABLE "new_DataObjectRemote" RENAME TO "DataObjectRemote";
CREATE UNIQUE INDEX "DataObjectRemote_id_key" ON "DataObjectRemote"("id");
CREATE UNIQUE INDEX "DataObjectRemote_dataObjectId_api_key" ON "DataObjectRemote"("dataObjectId", "api");
CREATE TABLE "new_List" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "List_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_List" ("createdAt", "description", "id", "title", "updatedAt", "userId") SELECT "createdAt", "description", "id", "title", "updatedAt", "userId" FROM "List";
DROP TABLE "List";
ALTER TABLE "new_List" RENAME TO "List";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
