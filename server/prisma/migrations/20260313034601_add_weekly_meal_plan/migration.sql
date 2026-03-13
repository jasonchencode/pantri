-- CreateTable
CREATE TABLE "MealPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MealPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealPlanDay" (
    "id" TEXT NOT NULL,
    "mealPlanId" TEXT NOT NULL,
    "dayLabel" TEXT NOT NULL,
    "breakfast" TEXT NOT NULL,
    "lunch" TEXT NOT NULL,
    "dinner" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MealPlanDay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MealPlan_userId_weekStart_idx" ON "MealPlan"("userId", "weekStart");

-- CreateIndex
CREATE INDEX "MealPlanDay_mealPlanId_sortOrder_idx" ON "MealPlanDay"("mealPlanId", "sortOrder");

-- AddForeignKey
ALTER TABLE "MealPlan" ADD CONSTRAINT "MealPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPlanDay" ADD CONSTRAINT "MealPlanDay_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "MealPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
