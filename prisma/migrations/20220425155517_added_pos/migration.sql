/*
  Warnings:

  - The primary key for the `ValueArrayItem` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ValueArrayItem" (
    "parentDataObjectId" TEXT NOT NULL,
    "parentKey" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "valueDataObjectId" TEXT,

    PRIMARY KEY ("parentDataObjectId", "parentKey", "position"),
    CONSTRAINT "ValueArrayItem_valueDataObjectId_fkey" FOREIGN KEY ("valueDataObjectId") REFERENCES "DataObject" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ValueArrayItem_parentDataObjectId_parentKey_fkey" FOREIGN KEY ("parentDataObjectId", "parentKey") REFERENCES "DataObjectValue" ("dataObjectId", "key") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ValueArrayItem" ("parentDataObjectId", "parentKey", "position", "value", "valueDataObjectId") SELECT "parentDataObjectId", "parentKey", "position", "value", "valueDataObjectId" FROM "ValueArrayItem";
DROP TABLE "ValueArrayItem";
ALTER TABLE "new_ValueArrayItem" RENAME TO "ValueArrayItem";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
