-- CreateTable
CREATE TABLE "FAQ" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "language" TEXT[] DEFAULT ARRAY['eng']::TEXT[],

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);
