-- CreateTable
CREATE TABLE "apoloauth" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "refresh_token" TEXT NOT NULL,

    CONSTRAINT "apoloauth_pkey" PRIMARY KEY ("id")
);
