import { Request, Response } from "express"
import axios from "axios"
import logger from "../../logger"
import * as crypto from "crypto"
import { v4 as uuidv4 } from "uuid"
import moment from "moment"
import "dotenv/config"
// IMPORT FUNCTIONS
import { emitirEventoInterno } from "../../serverEvents"
import allfunctions from "../../functions/allfunctions"
import apicontroller from "../apicontroller"
import gdnicefirefunctions from "../../functions/gdn-ice-fire/icefirefunctions"
// IMPORT LINHAS
import linhaperdaicefire from "../../jsons/gdn-ice-fire/linhaperdaicefire"
import linhabonusbikini from "../../jsons/bikini-paradise/linhabonusbikini"
import notcashicefire from "../../jsons/gdn-ice-fire/notcashicefire"
import linhaganhoicefire from "../../jsons/gdn-ice-fire/linhaganhoicefire"

const stepsStorage: { [key: string]: number } = {}

async function lwchange(json1: { [key: string]: any }, json2: { [key: string]: any }, cs: number, ml: number) {
   for (let chave in json1) {
      if (json1.hasOwnProperty(chave)) {
         const valor = json1[chave]
         const ganho = cs * ml * parseFloat(valor)
         for (let chave2 in json2) {
            if (json2.hasOwnProperty(chave2)) {
               json2[chave] = ganho
            }
         }
      }
   }
}

async function countrwsp(json: { [key: string]: any }) {
   let multiplicador = 0
   for (let i = 1; i <= 25; i++) {
      const chave = i.toString()
      if (json.hasOwnProperty(chave)) {
         multiplicador += parseFloat(json[chave])
      }
   }
   return multiplicador
}

async function gerarNumeroUnico() {
   return crypto.randomBytes(8).toString("hex")
}

async function returnrwm(json: { [key: string]: any }) {
   let value = 0
   for (let chave in json) {
      if (json.hasOwnProperty(chave)) {
         value += parseFloat(json[chave])
      }
   }
   return value
}

function getSteps(token: string, gamename: string): number {
   const key = `${token}:${gamename}`
   return stepsStorage[key] || 0
}

function setSteps(token: string, gamename: string, steps: number) {
   const key = `${token}:${gamename}`
   stepsStorage[key] = steps
}

function incrementSteps(token: string, gamename: string) {
   const key = `${token}:${gamename}`
   stepsStorage[key] = (stepsStorage[key] || 0) + 1
}

function resetSteps(token: string, gamename: string) {
   const key = `${token}:${gamename}`
   delete stepsStorage[key]
}

