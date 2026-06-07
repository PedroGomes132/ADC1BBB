import { Request, Response } from "express"
import axios from "axios"
import logger from "../../logger"
import * as crypto from "crypto"
import { v4 } from "uuid"
import moment from "moment"
import allfunctions from "../../functions/allfunctions"
import apicontroller from "../apicontroller"
import { emitirEventoInterno, adicionarListener } from "../../serverEvents"
import "dotenv/config"
import cashmaniafunctions from "../../functions/cash-mania/cashmaniafunctions"
import linhabonuscash from "../../jsons/cash-mania/linhabonuscash"
import linhaganhocash from "../../jsons/cash-mania/linhaganhocash"
import linhaperdacash from "../../jsons/cash-mania/linhaperdacash"
import notcashcash from "../../jsons/cash-mania/notcashcash"

export default {
   async getcash(req: Request, res: Response) {
      try {
         const token = req.body.atk;
            const gamename = "cash-mania";
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
               fb: {
                   is: true,
                   bm: 100,
                   t: 0.75
               },
               wt: {
                   mw: 5,
                   bw: 20,
                   mgw: 35,
                   smgw: 50
               },
               maxwm: null,
               cs: [0.02, 0.12, 0.8],
               ml: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
               mxl: 25,
               bl: user[0].saldo,
               inwe: false,
               iuwe: false,
               ls: jsonformatado.dt,
               cc: "BRL"
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

      async function rvchange(
         json1: { [key: string]: number },
         json2: { [key: string]: number },
         cs: number,
         ml: number
       ): Promise<void> {
         for (let chave in json1) {
           if (json1.hasOwnProperty(chave)) {
             const valor = json1[chave];
             let ganho = 0;
       
             // Calcula o ganho com base no valor e condições específicas
             if (valor === 1) {
               ganho = cs * ml * 25 * 0.1;
             } else if (valor === 2) {
               ganho = cs * ml * 25 * 0.5;
             } else if (valor === 3) {
               ganho = cs * ml * 25 * 1;
             } else if (valor === 4) {
               ganho = cs * ml * 25 * 5;
             } else if (valor === 5) {
               ganho = cs * ml * 25 * 10;
             }
       
             // Aplica o ganho calculado no segundo JSON se a chave existir
             if (json2 && json2.hasOwnProperty(chave)) {
               json2[chave] = ganho;
             } else {
               console.error(`Chave ${chave} não encontrada em json2 ou json2 é undefined`);
             }
             console.log(`Chave: ${chave}, Valor: ${valor}, Ganho: ${ganho}`);
           }
         }
       }
       

      async function countrwsp(json: { [key: string]: any }) {
         let multplicador: number = 0
         for (let i = 1; i <= 10; i++) {
            const chave = i.toString()
            if (json.hasOwnProperty(chave)) {
               multplicador = multplicador + parseFloat(json[chave])
               logger.info('Multiplicador Countrwsp: ' + multplicador)
            }
         }
         return multplicador
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
      async function gerarNumeroUnico() {
         return crypto.randomBytes(8).toString("hex")
      }
      try {
         const user = await cashmaniafunctions.getuserbyatk(token)
         let bet: number = cs * ml * 25
         let saldoatual: number = Number(user[0].saldo || 0)
         const gamename = "cash-mania"

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
            res.send(await notcashcash.notcash(saldoatual, cs, ml))
            return false
         } else if (checkuserbalance.data.msg === "INSUFFICIENT_USER_FUNDS") {
            res.send(await notcashcash.notcash(saldoatual, cs, ml))
            return false
         }

         const retornado = user[0].valorganho
         const valorapostado = user[0].valorapostado

         const rtp = (retornado / valorapostado) * 100

         console.log("RTP ATUAL " + rtp)

         console.log("BET ATUAL " + bet)

         if (saldoatual < bet) {
            const semsaldo = await notcashcash.notcash(saldoatual, cs, ml)
            res.send(semsaldo)
            return false
         }

         const resultadospin = await allfunctions.calcularganho(bet, saldoatual, token, gamename)

         if (resultadospin.result === "perda") {
            let newbalance = saldoatual - bet
            await cashmaniafunctions.attsaldobyatk(token, newbalance)
            await cashmaniafunctions.atualizardebitado(token, bet)
            await cashmaniafunctions.atualizarapostado(token, bet)
            const perdajson = await linhaperdacash.linhaperda()

            let json: any = {
               dt: {
                  si: {
                      wp: null,
                      lw: null,
                      twbm: 0,
                      fs: null,
                      imw: false,
                      rv: perdajson.rv,
                      orl: null,
                      orv: null,
                      rsrl: null,
                      rsrv: null,
                      nfp: null,
                      gwt: -1,
                      fb: null,
                      ctw: 0,
                      pmt: null,
                      cwc: 0,
                      fstc: null,
                      pcwc: 0,
                      rwsp: null,
                      hashr: "0:2;10;3#3;0;0#3;13;3#MV#6.0#MT#1#MG#0#",
                      ml: ml,
                      cs: cs,
                      rl: perdajson.rl,
                      sid: "1782506236190588416",
                      psid: "1782506236190588416",
                      st: 1,
                      nst: 1,
                      pf: 1,
                      aw: 0,
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
                      tw: 0,
                      np: -bet,
                      ocr: null,
                      mr: null,
                      ge: [1, 11]
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
         }
         if (resultadospin.result === "ganho") {
            const ganhojson = await linhaganhocash.linhaganho(bet);
            const multplicador = await countrwsp(ganhojson.rwsp);
            logger.info(`cs: ${cs}, ml: ${ml}`);
            logger.info(`ganhojson: ${JSON.stringify(ganhojson)}`);
            logger.info(`Multiplicador: ${multplicador}`);
            
            await lwchange(ganhojson.rwsp, ganhojson.lw, cs, ml);
            
            const valorganho = bet * multplicador;
            logger.info(`Valor do ganho calculado: ${valorganho}`);
            
            const newbalance = saldoatual + valorganho - bet;
            await cashmaniafunctions.attsaldobyatk(token, newbalance);
            await cashmaniafunctions.atualizardebitado(token, bet);
            await cashmaniafunctions.atualizarapostado(token, bet);
            await cashmaniafunctions.atualizarganho(token, valorganho);

            function gerarBooleanoAleatorio(): boolean {
               // Gera um número aleatório entre 0 e 1
               const boolean = Math.floor(Math.random() * 10) + 1
               console.log("NUMERO DO BOOLEANO " + boolean)

               // Se o número for maior ou igual a 0.5, retorna true, caso contrário, retorna false
               return boolean >= 5
            }

            let json: any = {
               dt: {
                  si: {
                     wp: ganhojson.wp,
                     lw: ganhojson.lw,
                     twbm: ganhojson.rv[1],
                     fs: null,
                     imw: false,
                     rv: ganhojson.rv,
                     orl: null,
                     orv: null,
                     rsrl: ganhojson.rsrl,
                     rsrv: ganhojson.rsrv,
                     nfp: null,
                     gwt: -1,
                     fb: null,
                     ctw: valorganho,
                     pmt: null,
                     cwc: 1,
                     fstc: null,
                     pcwc: 1,
                     rwsp: ganhojson.rwsp,
                     hashr: "0:2;3;5#2;1;2#3;3;3#R#2#011121#MV#6.0#MT#1#MG#3.0#",
                     ml: ml,
                     cs: cs,
                     rl: ganhojson.rl,
                     sid: "1799514033860050432",
                     psid: "1799514033860050432",
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
                     ge: [1, 11]
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
         }
         if (resultadospin.result === "bonus" && resultadospin.gamecode === "cash-mania") {
            const bonusjson = await linhabonuscash.linhabonus(resultadospin.json);
        
            let call = await allfunctions.getcallbyid(resultadospin.idcall);
            logger.info(`Dados da call obtida: ${JSON.stringify(call)}`);
        
            if (call[0].steps === null && call[0].status === "pending") {
                if (saldoatual < bet) {
                    const semsaldo = await notcashcash.notcash(saldoatual, cs, ml);
                    res.send(semsaldo);
                    return false;
                }
            }
        
            if (call[0].steps === null && call[0].status === "pending") {
                const steps = Object.keys(bonusjson).length - 1;
                await allfunctions.updatestepscall(resultadospin.idcall, steps);
                logger.info(`Steps atualizados para: ${steps}`);
            }
        
            let calltwo = await allfunctions.getcallbyid(resultadospin.idcall);
            logger.info(`Dados da calltwo obtida: ${JSON.stringify(calltwo)}`);
        
            logger.info("Iniciando a primeira etapa do bônus");
        
            if (calltwo[0].steps === 0) {
                await allfunctions.completecall(calltwo[0].id);
            }
        
            let multiplicador = 0;
        
            if (bonusjson[calltwo[0].steps].rwsp != null) {
                multiplicador = await countrwsp(bonusjson[calltwo[0].steps].rwsp);
            }
        
            if (bonusjson[calltwo[0].steps].lw != null) {
                await lwchange(bonusjson[calltwo[0].steps].rwsp, bonusjson[calltwo[0].steps].lw, cs, ml);
            }
        
            let wmvalue = 0;
        
            const txnid = v4();
            const dataFormatada = moment().toISOString();
        
            let valorganho = cs * ml * multiplicador;
        
            // Verifica e aplica as mudanças de rv
            if (bonusjson[calltwo[0].steps].rv != null) {
                logger.info(`Valor de rv antes de rvchange: ${JSON.stringify(bonusjson[calltwo[0].steps].rv)}`);
                await rvchange(bonusjson[calltwo[0].steps].lw, bonusjson[calltwo[0].steps].rv, cs, ml);
                logger.info(`Valor de rv depois de rvchange: ${JSON.stringify(bonusjson[calltwo[0].steps].rv)}`);
            }
        
            // Calcula o multiplicador de ganho
            let multiplicadorGanho = 0;
            if (Array.isArray(bonusjson[calltwo[0].steps].rv) && bonusjson[calltwo[0].steps].rv.length > 4) {
                const rvValue = bonusjson[calltwo[0].steps].rv[4];
                logger.info(`Valor de rv[4]: ${rvValue}`);
                if (rvValue > 0) {
                    multiplicadorGanho = rvValue; // Usando diretamente o valor de rv[4] como multiplicador
                    logger.info(`Multiplicador de Ganho calculado: ${multiplicadorGanho}`);
                } else {
                    logger.info(`rv[4] não é positivo: ${rvValue}`);
                    multiplicadorGanho = 0;
                }
            } else {
                logger.info(`bonusjson.rv é indefinido, não é um array, ou não possui o índice 4.`);
                multiplicadorGanho = 0;
            }
        
            valorganho *= multiplicadorGanho;
        
            let newbalance = saldoatual - bet + valorganho;
            await cashmaniafunctions.attsaldobyatk(token, newbalance);
        
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
        
            await cashmaniafunctions.attawcall(calltwo[0].id, valorganho);
        
            await cashmaniafunctions.attsaldobyatk(token, newbalance);
            await cashmaniafunctions.atualizardebitado(token, bet);
            await cashmaniafunctions.atualizarapostado(token, bet);
        
            if (calltwo[0].steps > 0) {
                await allfunctions.subtrairstepscall(resultadospin.idcall);
            }
        
            if (bonusjson[calltwo[0].steps].fs.hasOwnProperty("aw")) {
                bonusjson[calltwo[0].steps].fs["aw"] = (await allfunctions.getcallbyid(resultadospin.idcall))[0].aw;
            }
        
            let json: any = {
                dt: {
                    si: {
                        wp: bonusjson[calltwo[0].steps]?.wp,
                        lw: bonusjson[calltwo[0].steps]?.lw,
                        twbm: bonusjson[calltwo[0].steps]?.rv[1],
                        fs: bonusjson[calltwo[0].steps]?.fs,
                        imw: false,
                        rv: bonusjson[calltwo[0].steps]?.rv,
                        orl: null,
                        orv: null,
                        rsrl: bonusjson[calltwo[0].steps]?.rsrl,
                        rsrv: bonusjson[calltwo[0].steps]?.rsrv,
                        nfp: null,
                        gwt: -1,
                        fb: null,
                        ctw: valorganho,
                        pmt: null,
                        cwc: 0,
                        fstc: bonusjson[calltwo[0].steps]?.fstc,
                        pcwc: 0,
                        rwsp: null,
                        hashr: "5:4;7;4#3;0;0#5;3;2#MV#0#MT#1#MG#0#",
                        ml: ml,
                        cs: cs,
                        rl: bonusjson[calltwo[0].steps]?.rl,
                        sid: "1800172293483068928",
                        psid: "1800172216966381056",
                        st: bonusjson[calltwo[0].steps]?.st,
                        nst: bonusjson[calltwo[0].steps]?.nst,
                        pf: 1,
                        aw: (await allfunctions.getcallbyid(resultadospin.idcall))[0].aw,
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
                        ge: [1, 11]
                    }
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
            });
        
            await allfunctions.savejsonspin(user[0].id, JSON.stringify(json), gamename);;
        
            res.send(json);
        }
              
        
      } catch (error) {
         logger.error(error)
      }
   },
}
