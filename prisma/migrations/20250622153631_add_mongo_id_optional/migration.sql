/*
  Warnings:

  - A unique constraint covering the columns `[mongoId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "mongoId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_mongoId_key" ON "User"("mongoId");
