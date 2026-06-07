CREATE DATABASE IF NOT EXISTS `phillypsapi`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'phillypsapi'@'127.0.0.1' IDENTIFIED BY '8B7c6rc2kjWh8GjR';
CREATE USER IF NOT EXISTS 'phillypsapi'@'localhost' IDENTIFIED BY '8B7c6rc2kjWh8GjR';
GRANT ALL PRIVILEGES ON `phillypsapi`.* TO 'phillypsapi'@'127.0.0.1';
GRANT ALL PRIVILEGES ON `phillypsapi`.* TO 'phillypsapi'@'localhost';
FLUSH PRIVILEGES;

USE `phillypsapi`;

CREATE TABLE IF NOT EXISTS `agents` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `agentCode` VARCHAR(191) NULL,
  `senha` VARCHAR(191) NOT NULL DEFAULT 'demo',
  `saldo` DECIMAL(18,2) NOT NULL DEFAULT 0,
  `agentToken` VARCHAR(191) NOT NULL,
  `secretKey` VARCHAR(191) NOT NULL,
  `probganho` INT NOT NULL DEFAULT 50,
  `probbonus` INT NOT NULL DEFAULT 10,
  `probganhortp` INT NOT NULL DEFAULT 40,
  `probganhoinfluencer` INT NOT NULL DEFAULT 80,
  `probbonusinfluencer` INT NOT NULL DEFAULT 20,
  `probganhoaposta` INT NOT NULL DEFAULT 30,
  `probganhosaldo` INT NOT NULL DEFAULT 20,
  `limitadorchicky` INT NOT NULL DEFAULT 5,
  `callbackurl` VARCHAR(500) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `agents_agentToken_key` (`agentToken`),
  UNIQUE KEY `agents_secretKey_key` (`secretKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(191) NOT NULL,
  `token` VARCHAR(191) NOT NULL,
  `atk` VARCHAR(191) NOT NULL,
  `saldo` DECIMAL(18,2) NOT NULL DEFAULT 0,
  `valorapostado` DECIMAL(18,2) NOT NULL DEFAULT 0,
  `valordebitado` DECIMAL(18,2) NOT NULL DEFAULT 0,
  `valorganho` DECIMAL(18,2) NOT NULL DEFAULT 0,
  `rtp` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `isinfluencer` TINYINT(1) NOT NULL DEFAULT 0,
  `is_influencer` TINYINT(1) NOT NULL DEFAULT 0,
  `agentid` INT NOT NULL,
  `linha_ganho` TEXT NULL,
  `email` VARCHAR(191) NULL,
  `password` VARCHAR(191) NULL,
  `number_phone` VARCHAR(50) NULL,
  `cpf` VARCHAR(50) NULL,
  `ref_id` VARCHAR(191) NULL,
  `ip` VARCHAR(80) NULL,
  `data_registro` VARCHAR(80) NULL,
  `indicadode` VARCHAR(191) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_token_key` (`token`),
  UNIQUE KEY `users_atk_key` (`atk`),
  KEY `users_agent_username_idx` (`agentid`, `username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `calls` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `iduser` INT NOT NULL,
  `gamecode` VARCHAR(191) NOT NULL,
  `jsonname` VARCHAR(191) NOT NULL,
  `steps` INT NOT NULL DEFAULT 0,
  `bycall` VARCHAR(191) NOT NULL DEFAULT 'system',
  `aw` DECIMAL(18,2) NOT NULL DEFAULT 0,
  `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`),
  KEY `calls_user_status_game_idx` (`iduser`, `status`, `gamecode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `spins` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `game_code` VARCHAR(191) NOT NULL,
  `json` LONGTEXT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `spins_user_id_key` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `spins_inicial` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `game_code` VARCHAR(191) NOT NULL,
  `json` LONGTEXT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `spins_inicial_game_code_key` (`game_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `last_spin` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `token` VARCHAR(191) NOT NULL,
  `gamename` VARCHAR(191) NOT NULL,
  `last_spin_result` LONGTEXT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `last_spin_token_game_key` (`token`, `gamename`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `bikineparadisejson` (`id` INT NOT NULL, `JSON` LONGTEXT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS `butterflyblossomplayerjson` (`id` INT NOT NULL, `JSON` LONGTEXT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS `cashmaniaplayerjson` (`id` INT NOT NULL, `JSON` LONGTEXT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS `chickyrunjson` (`id` INT NOT NULL, `JSON` LONGTEXT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS `doublefortunejson` (`id` INT NOT NULL, `JSON` LONGTEXT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS `dragontigerluckjson` (`id` INT NOT NULL, `JSON` LONGTEXT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS `fortunedragonplayerjson` (`id` INT NOT NULL, `JSON` LONGTEXT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS `fortunemouseplayerjson` (`id` INT NOT NULL, `JSON` LONGTEXT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS `fortuneoxrplayerjson` (`id` INT NOT NULL, `JSON` LONGTEXT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS `fortunerabbitplayerjson` (`id` INT NOT NULL, `JSON` LONGTEXT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS `fortunetigerplayerjson` (`id` INT NOT NULL, `JSON` LONGTEXT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS `fortunetreejson` (`id` INT NOT NULL, `JSON` LONGTEXT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS `ganeshagoldjson` (`id` INT NOT NULL, `JSON` LONGTEXT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS `jungledelightjson` (`id` INT NOT NULL, `JSON` LONGTEXT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS `luckycloverjson` (`id` INT NOT NULL, `JSON` LONGTEXT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS `majestictsjson` (`id` INT NOT NULL, `JSON` LONGTEXT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS `ninjaraccoonjson` (`id` INT NOT NULL, `JSON` LONGTEXT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS `piggygoldjson` (`id` INT NOT NULL, `JSON` LONGTEXT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS `riseapollojson` (`id` INT NOT NULL, `JSON` LONGTEXT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS `ultimatestrikerjson` (`id` INT NOT NULL, `JSON` LONGTEXT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS `wildapejson` (`id` INT NOT NULL, `JSON` LONGTEXT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS `wildbanditojson` (`id` INT NOT NULL, `JSON` LONGTEXT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS `wingsiguazujson` (`id` INT NOT NULL, `JSON` LONGTEXT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS `zombieoutbreakjson` (`id` INT NOT NULL, `JSON` LONGTEXT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `agents` (
  `id`, `agentCode`, `senha`, `saldo`, `agentToken`, `secretKey`,
  `probganho`, `probbonus`, `probganhortp`, `probganhoinfluencer`,
  `probbonusinfluencer`, `probganhoaposta`, `probganhosaldo`, `callbackurl`
) VALUES (
  1, 'demo', 'demo', 0, 'demo-token', 'demo-secret',
  50, 10, 40, 80, 20, 30, 20, ''
) ON DUPLICATE KEY UPDATE
  `agentCode` = VALUES(`agentCode`),
  `secretKey` = VALUES(`secretKey`);
