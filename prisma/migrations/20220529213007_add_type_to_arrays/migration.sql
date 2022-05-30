-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ValueArrayItem" (
    "parentDataObjectId" TEXT NOT NULL,
    "parentKey" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'text',
    "value" TEXT NOT NULL,
    "valueDataObjectId" TEXT,

    PRIMARY KEY ("parentDataObjectId", "parentKey", "position"),
    CONSTRAINT "ValueArrayItem_valueDataObjectId_fkey" FOREIGN KEY ("valueDataObjectId") REFERENCES "DataObject" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ValueArrayItem_parentDataObjectId_parentKey_fkey" FOREIGN KEY ("parentDataObjectId", "parentKey") REFERENCES "DataObjectValue" ("dataObjectId", "key") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ValueArrayItem" ("parentDataObjectId", "parentKey", "position", "value", "valueDataObjectId") SELECT "parentDataObjectId", "parentKey", "position", "value", "valueDataObjectId" FROM "ValueArrayItem";
DROP TABLE "ValueArrayItem";
ALTER TABLE "new_ValueArrayItem" RENAME TO "ValueArrayItem";
CREATE INDEX "ValueArrayItem_parentDataObjectId_parentKey_idx" ON "ValueArrayItem"("parentDataObjectId", "parentKey");
CREATE TABLE "new_DataObjectValue" (
    "dataObjectId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'text',
    "value" TEXT,
    "valueDataObjectId" TEXT,
    "isArray" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("dataObjectId", "key"),
    CONSTRAINT "DataObjectValue_dataObjectId_fkey" FOREIGN KEY ("dataObjectId") REFERENCES "DataObject" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DataObjectValue_valueDataObjectId_fkey" FOREIGN KEY ("valueDataObjectId") REFERENCES "DataObject" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_DataObjectValue" ("dataObjectId", "isArray", "key", "type", "value", "valueDataObjectId") SELECT "dataObjectId", "isArray", "key", "type", "value", "valueDataObjectId" FROM "DataObjectValue";
DROP TABLE "DataObjectValue";
ALTER TABLE "new_DataObjectValue" RENAME TO "DataObjectValue";
CREATE INDEX "DataObjectValue_key_idx" ON "DataObjectValue"("key");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
