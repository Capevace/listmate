/*
  Warnings:

  - A unique constraint covering the columns `[dataObjectId,api]` on the table `DataObjectRemote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DataObjectRemote_dataObjectId_api_key" ON "DataObjectRemote"("dataObjectId", "api");
