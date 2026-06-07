import { Router } from "express"

import sessioncontroller from "./controllers/sessioncontroller"
import apicontroller from "./controllers/apicontroller"

//CONTROLLERS GAMES
import fortunetiger from "./controllers/fortune-tiger/fortunetiger"
import fortuneox from "./controllers/fortune-ox/fortuneox"
import fortunemouse from "./controllers/fortune-mouse/fortunemouse"
import fortunedragon from "./controllers/fortune-dragon/fortunedragon"
import fortunerabbit from "./controllers/fortune-rabbit/fortunerabbit"
import bikiniparadise from "./controllers/bikini-paradise/bikiniparadise"
import jungledelight from "./controllers/jungle-dlight/jungledelight"
import doublefortune from "./controllers/double-fortune/doublefortune"
import ganeshagold from "./controllers/ganesha-gold/ganeshagold"
import dragontigerluck from "./controllers/dragon-tiger-luck/dragontigerluck"
import cashmania from "./controllers/cash-mania/cashmania"
import ultimatestriker from "./controllers/ultimate-striker/ultimatestriker"
import butterflyBlossom from "./controllers/btrfly-blossom/butterfly-blossom"
import luckyclover from "./controllers/lucky-clover/luckyclover"
import ninjaraccoon from "./controllers/ninja-raccoon/ninjaraccoon"
import fortunetree from "./controllers/prosper-ftree/prosperftree"
import chickyrun from "./controllers/chicky-run/chickyrun"
import wingsiguazu from "./controllers/wings-iguazu/wingsiguazu"
import piggygold from "./controllers/piggy-gold/piggygold"
import jeanlula from "./controllers/wild-bandito/wildbandito"
import zombieoutbreak from "./controllers/zombie-outbreak/zombieoutbreak"
import majesticts from "./controllers/majestic-ts/majesticts"
//import aztec from "./controllers/treasures-aztec/treasuresaztec"
import river from "./controllers/thai-river/thairiver"
import shaolin from "./controllers/shaolin-soccer/shaolinsoccer"
import icefire from "./controllers/gdn-ice-fire/gdnicefire"
import riseapollo from "./controllers/rise-apollo/riseapollo"
import wildbountysd from "./controllers/wild-bounty-sd/wildbountrysd"
import aztec from "./controllers/treasures-aztec/treasuresaztec"
import threeczpigs from "./controllers/three-cz-pigs/threeczpigs"
//import wildape from "./controllers/wild-ape/wildape"

const routes = Router()

//CONTROLLER SESSION
routes.post("/web-api/game-proxy/v2/Resources/GetByReferenceIdsResourceTypeIds", sessioncontroller.GetByReferenceIdsResourceTypeIds)
routes.post("/web-api/game-proxy/v2/Resources/GetByResourcesTypeIds", sessioncontroller.resourcetypeids)
routes.post("/web-api/game-proxy/v2/GameName/Get", sessioncontroller.gamename)
routes.post("/web-api/game-proxy/v2/GameRule/Get", sessioncontroller.gamesrules)
routes.post("/web-api/game-proxy/v2/BetSummary/Get", sessioncontroller.betsummary)
routes.post("/web-api/game-proxy/v2/BetHistory/Get", sessioncontroller.bethistory)

//RED TIGER
routes.post("/rtg/platform/game/settings", sessioncontroller.redtiger)
routes.post("/rtg/platform/game/spin", sessioncontroller.redtigerspin)

//API CONTROLLERS
routes.post("/api/v1/game_launch", apicontroller.launchgame)
routes.post("/api/v1/getagent", apicontroller.getagent)
routes.post("/api/v1/attagent", apicontroller.attagent)
routes.post("/gold_api/user_balance", apicontroller.localuserbalance)
routes.post("/gold_api/game_callback", apicontroller.localgamecallback)
//GAMES CONTROLLERS ROUTES
routes.post("/web-api/auth/session/v2/verifySession", sessioncontroller.verifySession)

//FORTUNE TIGER
routes.post("/game-api/fortune-tiger/v2/GameInfo/Get", fortunetiger.getiger)
routes.post("/game-api/fortune-tiger/v2/Spin", fortunetiger.spin)

//FORTUNE OX
routes.post("/game-api/fortune-ox/v2/GameInfo/Get", fortuneox.getox)
routes.post("/game-api/fortune-ox/v2/Spin", fortuneox.spin)

//FORTUNE MOUSE
routes.post("/game-api/fortune-mouse/v2/GameInfo/Get", fortunemouse.getmouse)
routes.post("/game-api/fortune-mouse/v2/Spin", fortunemouse.spin)

//FORTUNE DRAGON
routes.post("/game-api/fortune-dragon/v2/GameInfo/Get", fortunedragon.getdragon)
routes.post("/game-api/fortune-dragon/v2/Spin", fortunedragon.spin)

//FORTUNE RABBIT
routes.post("/game-api/fortune-rabbit/v2/GameInfo/Get", fortunerabbit.getrabbit)
routes.post("/game-api/fortune-rabbit/v2/Spin", fortunerabbit.spin)

//BIKINE PARADISE
routes.post("/game-api/bikine-paradise/v2/GameInfo/Get", bikiniparadise.getparadise)
routes.post("/game-api/bikine-paradise/v2/Spin", bikiniparadise.spin)

//JUNGLE DELIGHT
routes.post("/game-api/jungle-delight/v2/GameInfo/Get", jungledelight.getjungle)
routes.post("/game-api/jungle-delight/v2/Spin", jungledelight.spin)

