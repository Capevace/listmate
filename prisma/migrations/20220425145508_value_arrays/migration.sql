/*
  Warnings:

  - You are about to drop the column `dataObjectId` on the `List` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ValueArrayItem" (
    "parentDataObjectId" TEXT NOT NULL,
    "parentKey" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "valueDataObjectId" TEXT,
    "position" INTEGER NOT NULL,

    PRIMARY KEY ("parentDataObjectId", "parentKey"),
    CONSTRAINT "ValueArrayItem_valueDataObjectId_fkey" FOREIGN KEY ("valueDataObjectId") REFERENCES "DataObject" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ValueArrayItem_parentDataObjectId_parentKey_fkey" FOREIGN KEY ("parentDataObjectId", "parentKey") REFERENCES "DataObjectValue" ("dataObjectId", "key") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_List" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverFileReferenceId" TEXT,
    CONSTRAINT "List_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "List_coverFileReferenceId_fkey" FOREIGN KEY ("coverFileReferenceId") REFERENCES "FileReference" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_List" ("coverFileReferenceId", "createdAt", "description", "id", "title", "updatedAt", "userId") SELECT "coverFileReferenceId", "createdAt", "description", "id", "title", "updatedAt", "userId" FROM "List";
DROP TABLE "List";
ALTER TABLE "new_List" RENAME TO "List";
CREATE TABLE "new_DataObjectValue" (
    "dataObjectId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "valueDataObjectId" TEXT,
    "isArray" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("dataObjectId", "key"),
    CONSTRAINT "DataObjectValue_dataObjectId_fkey" FOREIGN KEY ("dataObjectId") REFERENCES "DataObject" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DataObjectValue_valueDataObjectId_fkey" FOREIGN KEY ("valueDataObjectId") REFERENCES "DataObject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DataObjectValue" ("dataObjectId", "key", "value", "valueDataObjectId") SELECT "dataObjectId", "key", "value", "valueDataObjectId" FROM "DataObjectValue";
DROP TABLE "DataObjectValue";
ALTER TABLE "new_DataObjectValue" RENAME TO "DataObjectValue";
CREATE INDEX "DataObjectValue_key_idx" ON "DataObjectValue"("key");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
