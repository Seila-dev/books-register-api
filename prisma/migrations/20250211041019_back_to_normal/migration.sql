/*
  Warnings:

  - Added the required column `genre_id` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "genre_id" INTEGER NOT NULL;
