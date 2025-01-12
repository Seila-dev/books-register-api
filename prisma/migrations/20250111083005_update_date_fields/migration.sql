-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "image" VARCHAR(200) NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "stars" INTEGER,
    "genre_id" INTEGER,
    "description" TEXT,
    "startedreading" DATE,
    "endedreading" DATE,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);
