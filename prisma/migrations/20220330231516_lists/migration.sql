/*
  Warnings:

  - The primary key for the `DataObjectValue` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dataObjectId` on the `DataObjectValue` table. All the data in the column will be lost.
  - The primary key for the `DataObjectRemote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `api` on the `ListItem` table. All the data in the column will be lost.
  - Added the required column `foreignId` to the `DataObjectValue` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DataObjectValue" (
    "api" TEXT NOT NULL,
    "foreignId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "valueDataObjectId" TEXT,

    PRIMARY KEY ("api", "foreignId", "key"),
    CONSTRAINT "DataObjectValue_valueDataObjectId_fkey" FOREIGN KEY ("valueDataObjectId") REFERENCES "DataObject" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "DataObjectValue_api_foreignId_fkey" FOREIGN KEY ("api", "foreignId") REFERENCES "DataObjectRemote" ("api", "foreignId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DataObjectValue" ("api", "key", "value", "valueDataObjectId") SELECT "api", "key", "value", "valueDataObjectId" FROM "DataObjectValue";
DROP TABLE "DataObjectValue";
ALTER TABLE "new_DataObjectValue" RENAME TO "DataObjectValue";
CREATE TABLE "new_DataObjectRemote" (
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
CREATE TABLE "new_ListItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "position" INTEGER NOT NULL,
    "listId" TEXT NOT NULL,
    "dataObjectId" TEXT NOT NULL,
    CONSTRAINT "ListItem_dataObjectId_fkey" FOREIGN KEY ("dataObjectId") REFERENCES "DataObject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ListItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ListItem" ("createdAt", "dataObjectId", "id", "listId", "position", "updatedAt") SELECT "createdAt", "dataObjectId", "id", "listId", "position", "updatedAt" FROM "ListItem";
DROP TABLE "ListItem";
ALTER TABLE "new_ListItem" RENAME TO "ListItem";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