export default {
   async geticefire(req: Request, res: Response) {
      try {
         const token = req.body.atk
         const gamename = "gdn-ice-fire"
         const user = await allfunctions.getuserbyatk(token)
         logger.info("[+] Usuario logado: " + user[0].username)
         const jsonprimay = await allfunctions.getSpinByPlayerId(user[0].id)
         const jsoninicial = await allfunctions.getjsonprimary(gamename)
         if (jsonprimay.length === 0 || jsonprimay[0].game_code !== gamename) {
            await allfunctions.createOrUpdateSpin(user[0].id, gamename, jsoninicial[0].json)
         } else {
            logger.info("[+] Json Recuperado Do Ultimo Spin.")
         }
         const json = await allfunctions.getSpinByPlayerId(user[0].id)
         const jsonformatado = JSON.parse(json[0].json)
         res.send({
            dt: {
               fb: {
                  is: true,
                  bm: 100,
                  t: 0.6,
               },
               wt: {
                  mw: 3.0,
                  bw: 5.0,
                  mgw: 15.0,
                  smgw: 35.0,
               },
               maxwm: null,
               gcs: null,
               cs: [0.03, 0.1, 0.3, 0.9],
               ml: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
               mxl: 20,
               bl: user[0].saldo,
               inwe: false,
               iuwe: false,
               ls: jsonformatado.dt,
               cc: "BRL",
            },
            err: null,
         })
      } catch (error) {
         logger.error(error)
      }
   },

   async spin(req: Request, res: Response) {
      let cs: number = parseFloat(req.body.cs)
      let ml: number = parseFloat(req.body.ml)
      const token = req.body.atk

      try {
         const user = await gdnicefirefunctions.getuserbyatk(token)
         let bet: number = cs * ml * 20
         let saldoatual: number = Number(user[0].saldo || 0)
         const gamename = "gdn-ice-fire"

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

         const checkuserbalance = await axios({
            maxBodyLength: Infinity,
            method: "POST",
            url: `${agent[0].callbackurl}gold_api/user_balance`,
            headers: {
               "Content-Type": "application/json",
            },
            data: {
               user_code: user[0].username,
            },
         })

         if (checkuserbalance.data.msg === "INVALID_USER" || checkuserbalance.data.msg === "INSUFFICIENT_USER_FUNDS") {
            res.send(await notcashicefire.notcash(saldoatual, cs, ml))
            return
         }

         const retornado = user[0].valorganho
         const valorapostado = user[0].valorapostado

         const rtp = (retornado / valorapostado) * 100

         if (saldoatual < bet) {
            res.send(await notcashicefire.notcash(saldoatual, cs, ml))
            return
         }

         let steps = getSteps(token, gamename)
         const resultadospin = await allfunctions.calcularganho(bet, saldoatual, token, gamename)

         if (steps > 0) {
            resultadospin.result = "ganho"
         }

         if (resultadospin.result === "bonus") {
            resultadospin.result = "ganho"
         }

         if (resultadospin.result === "perda") {
            resultadospin.result = "ganho"
         }

         if (resultadospin.result === "perda") {
            let newbalance = saldoatual - bet
            await gdnicefirefunctions.attsaldobyatk(token, newbalance)
            await gdnicefirefunctions.atualizardebitado(token, bet)
            await gdnicefirefunctions.atualizarapostado(token, bet)
            const perdajson = await linhaperdaicefire.linhaperda()

            let json = {
               dt: {
                  si: {
                     norl: null,
                     wp: null,
                     lw: null,
                     lwm: {},
                     snw: null,
                     slw: 0.0,
                     slwm: 0.0,
                     sc: 0,
                     stw: 0.0,
                     stwm: 0.0,
                     fs: null,
                     orl: perdajson.orl,
                     gwt: -1,
                     ctw: 0.0,
                     pmt: null,
                     cwc: 0,
                     fstc: null,
                     pcwc: 0,
                     rwsp: { "0": null },
                     hashr: "0:7;8;3;9;7;8#9;2;3;2;7;9#9;5;7;4#5;7#MV#12.0#MT#1#MG#0#",
                     fb: null,
                     ml: ml,
                     cs: cs,
                     rl: perdajson.rl,
                     sid: "1839115396310826496",
                     psid: "1839115396310826496",
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

            await allfunctions.savejsonspin(user[0].id, JSON.stringify(json), gamename)
            const txnid = uuidv4()
            const dataFormatada = moment().toISOString()

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
            return
         }

         if (resultadospin.result === "ganho") {
            const numeroAleatorio = Math.floor(Math.random() * 60) + 1 // Supondo que maxLinhas seja o número máximo de linhas disponíveis
            const ganhojson = await linhaganhoicefire.linhaganho(numeroAleatorio)
            const multplicador = await countrwsp(ganhojson.rwsp[0] || ganhojson.rwsp)
            console.log("MULTIPLICADOR: " + multplicador)
            let valorganho = cs * ml * bet * multplicador

            console.log("VALOR GANHO " + valorganho)

            console.log("SALDO ANTES DO GANHO: " + saldoatual)

            const newbalance = saldoatual - bet + valorganho

            console.log("SALDO APOS GANHO: " + newbalance)
            await gdnicefirefunctions.attsaldobyatk(token, newbalance)
            await gdnicefirefunctions.atualizardebitado(token, bet)
            await gdnicefirefunctions.atualizarapostado(token, bet)
            await gdnicefirefunctions.atualizarganho(token, valorganho)

            let json: any = {
               dt: {
                  si: {
                     norl: ganhojson.norl,
                     wp: ganhojson.wp,
                     lw: ganhojson.lw,
                     lwm: ganhojson.lwm,
                     snw: ganhojson.snw,
                     slw: ganhojson.slw,
                     slwm: ganhojson.slwm,
                     sc: ganhojson.sc,
                     stw: ganhojson.stw,
                     stwm: ganhojson.stwm,
                     fs: ganhojson.fs,
                     orl: ganhojson.orl,
                     gwt: ganhojson.gwt,
                     ctw: valorganho,
                     pmt: ganhojson.pmt,
                     cwc: ganhojson.cwc,
                     fstc: ganhojson.fstc,
                     pcwc: ganhojson.pcwc,
                     rwsp: ganhojson.rwsp,
                     hashr: "0:6;9;4;2;2;6#9;5;4;8;4;9#3;6;5;3#9;5#R#9#011023#MV#12.0#MT#1#MG#3.0#",
                     fb: ganhojson.fb,
                     ml: ml,
                     cs: cs,
                     rl: ganhojson.rl,
                     sid: "1839115596077137408",
                     psid: "1839115596077137408",
                     st: ganhojson.st,
                     nst: ganhojson.nst,
                     pf: ganhojson.pf,
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
                     np: -bet,
                     ocr: null,
                     mr: null,
                     ge: [1, 11],
                  },
               },
               err: null,
            }
            await allfunctions.savejsonspin(user[0].id, JSON.stringify(json), gamename)

            const txnid = uuidv4()
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
         }
      } catch (error) {
         logger.error(error)
      }
   },
}
