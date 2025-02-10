/*
  Warnings:

  - You are about to drop the column `category_id` on the `products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "fk_genres";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "category_id",
ADD COLUMN     "genre_id" INTEGER;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "fk_genres" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE SET NULL ON UPDATE CASCADE;
