-- CreateIndex
CREATE INDEX "DataObject_type_idx" ON "DataObject"("type");

-- CreateIndex
CREATE INDEX "DataObject_isFavourite_idx" ON "DataObject"("isFavourite");

-- CreateIndex
CREATE INDEX "DataObject_type_isFavourite_idx" ON "DataObject"("type", "isFavourite");

-- CreateIndex
CREATE INDEX "DataObjectValue_key_idx" ON "DataObjectValue"("key");
