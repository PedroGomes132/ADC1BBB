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
import majesticfunctions from "../../functions/majestic-ts/majestictsfunctions"
// IMPORT LINHAS
import linhaperdamajestic from "../../jsons/majestic-ts/linhaperdamajestic"
import linhabonusbikini from "../../jsons/bikini-paradise/linhabonusbikini"
import notcashmajestic from "../../jsons/majestic-ts/notcashmajestic"
import linhaganhomajestic from "../../jsons/majestic-ts/linhaganhomajestic"

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
   async getmajestic(req: Request, res: Response) {
      try {
         const token = req.body.atk;
         const gamename = "majestic-ts";
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
               fb: { is: true, bm: 100, t: 0.3 },
               wt: { mw: 3.0, bw: 5.0, mgw: 15.0, smgw: 35.0 },
               maxwm: null,
               cs: [0.03, 0.1, 0.3, 0.9],
               ml: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
               mxl: 10,
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
         const user = await majesticfunctions.getuserbyatk(token)
         let bet: number = cs * ml * 20
         let saldoatual: number = Number(user[0].saldo || 0)
         const gamename = "majestic-ts"

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
            res.send(await notcashmajestic.notcash(saldoatual, cs, ml))
            return
         }

         const retornado = user[0].valorganho
         const valorapostado = user[0].valorapostado

         const rtp = (retornado / valorapostado) * 100

         if (saldoatual < bet) {
            res.send(await notcashmajestic.notcash(saldoatual, cs, ml))
            return
         }

         let steps = getSteps(token, gamename)
         const resultadospin = await allfunctions.calcularganho(bet, saldoatual, token, gamename)

         if (steps > 0) {
            resultadospin.result = "ganho"
         }



         if (req.body.fb === "2") {
            resultadospin.result = "ganho"
            const saldocompra = saldoatual - 45
            await majesticfunctions.attsaldobyatk(token, saldocompra)
            logger.info("[!] COMPRA BONUS ACIONADO COM SUCESSO!")
         }
         
         if (resultadospin.result === "bonus") {
            resultadospin.result = "ganho"
         }

         if (resultadospin.result === "perda") {
            let newbalance = saldoatual - bet
            await majesticfunctions.attsaldobyatk(token, newbalance)
            await majesticfunctions.atualizardebitado(token, bet)
            await majesticfunctions.atualizarapostado(token, bet)
            const perdajson = await linhaperdamajestic.linhaperda()

            let json = {
               dt: {
                  si: {
                    orl: perdajson.orl,
                    sc: perdajson.sc,
                    wp: perdajson.wp,
                    sw: perdajson.sw,
                    wsc: perdajson.wsc,
                    wpl: perdajson.wpl,
                    ogs: perdajson.ogs,
                    gs: perdajson.gs,
                    gsd: perdajson.gsd,
                    rns: perdajson.rns,
                    rngs: perdajson.rngs,
                    ssaw: perdajson.ssaw,
                    rc: perdajson.rc,
                    ogml: perdajson.ogml,
                    gml: perdajson.gml,
                    cp: perdajson.cp,
                    fs: perdajson.fs,
                    gwt: perdajson.gwt,
                    fb: perdajson.fb,
                    ctw: perdajson.ctw,
                    pmt: perdajson.pmt,
                    cwc: perdajson.cwc,
                    fstc: perdajson.fstc,
                    pcwc: perdajson.pcwc,
                    rwsp: perdajson.rwsp,
                    hashr: "0:7;2;3;4;4#3;7;8;9;4#8;7;6;9;6#8;9;8;3;6#7;4;6;2;6#MV#6.0#MT#1#MG#0#",
                    ml: ml,
                    cs: cs,
                    rl: perdajson.rl,
                    sid: "1838749716889665024",
                    psid: "1838749716889665024",
                    st: perdajson.st,
                    nst: perdajson.nst,
                    pf: perdajson.pf,
                    aw: perdajson.aw,
                    wid: perdajson.wid,
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
            try {
               const userId = user[0].id

               // Recuperar a linha de ganho do banco de dados
               let linhaGanhoAnterior = await majesticfunctions.obterLinhaGanho(userId)

               // Se houver um ganho anterior, use a linha armazenada, caso contrário, gere uma nova
               let numeroAleatorio
               if (linhaGanhoAnterior !== null && linhaGanhoAnterior !== undefined) {
                  numeroAleatorio = linhaGanhoAnterior
               } else {
                  //numeroAleatorio = 1;
                  numeroAleatorio = Math.floor(Math.random() * 38) + 1 // Supondo que maxLinhas seja o número máximo de linhas disponíveis
                  linhaGanhoAnterior = numeroAleatorio // Armazenar a nova linha de ganho
               }

               console.log("Linha de ganho escolhida: " + numeroAleatorio)

               const ganhojson = await linhaganhomajestic.linhaganho(numeroAleatorio)

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
               await majesticfunctions.attsaldobyatk(token, newbalance)
               await majesticfunctions.atualizardebitado(token, bet)
               await majesticfunctions.atualizarapostado(token, bet)
               await majesticfunctions.atualizarganho(token, valorganho)

               let json = {
                  dt: {
                     si: {
                        orl: ganhojson[steps].orl,
                        sc: ganhojson[steps].sc,
                        wp: ganhojson[steps].wp,
                        sw: ganhojson[steps].sw,
                        wsc: ganhojson[steps].wsc,
                        wpl: ganhojson[steps].wpl,
                        ogs: ganhojson[steps].ogs,
                        gs: ganhojson[steps].gs,
                        gsd: ganhojson[steps].gsd,
                        rns: ganhojson[steps].rns,
                        rngs: ganhojson[steps].rngs,
                        ssaw: valorganho,
                        rc: ganhojson[steps].rc,
                        ogml: ganhojson[steps].ogml,
                        gml: ganhojson[steps].gml,
                        cp: ganhojson[steps].cp,
                        fs: ganhojson[steps].fs,
                        gwt: ganhojson[steps].gwt,
                        fb: ganhojson[steps].fb,
                        ctw: valorganho,
                        pmt: ganhojson[steps].pmt,
                        cwc: ganhojson[steps].cwc,
                        fstc: ganhojson[steps].fstc,
                        pcwc: ganhojson[steps].pcwc,
                        rwsp: ganhojson[steps].rwsp,
                        hashr: "0:8;6;8;4;6#7;6;7;9;6#8;4;4;8;0#6;6;4;9;6#5;5;6;8;5#R#6#40414243#MV#6.0#MT#1#MG#1.8#",
                        ml: ml,
                        cs: cs,
                        rl: ganhojson[steps].rl,
                        sid: "1838751421731634688",
                        psid: "1838751421731634688",
                        st: ganhojson[steps].st,
                        nst: ganhojson[steps].nst,
                        pf: ganhojson[steps].pf,
                        aw: valorganho,
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
                        tw: valorganho,
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
               await majesticfunctions.atualizarLinhaGanho(userId, numeroAleatorio)
               logger.info("LINHA DE GANHO SALVA NO BD: " + numeroAleatorio)

               console.log("linha de ganho " + numeroAleatorio)

               // Incrementar e verificar steps
               incrementSteps(token, gamename)
               if (getSteps(token, gamename) >= Object.keys(ganhojson).length) {
                  resetSteps(token, gamename)
                  await majesticfunctions.atualizarLinhaGanho(userId, null) // Resetar a linha de ganho quando os steps são resetados
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
