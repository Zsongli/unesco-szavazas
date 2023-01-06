/*
  Warnings:

  - The primary key for the `OrderFinalized` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `OrderFinalized` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrderFinalized" DROP CONSTRAINT "OrderFinalized_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "OrderFinalized_pkey" PRIMARY KEY ("userId", "categoryId");
