-- CreateTable
CREATE TABLE "SourceToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "api" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME,
    "data" TEXT,
    CONSTRAINT "SourceToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "SourceToken_api_userId_key" ON "SourceToken"("api", "userId");
