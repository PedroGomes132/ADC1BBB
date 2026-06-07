import { Request, Response } from "express";
import axios from "axios";
import logger from "../../logger";
import * as crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import "dotenv/config";

import "dotenv/config"

//IMPORT FUNCTIONS
import { emitirEventoInterno, adicionarListener } from "../../serverEvents"
import allfunctions from "../../functions/allfunctions"
import apicontroller from "../apicontroller"
import ninjaraccoonfunctions from "../../functions/ninja-raccoon/raccoonfunctions"
//IMPORT LINHAS
import linhaperdaraccoon from "../../jsons/ninja-raccoon/linhaperdaraccoon"
import linhaganhoraccoon from "../../jsons/ninja-raccoon/linhaganhoraccoon"
import linhabonusraccoon from "../../jsons/ninja-raccoon/linhabonusraccoon"
import notcashraccoon from "../../jsons/ninja-raccoon/notcashraccoon"

const stepsStorage: { [key: string]: number } = {}

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
   async getninja(req: Request, res: Response) {
      try {
         const token = req.body.atk;
            const gamename = "ninja-raccoon";
            const user = await allfunctions.getuserbyatk(token);
            logger.info('[+] Usuario logado: '+ user[0].username)
            const jsonprimay = await allfunctions.getSpinByPlayerId(user[0].id);
            const jsoninicial = await allfunctions.getjsonprimary(gamename);
         if (jsonprimay.length === 0 || jsonprimay[0].game_code !== gamename) {
            await allfunctions.createOrUpdateSpin(user[0].id, gamename, jsoninicial[0].json);
         } else {
            logger.info('[+] Json Recuperado Do Ultimo Spin.')
         }
            const json = await allfunctions.getSpinByPlayerId(user[0].id);
            const jsonformatado = JSON.parse(json[0].json);

         res.send({
            dt: {
               fb: { is: true, bm: 75, t: 0.6 },
               wt: { mw: 3.0, bw: 5.0, mgw: 15.0, smgw: 35.0 },
               maxwm: 2500,
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
      let cs: number = req.body.cs
      let ml: number = req.body.ml
      const token = req.body.atk

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
      async function returnrwspnotnull(json: { [key: string]: any }) {
         let chavereturn: string = ""
         for (const chave in json) {
            if (json[chave] != null) {
               chavereturn = chave
            }
         }
         return chavereturn
      }
      async function countrwspzero(json: { [key: string]: any }) {
         let multplicador: number = 0
         for (let i = 1; i <= 30; i++) {
            const chave = i.toString()
            if (json.hasOwnProperty(chave)) {
               multplicador = multplicador + parseFloat(json[chave])
            }
         }
         return multplicador
      }
      async function countrwspone(json: { [key: string]: any }) {
         let multplicador: number = 0
         for (let i = 1; i <= 30; i++) {
            const chave = i.toString()
            if (json.hasOwnProperty(chave)) {
               multplicador = multplicador + parseFloat(json[chave])
            }
         }
         return multplicador
      }
      async function countkeyrwspnull(json: { [key: string]: any }) {
         let count: number = 0
         for (let chave in json) {
            if (json[chave] === null) {
               count = count + 1
            }
         }
         return count
      }

      async function countrwsp(json: { [key: string]: any }) {
         let multplicador: number = 0
         for (let i = 1; i <= 30; i++) {
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
      async function returnrwm(json: { [key: string]: any }) {
         let value: number = 0
         for (let chave in json) {
            if (json.hasOwnProperty(chave)) {
               value = value + parseFloat(json[chave])
            }
         }
         return value
      }
      try {
         const user = await ninjaraccoonfunctions.getuserbyatk(token)
         let bet: number = cs * ml * 30
         console.log(bet)
         let saldoatual: number = Number(user[0].saldo || 0)
         const gamename = "ninja-raccoon"

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

         if (checkuserbalance.data.msg === "INVALID_USER") {
            res.send(await notcashraccoon.notcash(saldoatual, cs, ml))
            return false
         } else if (checkuserbalance.data.msg === "INSUFFICIENT_USER_FUNDS") {
            res.send(await notcashraccoon.notcash(saldoatual, cs, ml))
            return false
         }

         const retornado = user[0].valorganho
         const valorapostado = user[0].valorapostado

         const rtp = (retornado / valorapostado) * 100

         console.log("RTP ATUAL " + rtp)

         console.log("BET ATUAL " + bet)

         if (saldoatual < bet) {
            const semsaldo = await notcashraccoon.notcash(saldoatual, cs, ml)
            res.send(semsaldo)
            return false
         }

         let steps = getSteps(token, gamename)
         const resultadospin = await allfunctions.calcularganho(bet, saldoatual, token, gamename)

         if (steps > 0) {
            resultadospin.result = "ganho"
         }

         if (req.body.fb === "2") {
            resultadospin.result = "ganho"
            //const saldocompra = saldoatual - 45;
            //await ninjaraccoonfunctions.attsaldobyatk(token, saldocompra);
            //logger.info('[!] COMPRA BONUS ACIONADO COM SUCESSO!');
         }

         if (resultadospin.result === "perda") {
            let newbalance = saldoatual - bet
            await ninjaraccoonfunctions.attsaldobyatk(token, newbalance)
            await ninjaraccoonfunctions.atualizardebitado(token, bet)
            await ninjaraccoonfunctions.atualizarapostado(token, bet)
            const perdajson = await linhaperdaraccoon.linhaperda()

            let json: any = {
               dt: {
                  si: {
                     wp: null,
                     lw: null,
                     snww: null,
                     wpl: null,
                     twbm: 0.0,
                     rtw: 0.0,
                     mwp: null,
                     mlw: null,
                     msnww: null,
                     mwpl: null,
                     mrtw: 0.0,
                     ssaw: 0.0,
                     mrl: perdajson.mrl,
                     orl: perdajson.orl,
                     omrl: perdajson.omrl,
                     awip: null,
                     wip: null,
                     mwip: null,
                     gm: perdajson.gm,
                     sc: perdajson.sc,
                     rns: null,
                     mrns: null,
                     imw: false,
                     fs: null,
                     gwt: -1,
                     fb: null,
                     ctw: 0.0,
                     pmt: null,
                     cwc: 0,
                     fstc: null,
                     pcwc: 0,
                     rwsp: perdajson.rwsp,
                     hashr: perdajson.hashr,
                     ml: ml,
                     cs: cs,
                     rl: perdajson.rl,
                     sid: "1820649927060946432",
                     psid: "1820649927060946432",
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
         }
         if (resultadospin.result === "ganho") {
            try {
               const userId = user[0].id

               // Recuperar a linha de ganho do banco de dados
               let linhaGanhoAnterior = await ninjaraccoonfunctions.obterLinhaGanho(userId)

               // Se houver um ganho anterior, use a linha armazenada, caso contrário, gere uma nova
               let numeroAleatorio
               if (linhaGanhoAnterior !== null && linhaGanhoAnterior !== undefined) {
                  numeroAleatorio = linhaGanhoAnterior
               } else {
                  numeroAleatorio = 1
                  //numeroAleatorio = Math.floor(Math.random() * 11); // Supondo que maxLinhas seja o número máximo de linhas disponíveis
                  linhaGanhoAnterior = numeroAleatorio // Armazenar a nova linha de ganho
               }

               console.log("Linha de ganho escolhida: " + numeroAleatorio)

               const ganhojson = await linhaganhoraccoon.linhaganho(numeroAleatorio)

               // Verificar se ganhojson não é nulo ou indefinido
               if (!ganhojson) {
                  throw new Error("Dados de ganho inválidos")
               }

               let valorganho = cs * ml * 1
               let wmvalue = 0
               console.log("VALOR GANHO " + valorganho)

               // Verificar se saldoatual e bet são válidos
               if (typeof saldoatual !== "number" || typeof bet !== "number") {
                  throw new Error("Saldo ou aposta inválidos")
               }

               const newbalance = saldoatual + valorganho - bet

               // Atualizar saldo, debitar aposta e atualizar ganho
               await ninjaraccoonfunctions.attsaldobyatk(token, newbalance)
               await ninjaraccoonfunctions.atualizardebitado(token, bet)
               await ninjaraccoonfunctions.atualizarapostado(token, bet)
               await ninjaraccoonfunctions.atualizarganho(token, valorganho)

               let json = {
                  dt: {
                     si: {
                        wp: ganhojson[steps].wp,
                        lw: ganhojson[steps].lw,
                        snww: ganhojson[steps].snww,
                        wpl: ganhojson[steps].wpl,
                        twbm: ganhojson[steps].twbm,
                        rtw: ganhojson[steps].rtw,
                        mwp: ganhojson[steps].mvp,
                        mlw: ganhojson[steps].mlw,
                        msnww: ganhojson[steps].msnww,
                        mwpl: ganhojson[steps].mwpl,
                        mrtw: ganhojson[steps].mrtw,
                        ssaw: ganhojson[steps].ssaw,
                        mrl: ganhojson[steps].mrl,
                        orl: ganhojson[steps].orl,
                        omrl: ganhojson[steps].omrl,
                        awip: ganhojson[steps].awip,
                        wip: ganhojson[steps].wip,
                        mwip: ganhojson[steps].mwip,
                        gm: ganhojson[steps].gm,
                        sc: ganhojson[steps].sc,
                        rns: ganhojson[steps].rns,
                        mrns: ganhojson[steps].mrns,
                        imw: ganhojson[steps].imw,
                        fs: ganhojson[steps].fs,
                        gwt: ganhojson[steps].gwt,
                        fb: ganhojson[steps].fb,
                        ctw: ganhojson[steps].ctw,
                        pmt: ganhojson[steps].pmt,
                        cwc: ganhojson[steps].cwc,
                        fstc: ganhojson[steps].fstc,
                        pcwc: ganhojson[steps].pcwc,
                        rwsp: ganhojson[steps].rwsp,
                        hashr: ganhojson[steps].hashr,
                        ml: ml,
                        cs: cs,
                        rl: ganhojson[steps].rl,
                        sid: "1820649927060946432",
                        psid: "1820649927060946432",
                        st: ganhojson[steps].st,
                        nst: ganhojson[steps].nst,
                        pf: ganhojson[steps].pf,
                        aw: ganhojson[steps].aw,
                        wid: ganhojson[steps].wid,
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

               // Salvar os dados do spin
               await allfunctions.savejsonspin(user[0].id, JSON.stringify(json), gamename);

               const txnid = uuidv4()
               const dataFormatada = moment().toISOString()

               // Salvar a linha de ganho atual no banco de dados
               await ninjaraccoonfunctions.atualizarLinhaGanho(userId, numeroAleatorio)
               logger.info("LINHA DE GANHO SALVA NO BD: " + numeroAleatorio)

               console.log("linha de ganho " + numeroAleatorio)

               // Incrementar e verificar steps
               incrementSteps(token, gamename)
               if (getSteps(token, gamename) >= Object.keys(ganhojson).length) {
                  resetSteps(token, gamename)
                  await ninjaraccoonfunctions.atualizarLinhaGanho(userId, null) // Resetar a linha de ganho quando os steps são resetados
               }

               // Callback para o jogo
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
               return
            } catch (error) {
               if (error instanceof Error) {
                  logger.error(error.message)
               } else {
                  logger.error("Ocorreu um erro desconhecido")
               }
               res.status(500).send({
                  err: {
                     type: "InternalError",
                     message: "Ocorreu um erro desconhecido, tente novamente. (codigo de erro:G1008)",
                  },
               })
            }
         }
      } catch (error) {
         logger.error(error)
      }
   },
}
