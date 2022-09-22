-- CreateTable
CREATE TABLE "Menu" (
    "mealId" TEXT NOT NULL,
    "mealContent" TEXT NOT NULL,
    "mealType" TEXT NOT NULL,
    "mealDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("mealId")
);
