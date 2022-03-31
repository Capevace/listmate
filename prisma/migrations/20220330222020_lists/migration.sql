-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Password" (
    "hash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DataObject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DataObjectRemote" (
    "dataObjectId" TEXT NOT NULL,
    "api" TEXT NOT NULL,
    "foreignId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,

    PRIMARY KEY ("dataObjectId", "api"),
    CONSTRAINT "DataObjectRemote_dataObjectId_fkey" FOREIGN KEY ("dataObjectId") REFERENCES "DataObject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DataObjectValue" (
    "dataObjectId" TEXT NOT NULL,
    "api" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "valueDataObjectId" TEXT,

    PRIMARY KEY ("dataObjectId", "api", "key"),
    CONSTRAINT "DataObjectValue_valueDataObjectId_fkey" FOREIGN KEY ("valueDataObjectId") REFERENCES "DataObject" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "DataObjectValue_dataObjectId_api_fkey" FOREIGN KEY ("dataObjectId", "api") REFERENCES "DataObjectRemote" ("dataObjectId", "api") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "List" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "List_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ListItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "position" INTEGER NOT NULL,
    "listId" TEXT NOT NULL,
    "dataObjectId" TEXT NOT NULL,
    "api" TEXT NOT NULL,
    CONSTRAINT "ListItem_dataObjectId_api_fkey" FOREIGN KEY ("dataObjectId", "api") REFERENCES "DataObjectRemote" ("dataObjectId", "api") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ListItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Password_userId_key" ON "Password"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DataObjectRemote_api_foreignId_key" ON "DataObjectRemote"("api", "foreignId");
