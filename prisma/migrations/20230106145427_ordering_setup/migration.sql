-- CreateTable
CREATE TABLE "Class" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "OrderCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderFinalized" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "OrderFinalized_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Placement" (
    "userId" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "placement" INTEGER NOT NULL,

    CONSTRAINT "Placement_pkey" PRIMARY KEY ("userId","categoryId","classId")
);
