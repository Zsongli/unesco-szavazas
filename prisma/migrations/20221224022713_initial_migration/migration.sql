-- CreateTable
CREATE TABLE "Static" (
    "id" SERIAL NOT NULL,
    "revokedTokens" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "Static_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
