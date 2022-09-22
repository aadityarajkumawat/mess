/*
  Warnings:

  - A unique constraint covering the columns `[mealDate,mealType]` on the table `Menu` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "UserMealStatus" (
    "userId" TEXT NOT NULL,
    "mealId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMealStatus_userId_mealId_key" ON "UserMealStatus"("userId", "mealId");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_mealDate_mealType_key" ON "Menu"("mealDate", "mealType");
