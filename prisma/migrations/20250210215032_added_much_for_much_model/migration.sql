/*
  Warnings:

  - You are about to drop the column `genre_id` on the `products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "fk_genres";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "genre_id";

-- CreateTable
CREATE TABLE "_ProductGenres" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductGenres_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProductGenres_B_index" ON "_ProductGenres"("B");

-- AddForeignKey
ALTER TABLE "_ProductGenres" ADD CONSTRAINT "_ProductGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductGenres" ADD CONSTRAINT "_ProductGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
