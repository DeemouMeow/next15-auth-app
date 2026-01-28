/*
  Warnings:

  - Added the required column `old_email` to the `EmailChangeRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmailChangeRequest" ADD COLUMN     "old_email" TEXT NOT NULL;
