-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "atk" TEXT NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valoraposado" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valordebitado" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorganho" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rtp" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "is_influencer" BOOLEAN NOT NULL DEFAULT false,
    "agentid" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agents" (
    "id" SERIAL NOT NULL,
    "agentcode" TEXT NOT NULL,
    "saldo" TEXT NOT NULL,
    "agentToken" TEXT NOT NULL,
    "secretKey" TEXT NOT NULL,
    "probganho" TEXT NOT NULL,
    "probbonus" TEXT NOT NULL,
    "probganhortp" TEXT NOT NULL,
    "probganhoinfluencer" TEXT NOT NULL,
    "probbonusinfluencer" TEXT NOT NULL,
    "probganhoaposta" TEXT NOT NULL,
    "probganhosaldo" TEXT NOT NULL,
    "callbackurl" TEXT NOT NULL,

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calls" (
    "id" SERIAL NOT NULL,
    "iduser" INTEGER NOT NULL,
    "gamecode" TEXT NOT NULL,
    "jsonname" TEXT NOT NULL,
    "steps" INTEGER NOT NULL,
    "bycall" TEXT NOT NULL,
    "aw" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "calls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jsons" (
    "id" SERIAL NOT NULL,
    "gamename" TEXT NOT NULL,
    "json" JSONB NOT NULL,

    CONSTRAINT "jsons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_token_key" ON "users"("token");

-- CreateIndex
CREATE UNIQUE INDEX "users_atk_key" ON "users"("atk");
