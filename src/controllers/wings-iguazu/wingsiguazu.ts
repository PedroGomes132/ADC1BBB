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
import wingsiguazufunctions from "../../functions/wings-iguazu/wingsiguazufunctions"
//IMPORT LINHAS
import linhaperdaiguazu from "../../jsons/wings-iguazu/linhaperdaiguazu"
import linhaganhoiguazu from "../../jsons/wings-iguazu/linhaganhoiguazu"
import linhabonusiguazu from "../../jsons/wings-iguazu/linhabonusiguazu"
import notcashiguazu from "../../jsons/wings-iguazu/notcashiguazu"

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
   async getiguazu(req: Request, res: Response) {
      try {
         const token = req.body.atk;
         const gamename = "wings-iguazu";
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
         const user = await wingsiguazufunctions.getuserbyatk(token)
         let bet: number = cs * ml * 20
         console.log(bet)
         let saldoatual: number = Number(user[0].saldo || 0)
         const gamename = "wings-iguazu"

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
            res.send(await notcashiguazu.notcash(saldoatual, cs, ml))
            return false
         } else if (checkuserbalance.data.msg === "INSUFFICIENT_USER_FUNDS") {
            res.send(await notcashiguazu.notcash(saldoatual, cs, ml))
            return false
         }

         const retornado = user[0].valorganho
         const valorapostado = user[0].valorapostado

         const rtp = (retornado / valorapostado) * 100

         console.log("RTP ATUAL " + rtp)

         console.log("BET ATUAL " + bet)

         if (saldoatual < bet) {
            const semsaldo = await notcashiguazu.notcash(saldoatual, cs, ml)
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
            //await wingsiguazufunctions.attsaldobyatk(token, saldocompra);
            //logger.info('[!] COMPRA BONUS ACIONADO COM SUCESSO!');
         }

         if (resultadospin.result === "perda") {
            let newbalance = saldoatual - bet
            await wingsiguazufunctions.attsaldobyatk(token, newbalance)
            await wingsiguazufunctions.atualizardebitado(token, bet)
            await wingsiguazufunctions.atualizarapostado(token, bet)
            const perdajson = await linhaperdaiguazu.linhaperda()

            let json: any = {
               dt: {
                  si: {
                      "wp": null,
                      "lw": null,
                      "orl": perdajson.orl,
                      "gm": perdajson.gm,
                      "sc": 0,
                      "ssaw": 0.00,
                      "crtw": 0.0,
                      "imw": false,
                      "fs": null,
                      "gwt": -1,
                      "fb": null,
                      "ctw": 0.0,
                      "pmt": null,
                      "cwc": 0,
                      "fstc": null,
                      "pcwc": 0,
                      "rwsp": null,
                      "hashr": "0:7;8;2#5;8;2#5;3;8#99;7;99#MV#6.0#MT#4#MG#0#",
                      "ml": ml,
                      "cs": cs,
                      "rl": perdajson.rl,
                      "sid": "1836234115960995328",
                      "psid": "1836234115960995328",
                      "st": 1,
                      "nst": 1,
                      "pf": 1,
                      "aw": 0.00,
                      "wid": 0,
                      "wt": "C",
                      "wk": "0_C",
                      "wbn": null,
                      "wfg": null,
                      "blb": saldoatual,
                      "blab": newbalance,
                      "bl": newbalance,
                      "tb": bet,
                      "tbb": bet,
                      "tw": 0.00,
                      "np": -bet,
                      "ocr": null,
                      "mr": null,
                      "ge": [
                          1,
                          3,
                          11
                      ]
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
            const ganhojson = await linhaganhoiguazu.linhaganho(bet)
            const multplicador = await countrwsp(ganhojson.rwsp)
            await lwchange(ganhojson.rwsp, ganhojson.lw, cs, ml)
            let valorganho = cs * ml * multplicador * 2
            

            console.log("VALOR GANHO " + valorganho)
            
            console.log("SALDO ANTES DO GANHO: " + saldoatual)

            const newbalance = saldoatual - bet + valorganho
            
            console.log("SALDO APOS GANHO: " + newbalance)
            await wingsiguazufunctions.attsaldobyatk(token, newbalance)
            await wingsiguazufunctions.atualizardebitado(token, bet)
            await wingsiguazufunctions.atualizarapostado(token, bet)
            await wingsiguazufunctions.atualizarganho(token, valorganho)

            let json: any = {
               dt: {
                  si: {
                    "wp": ganhojson.wp,
                    "lw": ganhojson.lw,
                    "orl": ganhojson.orl,
                    "gm": 1,
                    "sc": 0,
                    "ssaw": valorganho,
                    "crtw": 0.0,
                    "imw": false,
                    "fs": null,
                    "gwt": -1,
                    "fb": null,
                    "ctw": valorganho,
                    "pmt": null,
                    "cwc": 1,
                    "fstc": null,
                    "pcwc": 1,
                    "rwsp": ganhojson.rwsp,
                    "hashr": "0:4;5;8#7;7;7#7;0;8#99;6;99#R#7#011121#MV#6.0#MT#1#R#7#011221#MV#6.0#MT#1#R#7#021221#MV#6.0#MT#1#MG#9.0#",
                    "ml": ml,
                    "cs": cs,
                    "rl": ganhojson.rl,
                    "sid": "1836234125788249600",
                    "psid": "1836234125788249600",
                    "st": 1,
                    "nst": 1,
                    "pf": 1,
                    "aw": valorganho,
                    "wid": 0,
                    "wt": "C",
                    "wk": "0_C",
                    "wbn": null,
                    "wfg": null,
                    "blb": saldoatual,
                    "blab": newbalance,
                    "bl": newbalance,
                    "tb": bet,
                    "tbb": bet,
                    "tw": valorganho,
                    "np": -bet,
                    "ocr": null,
                    "mr": null,
                    "ge": [
                        1,
                        11
                    ]
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
          if (resultadospin.result === "bonus") {
            const bonusjson = await linhabonusiguazu.linhabonus(resultadospin.json)
            let call = await allfunctions.getcallbyid(resultadospin.idcall)

            if (call[0].steps === null && call[0].status === "pending") {
               const steps = Object.keys(bonusjson).length - 1
               await allfunctions.updatestepscall(resultadospin.idcall, steps)
            }

            let calltwo = await allfunctions.getcallbyid(resultadospin.idcall)

            if (calltwo[0].steps === 0) {
               const multplicador = await countkeyrwspnull(bonusjson[calltwo[0].steps].rwsp)

               logger.info(`Multiplicador: ${multplicador}`);

               await lwchange(bonusjson[calltwo[0].steps].rwsp, bonusjson[calltwo[0].steps].lw, cs, ml)
               let valorganho = cs * ml * multplicador

               logger.info(`Valor ganho antes do ult. spin: ${valorganho}`);

               if (bonusjson[calltwo[0].steps].completed === true) {
                  valorganho = cs * ml * multplicador * 10
               }

               const newbalance = saldoatual + valorganho - bet
               await wingsiguazufunctions.attsaldobyatk(token, newbalance)
               await wingsiguazufunctions.atualizardebitado(token, bet)
               await wingsiguazufunctions.atualizarapostado(token, bet)
               await wingsiguazufunctions.atualizarganho(token, valorganho)

               let json: any = {
                  dt: {
                     si: {
                        wp: bonusjson[calltwo[0].steps].wp,
                        lw: bonusjson[calltwo[0].steps].lw,
                        rf: bonusjson[calltwo[0].steps].rf,
                        rtf: bonusjson[calltwo[0].steps].rtf,
                        fs: bonusjson[calltwo[0].steps].fs,
                        rc: bonusjson[calltwo[0].steps].rc,
                        im: bonusjson[calltwo[0].steps].im,
                        itw: false,
                        wc: 0,
                        gwt: 3,
                        fb: null,
                        ctw: valorganho,
                        pmt: null,
                        cwc: 2,
                        fstc: { "4": 1 },
                        pcwc: 0,
                        rwsp: bonusjson[calltwo[0].steps].rwsp,
                        hashr: "1:5;5;5#5;5;5#5;5;5#99;5;99#R#5#001020#MV#0#MT#1#R#5#001120#MV#0#MT#1#R#5#001121#MV#0#MT#1#R#5#011120#MV#0#MT#1#R#5#011121#MV#0#MT#1#R#5#011221#MV#0#MT#1#R#5#011222#MV#0#MT#1#R#5#021221#MV#0#MT#1#R#5#021222#MV#0#MT#1#R#5#021322#MV#0#MT#1#MG#600.0#",
                        ml: cs,
                        cs: ml,
                        rl: bonusjson[calltwo[0].steps].rl,
                        sid: "1762318812932144640",
                        psid: "1762318772436139520",
                        st: bonusjson[calltwo[0].steps].st,
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
                        ge: [3, 11],
                     },
                  },
                  err: null,
               }
               await allfunctions.savejsonspin(user[0].id, JSON.stringify(json), gamename);
               await allfunctions.completecall(calltwo[0].id)

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
            let json: any = {
               dt: {
                  si: {
                        wp: bonusjson[calltwo[0].steps].wp,
                        lw: bonusjson[calltwo[0].steps].lw,
                        rf: bonusjson[calltwo[0].steps].rf,
                        rtf: bonusjson[calltwo[0].steps].rtf,
                        fs: bonusjson[calltwo[0].steps].fs,
                        rc: bonusjson[calltwo[0].steps].rc,
                        im: bonusjson[calltwo[0].steps].im,
                        itw: false,
                        wc: 0,
                        gwt: 3,
                        fb: null,
                        ctw: bonusjson[calltwo[0].steps].ctw,
                        pmt: null,
                        cwc: 2,
                        fstc: { "4": 1 },
                        pcwc: 0,
                        rwsp: bonusjson[calltwo[0].steps].rwsp,
                        hashr: "1:5;5;5#5;5;5#5;5;5#99;5;99#R#5#001020#MV#0#MT#1#R#5#001120#MV#0#MT#1#R#5#001121#MV#0#MT#1#R#5#011120#MV#0#MT#1#R#5#011121#MV#0#MT#1#R#5#011221#MV#0#MT#1#R#5#011222#MV#0#MT#1#R#5#021221#MV#0#MT#1#R#5#021222#MV#0#MT#1#R#5#021322#MV#0#MT#1#MG#600.0#",
                        ml: cs,
                        cs: ml,
                        rl: bonusjson[calltwo[0].steps].rl,
                        sid: "1762318812932144640",
                        psid: "1762318772436139520",
                        st: 4,
                        nst: 1,
                        pf: 1,
                        aw: bonusjson[calltwo[0].steps].aw,
                        wid: 0,
                        wt: "C",
                        wk: "0_C",
                        wbn: null,
                        wfg: null,
                        blb: bonusjson[calltwo[0].steps].blb,
                        blab: bonusjson[calltwo[0].steps].blab,
                        bl: bonusjson[calltwo[0].steps].bl,
                        tb: 0.0,
                        tbb: bet,
                        tw: bonusjson[calltwo[0].steps].tw,
                        np: bonusjson[calltwo[0].steps].np,
                        ocr: null,
                        mr: null,
                        ge: [3, 11],
            },
               },
               err: null,
            }
            res.send(json)
         }
      } catch (error) {
         logger.error(error)
      }
   },
}
