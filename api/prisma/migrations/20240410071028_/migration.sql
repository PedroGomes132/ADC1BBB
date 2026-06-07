/*
  Warnings:

  - You are about to drop the column `valoraposado` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "valoraposado",
ADD COLUMN     "valorapostado" DOUBLE PRECISION NOT NULL DEFAULT 0;
