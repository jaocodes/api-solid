-- CreateTable
CREATE TABLE "users" (
    "is" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("is")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
