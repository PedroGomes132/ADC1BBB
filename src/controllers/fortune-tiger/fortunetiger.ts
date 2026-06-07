import { Request, Response } from "express"
import axios from "axios"
import logger from "../../logger"
import * as crypto from "crypto"
import { v4 } from "uuid"
import { Server, Socket } from "socket.io"
import moment from "moment"
import fortunefunctions from "../../functions/fortune-tiger/fortunetigerfunctions"
import allfunctions from "../../functions/allfunctions"
import apicontroller from "../apicontroller"
import { emitirEventoInterno, adicionarListener } from "../../serverEvents"
import linhaganhotiger from "../../jsons/fortune-tiger/linhaganhotiger"
import linhaperdatiger from "../../jsons/fortune-tiger/linhaperdatiger"
import linhabonustiger from "../../jsons/fortune-tiger/linhabonustiger"
import notcashtiger from "../../jsons/fortune-tiger/notcashtiger"
import { mask, requestInfo } from "../../logger/safe"

import "dotenv/config"

const activeSpins = new Set<string>()
const TIGER_VALID_SYMBOLS = [2, 3, 4, 5, 6, 7]
const TIGER_ALLOWED_CS = [0.08, 0.8, 3, 10]
const TIGER_ALLOWED_ML = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function hasTigerBetValue(values: number[], value: number) {
   return values.some((allowed) => Math.abs(allowed - value) < 0.000001)
}

function normalizeTigerBet(cs: number, ml: number) {
   if (!hasTigerBetValue(TIGER_ALLOWED_CS, cs) && hasTigerBetValue(TIGER_ALLOWED_CS, ml) && hasTigerBetValue(TIGER_ALLOWED_ML, cs)) {
      return { cs: ml, ml: cs, swapped: true }
   }

   return { cs, ml, swapped: false }
}

function normalizeTigerReels(reels: any) {
   if (!Array.isArray(reels)) {
      return reels
   }

   return reels.map((symbol) => {
      if (typeof symbol === "number" && TIGER_VALID_SYMBOLS.includes(symbol)) {
         return symbol
      }

      return TIGER_VALID_SYMBOLS[Math.floor(Math.random() * TIGER_VALID_SYMBOLS.length)]
   })
}

function normalizeTigerSpinResult(result: any) {
   if (!result) {
      return result
   }

   const reelKey = Array.isArray(result.orl) ? "orl" : Array.isArray(result.rl) ? "rl" : null
   if (!reelKey) {
      return result
   }

   result[reelKey] = normalizeTigerReels(result[reelKey])

   if (result.wp && typeof result.wp === "object") {
      for (const positions of Object.values(result.wp)) {
         if (!Array.isArray(positions)) {
            continue
         }

         const winnerSymbol = positions
            .map((position) => result[reelKey][position])
            .find((symbol) => typeof symbol === "number" && TIGER_VALID_SYMBOLS.includes(symbol))
            ?? TIGER_VALID_SYMBOLS[Math.floor(Math.random() * TIGER_VALID_SYMBOLS.length)]

         for (const position of positions) {
            if (Number.isInteger(position) && position >= 0 && position < result[reelKey].length) {
               result[reelKey][position] = winnerSymbol
            }
         }
      }
   }

   return result
}

