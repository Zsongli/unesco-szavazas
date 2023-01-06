/*
  Warnings:

  - You are about to drop the `Static` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Static";

-- CreateTable
CREATE TABLE "RevokedToken" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "RevokedToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RevokedToken_value_key" ON "RevokedToken"("value");
