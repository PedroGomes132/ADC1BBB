/*
  Warnings:

  - A unique constraint covering the columns `[userid]` on the table `jsons` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "jsons_userid_key" ON "jsons"("userid");