//DOUBLE FORTUNE
routes.post("/game-api/double-fortune/v2/GameInfo/Get", doublefortune.getdouble)
routes.post("/game-api/double-fortune/v2/Spin", doublefortune.spin)

//GANESHA GOLD
routes.post("/game-api/ganesha-gold/v2/GameInfo/Get", ganeshagold.getganesha)
routes.post("/game-api/ganesha-gold/v2/Spin", ganeshagold.spin)

//DRAGON TIGER LUCKY
routes.post("/game-api/dragon-tiger-luck/v2/GameInfo/Get", dragontigerluck.getdragontiger)
routes.post("/game-api/dragon-tiger-luck/v2/Spin", dragontigerluck.spin)

//CASH MANIA
routes.post("/game-api/cash-mania/v2/GameInfo/Get", cashmania.getcash)
routes.post("/game-api/cash-mania/v2/Spin", cashmania.spin)

//ULTIMATE STRIKER
routes.post("/game-api/ultimate-striker/v2/GameInfo/Get", ultimatestriker.getstriker)
routes.post("/game-api/ultimate-striker/v2/Spin", ultimatestriker.spin)

//BUTTERFLY BLOSSOM
routes.post("/game-api/butterfly-blossom/v2/GameInfo/Get", butterflyBlossom.getbutterfly)
routes.post("/game-api/butterfly-blossom/v2/Spin", butterflyBlossom.spin)

//LUCKY CLOVER
routes.post("/game-api/lucky-clover/v2/GameInfo/Get", luckyclover.getclover)
routes.post("/game-api/lucky-clover/v2/Spin", luckyclover.spin)

//NINJA RACCOON
routes.post("/game-api/ninja-raccoon/v2/GameInfo/Get", ninjaraccoon.getninja)
routes.post("/game-api/ninja-raccoon/v2/Spin", ninjaraccoon.spin)

//FORTUNE TREE
routes.post("/game-api/prosper-ftree/v2/GameInfo/Get", fortunetree.gettree)
routes.post("/game-api/prosper-ftree/v2/Spin", fortunetree.spin)

//CHICKY RUN
routes.post("/game-api/chicky-run/v2/GameInfo/Get", chickyrun.getchicky)
routes.post("/game-api/chicky-run/v2/Play", chickyrun.Play)

//WINGS IGUAZU
routes.post("/game-api/wings-iguazu/v2/GameInfo/Get", wingsiguazu.getiguazu)
routes.post("/game-api/wings-iguazu/v2/Spin", wingsiguazu.spin)

//PIGGY GOLD
routes.post("/game-api/piggy-gold/v2/GameInfo/Get", piggygold.getpiggy)
routes.post("/game-api/piggy-gold/v2/Spin", piggygold.spin)

//WILD BANDITO
routes.post("/game-api/wild-bandito/v2/GameInfo/Get", jeanlula.getwildbandito)
routes.post("/game-api/wild-bandito/v2/Spin", jeanlula.spin)

//WILD ZOMBIE
routes.post("/game-api/zombie-outbreak/v2/GameInfo/Get", zombieoutbreak.getzombie)
routes.post("/game-api/zombie-outbreak/v2/Spin", zombieoutbreak.spin)

//MAJESTIC TS
routes.post("/game-api/majestic-ts/v2/GameInfo/Get", majesticts.getmajestic)
routes.post("/game-api/majestic-ts/v2/Spin", majesticts.spin)

//TREASURES AZTEC
//routes.post("/game-api/treasures-aztec/v2/GameInfo/Get", aztec.getaztec)
//routes.post("/game-api/treasures-aztec/v2/Spin", aztec.spin)

//THAI RIVER
routes.post("/game-api/thai-river/v2/GameInfo/Get", river.getriver)
routes.post("/game-api/thai-river/v2/Spin", river.spin)

//SHAOLIN SOCCER
routes.post("/game-api/shaolin-soccer/v2/GameInfo/Get", shaolin.getshaolin)
routes.post("/game-api/shaolin-soccer/v2/Spin", shaolin.spin)

//GDN ICE FIRE
routes.post("/game-api/gdn-ice-fire/v2/GameInfo/Get", icefire.geticefire)
routes.post("/game-api/gdn-ice-fire/v2/Spin", icefire.spin)

//GDN RISE APOLLO
routes.post("/game-api/rise-apollo/v2/GameInfo/Get", riseapollo.getriseapollo)
routes.post("/game-api/rise-apollo/v2/Spin", riseapollo.spin)

//WILD BOUTY SD
routes.post("/game-api/wild-bounty-sd/v2/GameInfo/Get", wildbountysd.getbounty)
routes.post("/game-api/wild-bounty-sd/v2/Spin", wildbountysd.spin)

//TREASURES AZTEC
routes.post("/game-api/treasures-aztec/v2/GameInfo/Get", aztec.getaztec)
routes.post("/game-api/treasures-aztec/v2/Spin", aztec.spin)

//THREE CRAZY PIGS
routes.post("/game-api/three-cz-pigs/v2/GameInfo/Get", threeczpigs.getthreecz)
routes.post("/game-api/three-cz-pigs/v2/Spin", threeczpigs.spin)

//WILD APE
//routes.post("/game-api/wild-ape/v2/GameInfo/Get", wildape.getape)
//routes.post("/game-api/wild-ape/v2/Spin", wildape.spin)

export default routes
