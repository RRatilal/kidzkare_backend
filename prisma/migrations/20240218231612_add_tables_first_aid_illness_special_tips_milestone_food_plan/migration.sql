-- CreateTable
CREATE TABLE "first_aid" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "actionTaken" TEXT NOT NULL,

    CONSTRAINT "first_aid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "illnesses" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "childId" TEXT,

    CONSTRAINT "illnesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "special_tips" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "condition" TEXT NOT NULL,
    "tips" TEXT NOT NULL,

    CONSTRAINT "special_tips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestones" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "achieved" BOOLEAN,
    "achievedAt" TIMESTAMP(3),
    "childId" TEXT NOT NULL,

    CONSTRAINT "milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "food_plans" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "breakfast" TEXT NOT NULL,
    "morningSnack" TEXT NOT NULL,
    "lunch" TEXT NOT NULL,
    "afternoonSnack" TEXT NOT NULL,
    "dinner" TEXT NOT NULL,
    "eveningSnack" TEXT NOT NULL,
    "schoolSnack" TEXT,

    CONSTRAINT "food_plans_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "illnesses" ADD CONSTRAINT "illnesses_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
