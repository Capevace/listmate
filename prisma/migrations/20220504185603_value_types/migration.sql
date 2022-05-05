/*
  Warnings:

  - You are about to drop the `List` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ListItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "List";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ListItem";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DataObjectValue" (
    "dataObjectId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'text',
    "value" TEXT NOT NULL,
    "valueDataObjectId" TEXT,
    "isArray" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("dataObjectId", "key"),
    CONSTRAINT "DataObjectValue_dataObjectId_fkey" FOREIGN KEY ("dataObjectId") REFERENCES "DataObject" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DataObjectValue_valueDataObjectId_fkey" FOREIGN KEY ("valueDataObjectId") REFERENCES "DataObject" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_DataObjectValue" ("dataObjectId", "isArray", "key", "value", "valueDataObjectId") SELECT "dataObjectId", "isArray", "key", "value", "valueDataObjectId" FROM "DataObjectValue";
DROP TABLE "DataObjectValue";
ALTER TABLE "new_DataObjectValue" RENAME TO "DataObjectValue";
CREATE INDEX "DataObjectValue_key_idx" ON "DataObjectValue"("key");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
