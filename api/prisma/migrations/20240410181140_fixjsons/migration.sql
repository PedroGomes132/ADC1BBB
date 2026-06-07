/*
  Warnings:

  - Added the required column `userid` to the `jsons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "jsons" ADD COLUMN     "userid" INTEGER NOT NULL;
