const path = require("path")
const mysql = require("mysql2/promise")
require("dotenv").config()

const games = [
   ["bikini-paradise", "bikini-paradise/notcashbikini.js"],
   ["butterfly-blossom", "btrfly-blossom/notcashbutterfly.js"],
   ["cash-mania", "cash-mania/notcashcash.js"],
   ["chicky-run", "chicky-run/notcashchicky.js"],
   ["double-fortune", "double-fortune/notcashdouble.js"],
   ["dragon-tiger-luck", "dragon-tiger-luck/notcashdragontigerluck.js"],
   ["fortune-dragon", "fortune-dragon/notcashdragon.js"],
   ["fortune-mouse", "fortune-mouse/notcashmouse.js"],
   ["fortune-ox", "fortune-ox/notcashox.js"],
   ["fortune-rabbit", "fortune-rabbit/notcashrabbit.js"],
   ["fortune-tiger", "fortune-tiger/notcashtiger.js"],
   ["ganesha-gold", "ganesha-gold/notcashganesha.js"],
   ["gdn-ice-fire", "gdn-ice-fire/notcashicefire.js"],
   ["jungle-delight", "jungle-delight/notcashjungle.js"],
   ["lucky-clover", "lucky-clover/notcashclover.js"],
   ["majestic-ts", "majestic-ts/notcashmajestic.js"],
   ["ninja-raccoon", "ninja-raccoon/notcashraccoon.js"],
   ["piggy-gold", "piggy-gold/notcashpiggy.js"],
   ["prosper-ftree", "prosper-ftree/notcashtree.js"],
   ["rise-apollo", "rise-apollo/notcashriseapollo.js"],
   ["shaolin-soccer", "shaolin-soccer/notcashshaolin.js"],
   ["thai-river", "thai-river/notcashriver.js"],
   ["three-cz-pigs", "three-cz-pigs/notcashthreecz.js"],
   ["treasures-aztec", "treasures-aztec/notcashaztec.js"],
   ["ultimate-striker", "ultimate-striker/notcashstriker.js"],
   ["wild-bandito", "wild-bandito/notcashwildbandito.js"],
   ["wild-bounty-sd", "wild-bounty-sd/notcashbouty.js"],
   ["wings-iguazu", "wings-iguazu/notcashiguazu.js"],
   ["zombie-outbreak", "zombie-outbreak/notcashzombie.js"],
]

async function main() {
   const conn = await mysql.createConnection({
      host: process.env.DB_HOST || "127.0.0.1",
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
   })

   const distJsons = path.join(process.cwd(), "dist", "jsons")
   const results = []

   for (const [gameCode, modulePath] of games) {
      const fullPath = path.join(distJsons, modulePath)
      const module = require(fullPath)
      const notcash = module.default || module
      const seed = await notcash.notcash(100, 0.08, 1)

      await conn.execute(
         "INSERT INTO spins_inicial (game_code, json) VALUES (?, ?) ON DUPLICATE KEY UPDATE json = VALUES(json)",
         [gameCode, JSON.stringify(seed)],
      )
      results.push(gameCode)
   }

   await conn.execute("UPDATE calls SET status = 'completed' WHERE status = 'pending'")
   await conn.end()

   console.log(`Seeds configurados: ${results.length}`)
   for (const gameCode of results) {
      console.log(`- ${gameCode}`)
   }
}

main().catch((error) => {
   console.error(error)
   process.exit(1)
})