export default {
   async getiger(req: Request, res: Response) {
      try {
         const token = req.body.atk;
            const gamename = "fortune-tiger";
            logger.info({ event: "fortune_tiger.game_info.start", ...requestInfo(req), atk: mask(token) }, "Fortune Tiger GameInfo recebido")
            const user = await allfunctions.getuserbyatk(token);
            if (!user[0]) {
               logger.warn({ event: "fortune_tiger.game_info.user_not_found", atk: mask(token) }, "Fortune Tiger GameInfo sem usuario")
               res.status(401).send({
                  dt: null,
                  err: {
                     cd: "1302",
                     msg: "Usuario nao encontrado pelo atk.",
                  },
               })
               return false
            }
            logger.info('[+] Usuario logado: '+ user[0].username)
            let jsonprimay = await allfunctions.getSpinByPlayerId(user[0].id);
            const jsoninicial = await allfunctions.getjsonprimary(gamename);

            if (!jsoninicial[0]) {
               logger.error({ event: "fortune_tiger.game_info.initial_json_missing", userId: user[0].id, gamename }, "Json inicial ausente")
               res.status(500).send({
                  dt: null,
                  err: {
                     cd: "500",
                     msg: "Json inicial nao encontrado para fortune-tiger.",
                  },
               })
               return false
            }

            if (!jsonprimay[0] || jsonprimay[0].game_code !== gamename) {
               logger.info({ event: "fortune_tiger.game_info.seed_spin", userId: user[0].id, gamename, hadSpin: Boolean(jsonprimay[0]) }, "Criando/atualizando spin inicial")
               await allfunctions.createOrUpdateSpin(user[0].id, gamename, jsoninicial[0].json);
               jsonprimay = await allfunctions.getSpinByPlayerId(user[0].id);
            } else {
               logger.info('[+] Json Recuperado Do Ultimo Spin.')
            }

            const json = jsonprimay;
            const jsonformatado = JSON.parse(json[0].json);
         logger.info({ event: "fortune_tiger.game_info.success", userId: user[0].id, username: user[0].username, saldo: user[0].saldo, spinId: json[0].id }, "Fortune Tiger GameInfo pronto")
         res.send({
            dt: {
               fb: null,
               wt: { mw: 5.0, bw: 20.0, mgw: 35.0, smgw: 50.0 },
               maxwm: null,
               cs: [0.08, 0.8, 3.0, 10.0],
               ml: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
               mxl: 5,
               bl: user[0].saldo,
               inwe: false,
               iuwe: false,
               ls: jsonformatado.dt,
               cc: "BRL",
            },
            err: null,
         })
      } catch (error) {
         logger.error({ event: "fortune_tiger.game_info.error", atk: mask(req.body?.atk), error }, "Erro no Fortune Tiger GameInfo")
         res.status(500).send({
            dt: null,
            err: {
               cd: "500",
               msg: "Erro interno no GameInfo do Fortune Tiger.",
            },
         })
      }
   },
   async spin(req: Request, res: Response) {
      let cs: number = Number(req.body.cs)
      let ml: number = Number(req.body.ml)
      const token = req.body.atk
      let activeSpinToken: string | null = null

      async function lwchange(
         json1: { [key: string]: any },
         json2: { [key: string]: any },
         cs: number,
         ml: number,
      ) {
         for (let chave in json1) {
            if (json1.hasOwnProperty(chave)) {
               const valor = json1[chave]
               const ganho = cs * ml * parseFloat(valor)
               // Verifica se a chave existe no segundo JSON
               for (let chave2 in json2) {
                  if (json2.hasOwnProperty(chave2)) {
                     // Altera o valor correspondente no segundo JSON
                     json2[chave] = ganho
                  }
               }
            }
         }
      }

      async function countrwsp(json: { [key: string]: any }) {
         let multplicador: number = 0
         for (let i = 1; i <= 9; i++) {
            const chave = i.toString()
            if (json.hasOwnProperty(chave)) {
               multplicador = multplicador + parseFloat(json[chave])
            }
         }
         return multplicador
      }
      async function gerarNumeroUnico() {
         return crypto.randomBytes(8).toString("hex")
      }
      try {
         const normalizedBet = normalizeTigerBet(cs, ml)
         if (normalizedBet.swapped) {
            logger.warn({ event: "fortune_tiger.spin.bet_swapped", atk: mask(token), receivedCs: cs, receivedMl: ml, cs: normalizedBet.cs, ml: normalizedBet.ml }, "cs/ml invertidos corrigidos")
         }
         cs = normalizedBet.cs
         ml = normalizedBet.ml

         logger.info({ event: "fortune_tiger.spin.start", ...requestInfo(req), atk: mask(token), cs, ml }, "Fortune Tiger Spin recebido")
         const user = await fortunefunctions.getuserbyatk(token)
         if (!user[0]) {
            logger.warn({ event: "fortune_tiger.spin.user_not_found", atk: mask(token) }, "Spin sem usuario")
            res.status(401).send({
               dt: null,
               err: {
                  cd: "1302",
                  msg: "Usuario nao encontrado pelo atk.",
               },
            })
            return false
         }
         let bet: number = cs * ml * 5
         console.log(bet)
         let saldoatual = Number(user[0].saldo || 0)
         const gamename = "fortune-tiger"

         if (!Number.isFinite(saldoatual)) {
            logger.error({ event: "fortune_tiger.spin.invalid_balance", userId: user[0].id, saldo: user[0].saldo }, "Saldo invalido no banco")
            res.status(500).send({
               dt: null,
               err: {
                  cd: "500",
                  msg: "Saldo invalido.",
               },
            })
            return false
         }

         if (activeSpins.has(token)) {
            logger.warn({ event: "fortune_tiger.spin.concurrent", userId: user[0].id, atk: mask(token) }, "Spin simultaneo ignorado")
            const lastSpin = await allfunctions.getSpinByPlayerId(user[0].id)
            if (lastSpin[0]?.json) {
               res.send(JSON.parse(lastSpin[0].json))
               return false
            }

            res.status(409).send({
               dt: null,
               err: {
                  cd: "3200",
                  msg: "Spin em andamento.",
               },
            })
            return false
         }

         activeSpins.add(token)
         activeSpinToken = token

         emitirEventoInterno("att", {
            token: token,
            username: user[0].username,
            bet: bet,
            saldo: saldoatual,
            rtp: user[0].rtp,
            agentid: user[0].agentid,
            gamecode: gamename,
         })

         const agent = await allfunctions.getagentbyid(user[0].agentid)

         const callbackUrl = agent[0]?.callbackurl || ""
         if (/^https?:\/\//i.test(callbackUrl)) {
            const checkuserbalance = await axios({
               maxBodyLength: Infinity,
               method: "POST",
               url: `${callbackUrl}gold_api/user_balance`,
               headers: {
                  "Content-Type": "application/json",
               },
               data: {
                  user_code: user[0].username,
               },
            })

            if (checkuserbalance.data.msg === "INVALID_USER") {
               res.send(await notcashtiger.notcash(saldoatual, cs, ml))
               return false
            } else if (checkuserbalance.data.msg === "INSUFFICIENT_USER_FUNDS") {
               res.send(await notcashtiger.notcash(saldoatual, cs, ml))
               return false
            }
         } else {
            logger.info({ event: "fortune_tiger.spin.local_balance", userId: user[0].id, agentId: user[0].agentid, callbackUrl }, "Callback de saldo ausente; usando saldo local")
         }

         const retornado = user[0].valorganho
         const valorapostado = user[0].valorapostado

         const rtp = (retornado / valorapostado) * 100

         console.log("RTP ATUAL " + rtp)

         console.log("BET ATUAL " + bet)

         if (saldoatual < bet) {
            const semsaldo = await notcashtiger.notcash(saldoatual, cs, ml)
            logger.info({ event: "fortune_tiger.spin.no_balance", userId: user[0].id, saldoatual, bet }, "Spin sem saldo")
            res.send(semsaldo)
            return false
         }

         logger.info({ event: "fortune_tiger.spin.calculate", userId: user[0].id, saldoatual, bet }, "Calculando resultado do spin")
         const resultadospin = await allfunctions.calcularganho(bet, saldoatual, token, gamename)
         logger.info({ event: "fortune_tiger.spin.calculated", userId: user[0].id, result: resultadospin?.result, gamecode: resultadospin?.gamecode, idcall: resultadospin?.idcall }, "Resultado do spin calculado")

         if (resultadospin.result === "perda") {
            logger.info({ event: "fortune_tiger.spin.loss", userId: user[0].id, saldoatual, bet }, "Spin perda")
            let newbalance = saldoatual - bet
            await fortunefunctions.attsaldobyatk(token, newbalance)
            await fortunefunctions.atualizardebitado(token, bet)
            await fortunefunctions.atualizarapostado(token, bet)
            const perdajson = await linhaperdatiger.linhaperda()
            normalizeTigerSpinResult(perdajson)

            let json: any = {
               dt: {
                  si: {
                     wc: 31,
                     ist: perdajson.ist,
                     itw: false,
                     fws: 0,
                     wp: null,
                     orl: perdajson.orl,
                     lw: null,
                     irs: false,
                     gwt: -1,
                     fb: null,
                     ctw: 0.0,
                     pmt: null,
                     cwc: 0,
                     fstc: null,
                     pcwc: 0,
                     rwsp: null,
                     hashr: "0:2;5;4#3;3;6#7;3;6#MV#3.0#MT#1#MG#0#",
                     ml: ml,
                     cs: cs,
                     rl: perdajson.orl,
                     sid: "1758600495495052800",
                     psid: "1758600495495052800",
                     st: 1,
                     nst: 1,
                     pf: 1,
                     aw: 0.0,
                     wid: 0,
                     wt: "C",
                     wk: "0_C",
                     wbn: null,
                     wfg: null,
                     blb: saldoatual,
                     blab: newbalance,
                     bl: newbalance,
                     tb: bet,
                     tbb: bet,
                     tw: 0.0,
                     np: -bet,
                     ocr: null,
                     mr: null,
                     ge: [1, 11],
                  },
               },
               err: null,
            }

           await allfunctions.savejsonspin(user[0].id, JSON.stringify(json), gamename);
            const txnid = v4()
            const dataFormatada: string = moment().toISOString()
            await apicontroller.callbackgame({
               agent_code: agent[0].agentcode,
               agent_secret: agent[0].secretKey,
               user_code: user[0].username,
               user_balance: user[0].saldo,
               user_total_credit: user[0].valorganho,
               user_total_debit: user[0].valorapostado,
               game_type: "slot",
               slot: {
                  provider_code: "PGSOFT",
                  game_code: gamename,
                  round_id: await gerarNumeroUnico(),
                  type: "BASE",
                  bet: bet,
                  win: 0,
                  txn_id: `${txnid}`,
                  txn_type: "debit_credit",
                  is_buy: false,
                  is_call: false,
                  user_before_balance: user[0].saldo,
                  user_after_balance: newbalance,
                  agent_before_balance: 100,
                  agent_after_balance: 100,
                  created_at: dataFormatada,
               },
            })
            res.send(json)
            return false
         }
         if (resultadospin.result === "ganho") {
            logger.info({ event: "fortune_tiger.spin.win", userId: user[0].id, saldoatual, bet }, "Spin ganho")
            const ganhojson = await linhaganhotiger.linhaganho(bet)
            normalizeTigerSpinResult(ganhojson)
            const multplicador = await countrwsp(ganhojson.rwsp)
            await lwchange(ganhojson.rwsp, ganhojson.lw, cs, ml)
            const valorganho = cs * ml * multplicador

            const newbalance = saldoatual + valorganho - bet
            if (!Number.isFinite(newbalance)) {
               throw new Error(`Saldo calculado invalido: saldo=${saldoatual}, ganho=${valorganho}, bet=${bet}`)
            }
            await fortunefunctions.attsaldobyatk(token, newbalance)
            await fortunefunctions.atualizardebitado(token, bet)
            await fortunefunctions.atualizarapostado(token, bet)
            await fortunefunctions.atualizarganho(token, valorganho)

            let json: any = {
               dt: {
                  si: {
                     wc: 17,
                     ist: ganhojson.ist,
                     itw: false,
                     fws: 0,
                     wp: ganhojson.wp,
                     orl: ganhojson.orl,
                     lw: ganhojson.lw,
                     irs: false,
                     gwt: bet,
                     fb: null,
                     ctw: valorganho,
                     pmt: null,
                     cwc: bet,
                     fstc: null,
                     pcwc: bet,
                     rwsp: ganhojson.rwsp,
                     hashr: "0:6;4;6#6;4;6#6;4;4#MV#3.0#MT#1#MG#0#",
                     ml: ml,
                     cs: cs,
                     rl: ganhojson.orl,
                     sid: "1757973319175306752",
                     psid: "1757973319175306752",
                     st: 1,
                     nst: 1,
                     pf: 1,
                     aw: valorganho,
                     wid: 0,
                     wt: "C",
                     wk: "0_C",
                     wbn: null,
                     wfg: null,
                     blb: saldoatual,
                     blab: newbalance,
                     bl: newbalance,
                     tb: bet,
                     tbb: bet,
                     tw: valorganho,
                     np: bet,
                     ocr: null,
                     mr: null,
                     ge: [1, 11],
                  },
               },
               err: null,
            }

           await allfunctions.savejsonspin(user[0].id, JSON.stringify(json), gamename);

            const txnid = v4()
            const dataFormatada: string = moment().toISOString()

            await apicontroller.callbackgame({
               agent_code: agent[0].agentcode,
               agent_secret: agent[0].secretKey,
               user_code: user[0].username,
               user_balance: user[0].saldo,
               user_total_credit: user[0].valorganho,
               user_total_debit: user[0].valorapostado,
               game_type: "slot",
               slot: {
                  provider_code: "PGSOFT",
                  game_code: gamename,
                  round_id: await gerarNumeroUnico(),
                  type: "BASE",
                  bet: bet,
                  win: Number(valorganho),
                  txn_id: `${txnid}`,
                  txn_type: "debit_credit",
                  is_buy: false,
                  is_call: false,
                  user_before_balance: user[0].saldo,
                  user_after_balance: newbalance,
                  agent_before_balance: 100,
                  agent_after_balance: 100,
                  created_at: dataFormatada,
               },
            })
            res.send(json)
            return false
         }
         if (resultadospin.result === "bonus" && resultadospin.gamecode === "fortune-tiger") {
            logger.info({ event: "fortune_tiger.spin.bonus", userId: user[0].id, saldoatual, bet, idcall: resultadospin.idcall }, "Spin bonus")
            const cartajson = await linhabonustiger.linhacarta(resultadospin.json)
            let call = await allfunctions.getcallbyid(resultadospin.idcall)

            if (call[0].steps === null && call[0].status === "pending") {
               const steps = Object.keys(cartajson).length - 1
               await allfunctions.updatestepscall(resultadospin.idcall, steps)
            }

            let calltwo = await allfunctions.getcallbyid(resultadospin.idcall)

            if (calltwo[0].steps === 0) {
               const multplicador = await countrwsp(cartajson[calltwo[0].steps].rwsp)
               await lwchange(
                  cartajson[calltwo[0].steps].rwsp,
                  cartajson[calltwo[0].steps].lw,
                  cs,
                  ml,
               )
               let valorganho = cs * ml * multplicador

               if (cartajson[calltwo[0].steps].completed === true) {
                  valorganho = cs * ml * multplicador * 10
               }
               normalizeTigerSpinResult(cartajson[calltwo[0].steps])

               const newbalance = saldoatual + valorganho - bet
               if (!Number.isFinite(newbalance)) {
                  throw new Error(`Saldo calculado invalido: saldo=${saldoatual}, ganho=${valorganho}, bet=${bet}`)
               }
               await fortunefunctions.attsaldobyatk(token, newbalance)
               await fortunefunctions.atualizardebitado(token, bet)
               await fortunefunctions.atualizarapostado(token, bet)
               await fortunefunctions.atualizarganho(token, valorganho)

               let json: any = {
                  dt: {
                     si: {
                        wc: 0,
                        ist: cartajson[calltwo[0].steps].ist,
                        itw: cartajson[calltwo[0].steps].itw,
                        fws: cartajson[calltwo[0].steps].fws,
                        wp: cartajson[calltwo[0].steps].wp,
                        orl: cartajson[calltwo[0].steps].orl,
                        lw: cartajson[calltwo[0].steps].lw,
                        irs: cartajson[calltwo[0].steps].irs,
                        gwt: 3,
                        fb: null,
                        ctw: valorganho,
                        pmt: null,
                        cwc: 1,
                        fstc: { "4": 2 },
                        pcwc: 0,
                        rwsp: cartajson[calltwo[0].steps].rwsp,
                        hashr: "2:7;7;7#7;7;7#7;7;7#R#7#011121#MV#0#MT#1#R#7#001020#MV#0#MT#1#R#7#021222#MV#0#MT#1#R#7#001122#MV#0#MT#1#R#7#021120#MV#0#MT#1#MG#90.0#",
                        ml: ml,
                        cs: cs,
                        rl: cartajson[calltwo[0].steps].rl,
                        sid: "1761174298456686080",
                        psid: "1761174260091387392",
                        st: 4,
                        nst: 1,
                        pf: 1,
                        aw: valorganho,
                        wid: 0,
                        wt: "C",
                        wk: "0_C",
                        wbn: null,
                        wfg: null,
                        blb: saldoatual,
                        blab: newbalance,
                        bl: newbalance,
                        tb: 0.0,
                        tbb: bet,
                        tw: valorganho,
                        np: valorganho,
                        ocr: null,
                        mr: null,
                        ge: [1, 11],
                     },
                  },
                  err: null,
               }
              await allfunctions.savejsonspin(user[0].id, JSON.stringify(json), gamename);
               await allfunctions.completecall(calltwo[0].id)

               const txnid = v4()
               const dataFormatada: string = moment().toISOString()
               await apicontroller.callbackgame({
                  agent_code: agent[0].agentcode,
                  agent_secret: agent[0].secretKey,
                  user_code: user[0].username,
                  user_balance: user[0].saldo,
                  user_total_credit: user[0].valorganho,
                  user_total_debit: user[0].valorapostado,
                  game_type: "slot",
                  slot: {
                     provider_code: "PGSOFT",
                     game_code: gamename,
                     round_id: await gerarNumeroUnico(),
                     type: "BASE",
                     bet: bet,
                     win: valorganho,
                     txn_id: `${txnid}`,
                     txn_type: "debit_credit",
                     is_buy: false,
                     is_call: true,
                     user_before_balance: user[0].saldo,
                     user_after_balance: newbalance,
                     agent_before_balance: 100,
                     agent_after_balance: 100,
                     created_at: dataFormatada,
                  },
               })
               res.send(json)
               return false
            }

            await allfunctions.subtrairstepscall(resultadospin.idcall)
            normalizeTigerSpinResult(cartajson[calltwo[0].steps])
            let json: any = {
               dt: {
                  si: {
                     wc: 103,
                     ist: cartajson[calltwo[0].steps].ist,
                     itw: cartajson[calltwo[0].steps].itw,
                     fws: cartajson[calltwo[0].steps].fws,
                     wp: cartajson[calltwo[0].steps].wp,
                     orl: cartajson[calltwo[0].steps].orl,
                     lw: cartajson[calltwo[0].steps].lw,
                     irs: cartajson[calltwo[0].steps].irs,
                     gwt: -1,
                     fb: null,
                     ctw: 0.0,
                     pmt: null,
                     cwc: 0,
                     fstc: null,
                     pcwc: 0,
                     rwsp: cartajson[calltwo[0].steps].rwsp,
                     hashr: "0:6;3;7#4;7;7#7;4;7#R#7#021120#MV#3.0#MT#1#MG#0#",
                     ml: ml,
                     cs: cs,
                     rl: cartajson[calltwo[0].steps].rl,
                     sid: "1761174260091387392",
                     psid: "1761174260091387392",
                     st: 1,
                     nst: 4,
                     pf: 1,
                     aw: 0.0,
                     wid: 0,
                     wt: "C",
                     wk: "0_C",
                     wbn: null,
                     wfg: null,
                     blb: saldoatual,
                     blab: saldoatual,
                     bl: saldoatual,
                     tb: bet,
                     tbb: bet,
                     tw: 0.0,
                     np: -bet,
                     ocr: null,
                     mr: null,
                     ge: [4, 11],
                  },
               },
               err: null,
            }
            res.send(json)
            return false
         }
         logger.error({ event: "fortune_tiger.spin.unhandled_result", userId: user[0].id, result: resultadospin }, "Resultado de spin nao tratado")
         res.status(500).send({
            dt: null,
            err: {
               cd: "500",
               msg: "Resultado de spin nao tratado.",
            },
         })
      } catch (error) {
         logger.error({
            event: "fortune_tiger.spin.error",
            atk: mask(token),
            errorName: error instanceof Error ? error.name : typeof error,
            errorMessage: error instanceof Error ? error.message : String(error),
            errorStack: error instanceof Error ? error.stack : undefined,
         }, "Erro no Fortune Tiger Spin")
         res.status(500).send({
            dt: null,
            err: {
               cd: "500",
               msg: "Erro interno no Spin do Fortune Tiger.",
            },
         })
      } finally {
         if (activeSpinToken) {
            activeSpins.delete(activeSpinToken)
         }
      }
   },
}
