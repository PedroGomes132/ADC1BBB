/*
  Warnings:

  - A unique constraint covering the columns `[agentToken]` on the table `agents` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[secretKey]` on the table `agents` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "agents_agentToken_key" ON "agents"("agentToken");

-- CreateIndex
CREATE UNIQUE INDEX "agents_secretKey_key" ON "agents"("secretKey");
