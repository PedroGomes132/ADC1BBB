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
import prosperftreefunctions from "../../functions/prosper-ftree/prosperftreefunctions"
// IMPORT LINHAS
import linhaperdatree from "../../jsons/prosper-ftree/linhaperdatree"
import linhabonustree from "../../jsons/prosper-ftree/linhabonustree"
import notcashtree from "../../jsons/prosper-ftree/notcashtree"
import linhaganhotree from "../../jsons/prosper-ftree/linhaganhotree"

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
   async gettree(req: Request, res: Response) {
      try {
         const token = req.body.atk;
            const gamename = "prosper-ftree";
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
               maxwm: null,
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
         const user = await prosperftreefunctions.getuserbyatk(token)
         let bet: number = cs * ml * 20
         let saldoatual: number = Number(user[0].saldo || 0)
         const gamename = "prosper-ftree"

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
            res.send(await notcashtree.notcash(saldoatual, cs, ml))
            return
         }

         const retornado = user[0].valorganho
         const valorapostado = user[0].valorapostado

         const rtp = (retornado / valorapostado) * 100

         if (saldoatual < bet) {
            res.send(await notcashtree.notcash(saldoatual, cs, ml))
            return
         }

         let steps = getSteps(token, gamename)
         const resultadospin = await allfunctions.calcularganho(bet, saldoatual, token, gamename)

         if (steps > 0) {
            resultadospin.result = "ganho"
         }

         if (req.body.fb === "2") {
            resultadospin.result = "bonus"
            const saldocompra = saldoatual - 45
            await prosperftreefunctions.attsaldobyatk(token, saldocompra)
            logger.info("[!] COMPRA BONUS ACIONADO COM SUCESSO!")
         }

         if (resultadospin.result === "perda") {
            let newbalance = saldoatual - bet
            await prosperftreefunctions.attsaldobyatk(token, newbalance)
            await prosperftreefunctions.atualizardebitado(token, bet)
            await prosperftreefunctions.atualizarapostado(token, bet)
            const perdajson = await linhaperdatree.linhaperda()

            let json = {
               dt: {
                  si: {
                     wp: null,
                     lw: null,
                     snww: null,
                     ssaw: perdajson.ssaw,
                     orl: perdajson.orl,
                     gm: perdajson.gm,
                     sc: perdajson.sc,
                     sps: perdajson.sps,
                     rns: perdajson.rns,
                     fs: perdajson.fs,
                     gwt: perdajson.gwt,
                     fb: perdajson.fb,
                     ctw: perdajson.ctw,
                     pmt: perdajson.pmt,
                     cwc: perdajson.cwc,
                     fstc: perdajson.fstc,
                     pcwc: perdajson.pcwc,
                     rwsp: perdajson.rwsp,
                     hashr: perdajson.hashr,
                     ml: ml,
                     cs: cs,
                     rl: perdajson.rl,
                     sid: "1820663932919938560",
                     psid: "1820663932919938560",
                     st: perdajson.st,
                     nst: perdajson.nst,
                     pf: perdajson.pf,
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

            await prosperftreefunctions.savejsonspin(user[0].id, JSON.stringify(json))
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
               let linhaGanhoAnterior = await prosperftreefunctions.obterLinhaGanho(userId)

               // Se houver um ganho anterior, use a linha armazenada, caso contrário, gere uma nova
               let numeroAleatorio
               if (linhaGanhoAnterior !== null && linhaGanhoAnterior !== undefined) {
                  numeroAleatorio = linhaGanhoAnterior
               } else {
                  numeroAleatorio = 1
                  //numeroAleatorio = Math.floor(Math.random() * 11) // Supondo que maxLinhas seja o número máximo de linhas disponíveis
                  linhaGanhoAnterior = numeroAleatorio // Armazenar a nova linha de ganho
               }

               console.log("Linha de ganho escolhida: " + numeroAleatorio)

               const ganhojson = await linhaganhotree.linhaganho(numeroAleatorio)

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
               await prosperftreefunctions.attsaldobyatk(token, newbalance)
               await prosperftreefunctions.atualizardebitado(token, bet)
               await prosperftreefunctions.atualizarapostado(token, bet)
               await prosperftreefunctions.atualizarganho(token, valorganho)

               let json = {
                  dt: {
                     si: {
                        wp: ganhojson[steps].wp,
                        lw: ganhojson[steps].lw,
                        snww: ganhojson[steps].snww,
                        ssaw: ganhojson[steps].ssaw,
                        orl: ganhojson[steps].orl,
                        gm: ganhojson[steps].gm,
                        sc: ganhojson[steps].sc,
                        sps: ganhojson[steps].sps,
                        rns: ganhojson[steps].rns,
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
                        sid: "1820663932919938560",
                        psid: "1820663932919938560",
                        st: ganhojson[steps].st,
                        nst: ganhojson[steps].nst,
                        pf: ganhojson[steps].pf,
                        aw: ganhojson[steps].aw,
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
                        tw: ganhojson[steps].tw,
                        np: -bet,
                        ocr: null,
                        mr: null,
                        ge: [1, 11],
                     },
                  },
                  err: null,
               }

               // Salvar os dados do spin
               await prosperftreefunctions.savejsonspin(user[0].id, JSON.stringify(json))

               const txnid = uuidv4()
               const dataFormatada = moment().toISOString()

               // Salvar a linha de ganho atual no banco de dados
               await prosperftreefunctions.atualizarLinhaGanho(userId, numeroAleatorio)
               logger.info("LINHA DE GANHO SALVA NO BD: " + numeroAleatorio)

               console.log("linha de ganho " + numeroAleatorio)

               // Incrementar e verificar steps
               incrementSteps(token, gamename)
               if (getSteps(token, gamename) >= Object.keys(ganhojson).length) {
                  resetSteps(token, gamename)
                  await prosperftreefunctions.atualizarLinhaGanho(userId, null) // Resetar a linha de ganho quando os steps são resetados
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

         if (resultadospin.result === "bonus") {
            
            const numeroAleatorio : Number = 1;
            const bonusjson = await linhabonustree.linhabonus(resultadospin.json);
            
            let call = await allfunctions.getcallbyid(resultadospin.idcall);
            logger.info(`Dados da call obtida: ${JSON.stringify(call)}`);
        
            if (call.length > 0) {
                if (call[0].steps === null && call[0].status === "pending") {
                    if (saldoatual < bet) {
                        const semsaldo = await notcashtree.notcash(saldoatual, cs, ml);
                        res.send(semsaldo);
                        return;
                    }
                }
        
                if (call[0].steps === null && call[0].status === "pending") {
                    const steps = Object.keys(bonusjson).length - 1;
                    await allfunctions.updatestepscall(resultadospin.idcall, steps);
                    logger.info(`Steps atualizados para: ${steps}`);
                }
            } 
        
            let calltwo = await allfunctions.getcallbyid(resultadospin.idcall);
            logger.info(`Dados da calltwo obtida: ${JSON.stringify(calltwo)}`);
        
            logger.info("Iniciando a primeira etapa do bônus");
        
            if (calltwo.length > 0) {
                if (calltwo[0].steps === 0) {
                    await allfunctions.completecall(calltwo[0].id);
                }
        
                let multiplicador = 0;
        
                if (bonusjson[calltwo[0].steps]?.rwsp != null) {
                    multiplicador = await countrwsp(bonusjson[calltwo[0].steps].rwsp);
                }
        
                if (bonusjson[calltwo[0].steps]?.lw != null) {
                    await lwchange(bonusjson[calltwo[0].steps].rwsp, bonusjson[calltwo[0].steps].lw, cs, ml);
                }
        
                let wmvalue = 0;
                const txnid = uuidv4();
                const dataFormatada = moment().toISOString();
                let valorganho = cs * ml * multiplicador;
                let valorganhonowm = cs * ml * multiplicador;
        
                if (bonusjson[calltwo[0].steps]?.rwm != null) {
                    wmvalue = await returnrwm(bonusjson[calltwo[0].steps].rwm);
                    valorganho = valorganho * wmvalue;
                }
        
                let newbalance = 0;
        
                if (calltwo[0].steps === Object.keys(bonusjson).length - 1) {
                    newbalance = saldoatual - bet + valorganho;
                    await prosperftreefunctions.attsaldobyatk(token, newbalance);
        
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
                            is_call: false,
                            user_before_balance: user[0].saldo,
                            user_after_balance: newbalance,
                            agent_before_balance: 100,
                            agent_after_balance: 100,
                            created_at: dataFormatada,
                        },
                    });
                }
        
                newbalance = saldoatual + valorganho;
        
                if (calltwo[0].steps === 0) {
                    newbalance = saldoatual + valorganho - bet;
                }
        
                await prosperftreefunctions.attawcall(calltwo[0].id, valorganho);
                await prosperftreefunctions.attsaldobyatk(token, newbalance);
                await prosperftreefunctions.atualizardebitado(token, bet);
                await prosperftreefunctions.atualizarapostado(token, bet);
        
                if (calltwo[0].steps > 0) {
                    await allfunctions.subtrairstepscall(resultadospin.idcall);
                }
        
                if (bonusjson[calltwo[0].steps]?.fs?.hasOwnProperty("aw")) {
                    bonusjson[calltwo[0].steps].fs["aw"] = (await allfunctions.getcallbyid(resultadospin.idcall))[0].aw;
                }
        
                let json = {
                    dt: {
                        si: {
                            wp: bonusjson[calltwo[0].steps].wp,
                            lw: bonusjson[calltwo[0].steps].lw,
                            snww: bonusjson[calltwo[0].steps].snww,
                            ssaw: bonusjson[calltwo[0].steps].ssaw,
                            orl: bonusjson[calltwo[0].steps].orl,
                            gm: bonusjson[calltwo[0].steps].gm,
                            sc: bonusjson[calltwo[0].steps].sc,
                            sps: bonusjson[calltwo[0].steps].sps,
                            rns: bonusjson[calltwo[0].steps].rns,
                            fs: bonusjson[calltwo[0].steps].fs,
                            gwt: bonusjson[calltwo[0].steps].gwt,
                            fb: bonusjson[calltwo[0].steps].fb,
                            ctw: bonusjson[calltwo[0].steps].ctw,
                            pmt: bonusjson[calltwo[0].steps].pmt,
                            cwc: bonusjson[calltwo[0].steps].cwc,
                            fstc: bonusjson[calltwo[0].steps].fstc,
                            pcwc: bonusjson[calltwo[0].steps].pcwc,
                            rwsp: bonusjson[calltwo[0].steps].rwsp,
                            hashr: bonusjson[calltwo[0].steps].hashr,
                            ml: ml,
                            cs: cs,
                            rl: bonusjson[calltwo[0].steps].rl,
                            sid: "1820663932919938560",
                            psid: "1820663932919938560",
                            st: bonusjson[calltwo[0].steps].st,
                            nst: bonusjson[calltwo[0].steps].nst,
                            pf: bonusjson[calltwo[0].steps].pf,
                            aw: bonusjson[calltwo[0].steps].aw,
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
                            tw: bonusjson[calltwo[0].steps].tw,
                            np: -bet,
                            ocr: null,
                            mr: null,
                            ge: [1, 11],
                        },
                    },
                    err: null,
                };
        
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
                        bet: 0,
                        win: Number(valorganho),
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
                });
                await allfunctions.savejsonspin(user[0].id, JSON.stringify(json), gamename);
                res.send(json);
            } 
        }
        
      } catch (error) {
         logger.error(error)
      }
   },
}
