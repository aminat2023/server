-- CreateTable
CREATE TABLE "Registration" (
    "id" SERIAL NOT NULL,
    "fullname" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);
