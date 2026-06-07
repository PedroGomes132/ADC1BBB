import { Request, Response } from "express"
import axios from "axios"
import logger from "../logger"
import "dotenv/config"
import apifunctions from "../functions/apifunctions"
import { v4 } from "uuid"
import { parseTwoDigitYear } from "moment-timezone"
import { mask, requestInfo } from "../logger/safe"
import { getGameByCode } from "../gameCatalog"
import allfunctions from "../functions/allfunctions"
import { appConfig } from "../config"

export default {
   async launchgame(req: Request, res: Response) {
      const agentToken = req.body.agentToken
      const secretKey = req.body.secretKey
      const user_code = req.body.user_code
      const game_type = req.body.game_type
      const provider_code = req.body.provider_code
      const game_code = req.body.game_code
      const user_balance: number = req.body.user_balance

      try {
         logger.info(
            {
               event: "game_launch.start",
               ...requestInfo(req),
               agentToken: mask(agentToken),
               secretKey: mask(secretKey),
               user_code,
               provider_code,
               game_code,
               user_balance,
            },
            "Game launch recebido",
         )

         if (!user_code) {
            logger.warn({ event: "game_launch.validation_error", reason: "missing_user_code" }, "Game launch invalido")
            res.send({
               status: "error",
               message: "Voce precisa passar o user_code.",
            })
            return false
         }
         if (isNaN(user_balance) === true) {
            logger.warn({ event: "game_launch.validation_error", user_code, reason: "invalid_user_balance", user_balance }, "Game launch invalido")
            res.send({
               status: "error",
               message: "User Balance deve ser um numero.",
            })
            return false
         }

         const agentByToken = await apifunctions.getagentbyagentToken(agentToken)
         if (agentByToken.length === 0) {
            logger.warn({ event: "game_launch.agent_not_found", agentToken: mask(agentToken), user_code }, "Agent token nao cadastrado")
            res.send({
               status: "error",
               message: "Agent Token não cadastrado.",
            })
            return false
         }
         const agentBySecret = await apifunctions.getagentbysecretkey(secretKey)
         if (agentBySecret.length === 0) {
            logger.warn({ event: "game_launch.secret_not_found", secretKey: mask(secretKey), user_code }, "Secret key nao cadastrada")
            res.send({
               status: "error",
               message: "Secret Key não cadastrado.",
            })
            return false
         }

         const agent = agentByToken
         const user = await apifunctions.getuserbyagent(user_code, agent[0].id) //PUXA O USUARIO ATRAVES DO USER E AGENTID
         logger.info({ event: "game_launch.agent_ok", agentId: agent[0].id, user_code, userExists: user.length > 0 }, "Agent validado")

         // Adicionando a lógica para enviar um request se o provider_code for 'PRAGMATIC'
         if (provider_code === "PRAGMATIC") {
            try {
               // Usa let para permitir reatribuição
               let user = await apifunctions.getuserbyagent(user_code, agent[0].id)

               // Criação do usuário se não existir
               if (user.length === 0) {
                  const tokenuser = v4()
                  const atkuser = v4()
                  const createnewuser = await apifunctions.createuser(user_code, tokenuser, atkuser, user_balance, agent[0].id)

                  if (createnewuser.affectedRows >= 1) {
                     // Obtendo o novo usuário após criação
                     user = await apifunctions.getuserbyagent(user_code, agent[0].id)
                  } else {
                     res.send({
                        status: 0,
                        msg: "ERRO",
                        message: "Erro ao criar o usuário.",
                     })
                     return
                  }
               }

               // Preparação dos dados da requisição para o Pragmatic
               const pragmaticRequestData = {
                  method: "game_launch",
                  agent_code: "admin",
                  agent_token: "admin",
                  user_code: user_code,
                  game_code: game_code,
                  lang: "pt",
                  provider_code: provider_code,
                  user_balance: user_balance,
               }

               // Envio da requisição para a API Pragmatic
               const pragmaticResponse = await axios.post("https://api.br777-pg.com/", pragmaticRequestData) // Substitua pela URL real

               // Responder com sucesso, incluindo o launch_url da resposta
               res.send({
                  status: 1,
                  msg: "SUCCESS",
                  launch_url: pragmaticResponse.data.launch_url || "",
                  user_code: user[0].username,
                  user_balance: user[0].saldo,
                  user_created: user.length === 0,
                  currency: "BRL",
               })
            } catch (error) {
               logger.error("Error sending request to Pragmatic:", error)
               res.send({
                  status: 0,
                  msg: "ERRO",
                  message: "Erro ao se conectar com o provedor PRAGMATIC."
               })
            }
            return
         }

         const game = getGameByCode(game_code)
         if (!game) {
            res.send({
               status: "error",
               message: "Esse game nÃ£o existe.",
            })
            return false
         }
         const codegame = game.id

         if (user.length === 0) {
            const tokenuser = v4()
            const atkuser = v4()
            const createnewuser = await apifunctions.createuser(user_code, tokenuser, atkuser, user_balance, agent[0].id)

            if (createnewuser.affectedRows >= 1) {
               const getnewuser = await apifunctions.getuserbyagent(user_code, agent[0].id)
               const launchUrl = `${appConfig.apiPublicUrl}/${codegame}/index.html?operator_token=Zm9saWFiZXQ=&btt=1&t=${getnewuser[0].token}&or=${appConfig.resourceHost}&api=${appConfig.apiHost}`
               logger.info({ event: "game_launch.success", userId: getnewuser[0].id, user_code, game_code, codegame, userCreated: true, token: mask(getnewuser[0].token), atk: mask(getnewuser[0].atk) }, "Game launch criado")

               res.send({
                  status: 1,
                  msg: "SUCCESS",
                  launch_url: launchUrl,
                  user_code: getnewuser[0].username,
                  user_balance: getnewuser[0].saldo,
                  user_created: true,
                  currency: appConfig.defaultCurrency,
               })
            } else {
               res.send({
                  status: "error",
                  message: "Erro ao cadastrar o usuario.",
               })
               return false
            }
         } else {
            await apifunctions.setbalanceuserbyid(user[0].id, user_balance)
            const launchUrl = `${appConfig.apiPublicUrl}/${codegame}/index.html?operator_token=Zm9saWFiZXQ=&btt=1&t=${user[0].token}&or=${appConfig.resourceHost}&api=${appConfig.apiHost}`
            logger.info({ event: "game_launch.success", userId: user[0].id, user_code, game_code, codegame, userCreated: false, token: mask(user[0].token), atk: mask(user[0].atk) }, "Game launch reutilizado")

            res.send({
               status: 1,
               msg: "SUCCESS",
               launch_url: launchUrl,
               user_code: user[0].username,
               user_balance: user[0].saldo,
               user_created: false,
               currency: appConfig.defaultCurrency,
            })
         }
      } catch (error) {
         logger.error({ event: "game_launch.error", error }, "Erro no game_launch")
         res.status(500).send({
            status: "error",
            message: "Erro interno no game_launch.",
         })
      }
   },
   async callbackgame(json: any) {
      const agent = await apifunctions.getagentbysecretkey(json.agent_secret)

      try {
         const callbackUrl = agent[0]?.callbackurl || ""
         if (!/^https?:\/\//i.test(callbackUrl)) {
            logger.info({ event: "callbackgame.skip", agent_secret: mask(json.agent_secret), callbackUrl }, "Callback externo ausente; resultado mantido localmente")
            return
         }

         await axios({
            maxBodyLength: Infinity,
            method: "POST",
            url: `${callbackUrl}gold_api/game_callback`,
            headers: {
               "Content-Type": "application/json",
            },
            data: json,
         })
            .then((data) => {
               //console.log("NEW BALANCE" + data.data.user_balance)
            })
            .catch((error: any) => {
               console.log(error)
            })
      } catch (error) {
         console.log(error)
      }
   },
   async getagent(req: Request, res: Response) {
      const agentToken = req.body.agentToken
      const secretKey = req.body.secretKey

      if ((await apifunctions.getagentbyagentToken(agentToken)).length === 0) {
         res.send({
            status: "error",
            message: "Agent Token não cadastrado.",
         })
         return false
      }
      if ((await apifunctions.getagentbysecretkey(secretKey)).length === 0) {
         res.send({
            status: "error",
            message: "Secret Key não cadastrado.",
         })
         return false
      }
      const agent = await apifunctions.getagentbyagentToken(agentToken)
      agent[0].saldo = undefined
      agent[0].agentToken = undefined
      agent[0].saldo = undefined

      res.send(agent[0])
   },
   async localuserbalance(req: Request, res: Response) {
      const userCode = req.body.user_code
      const user = await allfunctions.getuserbyusername(userCode)

      if (user.length === 0) {
         res.send({ status: 0, msg: "INVALID_USER", user_balance: 0 })
         return
      }

      res.send({
         status: 1,
         msg: "SUCCESS",
         user_code: user[0].username,
         user_balance: Number(user[0].saldo || 0),
      })
   },
   async localgamecallback(req: Request, res: Response) {
      res.send({ status: 1, msg: "SUCCESS" })
   },
   async attagent(req: Request, res: Response) {
      const agentToken = req.body.agentToken
      const secretKey = req.body.secretKey
      const probganho = req.body.probganho
      const probbonus = req.body.probbonus
      const probganhortp = req.body.probganhortp
      const probganhoinfluencer = req.body.probganhoinfluencer
      const probbonusinfluencer = req.body.probbonusinfluencer
      const probganhoaposta = req.body.probganhoaposta
      const probganhosaldo = req.body.probganhosaldo

      if ((await apifunctions.getagentbyagentToken(agentToken)).length === 0) {
         res.send({
            status: "error",
            message: "Agent Token não cadastrado.",
         })
         return false
      }
      if ((await apifunctions.getagentbysecretkey(secretKey)).length === 0) {
         res.send({
            status: "error",
            message: "Secret Key não cadastrado.",
         })
         return false
      }
      const agent = await apifunctions.getagentbyagentToken(agentToken)

      const att = await apifunctions.attagent(agent[0].id, probganho, probbonus, probganhortp, probganhoinfluencer, probbonusinfluencer, probganhoaposta, probganhosaldo)

      if (att.affectedRows > 0) {
         res.send({
            status: "success",
            message: "Probabiliades alteradas com sucesso.",
         })
      } else {
         res.send({
            status: "error",
            message: "Erro desconhecido por favor contate o adm.",
         })
      }
   },
}
