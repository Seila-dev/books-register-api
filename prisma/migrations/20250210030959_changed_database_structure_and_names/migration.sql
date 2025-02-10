/*
  Warnings:

  - You are about to drop the column `genre_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `genres` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "fk_categories";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "genre_id",
ADD COLUMN     "category_id" INTEGER;

-- DropTable
DROP TABLE "genres";

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "fk_categories" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
