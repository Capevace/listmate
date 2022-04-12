/*
  Warnings:

  - Added the required column `filename` to the `FileReference` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FileReference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_FileReference" ("createdAt", "id") SELECT "createdAt", "id" FROM "FileReference";
DROP TABLE "FileReference";
ALTER TABLE "new_FileReference" RENAME TO "FileReference";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
