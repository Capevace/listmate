/*
  Warnings:

  - The primary key for the `DataObjectRemote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `foreignId` on the `DataObjectRemote` table. All the data in the column will be lost.
  - Added the required column `uri` to the `DataObjectRemote` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DataObjectRemote" (
    "id" TEXT NOT NULL,
    "dataObjectId" TEXT NOT NULL,
    "api" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,

    PRIMARY KEY ("api", "uri"),
    CONSTRAINT "DataObjectRemote_dataObjectId_fkey" FOREIGN KEY ("dataObjectId") REFERENCES "DataObject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DataObjectRemote" ("api", "createdAt", "dataObjectId", "id", "updatedAt") SELECT "api", "createdAt", "dataObjectId", "id", "updatedAt" FROM "DataObjectRemote";
DROP TABLE "DataObjectRemote";
ALTER TABLE "new_DataObjectRemote" RENAME TO "DataObjectRemote";
CREATE UNIQUE INDEX "DataObjectRemote_id_key" ON "DataObjectRemote"("id");
CREATE UNIQUE INDEX "DataObjectRemote_dataObjectId_api_key" ON "DataObjectRemote"("dataObjectId", "api");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
