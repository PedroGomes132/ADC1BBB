import promisePool from "../database"
import { RowDataPacket, ResultSetHeader } from "mysql2"
import logger from "../logger"
import { ConsoleMessage } from "puppeteer"
import { appConfig } from "../config"

const getLocalCallbackUrl = () => appConfig.localCallbackUrl

function withLocalCallbackFallback(rows: RowDataPacket[]) {
   return rows.map((row) => {
      if (!/^https?:\/\//i.test(String(row.callbackurl || ""))) {
         row.callbackurl = getLocalCallbackUrl()
      }
      return row
   })
}

// Função para formatar a probabilidade como um número inteiro com até três dígitos
function formatarProbabilidade(valor: number): string {
   const valorInteiro = Math.round(valor * 100) // Converte para um valor inteiro entre 0 e 100
   console.log("VALOR: " + valorInteiro)
   return valorInteiro.toString().padStart(3, "0")
}

export default {
   async createOrUpdateSpin(playerId: number, gamecode: any, gameData: any) {
      // Primeiro, verificamos se o jogador já possui um registro
      const [rows]: any = await promisePool.query("SELECT id FROM spins WHERE user_id = ?", [playerId])

      // Verifique se a consulta retornou algum resultado
      if (rows.length > 0) {
         // Se o registro existir, atualizamos o JSON existente
         const res = await promisePool.query<ResultSetHeader>("UPDATE spins SET json = ?, game_code = ? WHERE user_id = ?", [gameData, gamecode, playerId])
         return res[0]
      } else {
         // Caso contrário, criamos um novo registro
         const res = await promisePool.query<ResultSetHeader>("INSERT INTO spins (user_id, game_code, json) VALUES (?, ?, ?)", [playerId, gamecode, gameData])
         return res[0]
      }
   },
   async getSpinByPlayerId(id: number) {
      const res = await promisePool.query<RowDataPacket[]>("SELECT * FROM spins WHERE user_id=?", [id]);
      return res[0];
   },
   async getjsonprimary(game_code: any) {
      const res = await promisePool.query<RowDataPacket[]>("SELECT json FROM spins_inicial WHERE game_code=?", [game_code]);
      return res[0];
   },
   async savejsonspin(id: number, json: any, gamecode: any) {
      const res = await promisePool.query<ResultSetHeader>("UPDATE spins SET json = ?, game_code = ? WHERE user_id = ?", [json, gamecode, id]);
      return res[0];
    },
   async getuserbytoken(token: string) {
      const [rows] = await promisePool.query<RowDataPacket[]>("SELECT * FROM users WHERE token = ?", [token])
      return rows
   },

   async getuserbyid(id: number) {
      const [rows] = await promisePool.query<RowDataPacket[]>("SELECT * FROM users WHERE id = ?", [id])
      return rows
   },

   async getuserbyatk(atk: string) {
      const [rows] = await promisePool.query<RowDataPacket[]>("SELECT * FROM users WHERE atk = ?", [atk])
      return rows
   },

   async getuserbyusername(username: string) {
      const [rows] = await promisePool.query<RowDataPacket[]>("SELECT * FROM users WHERE username = ?", [username])
      return rows
   },

   async getcall(id: number, game_code: string) {
      const [rows] = await promisePool.query<RowDataPacket[]>("SELECT * FROM calls WHERE iduser = ? AND status = 'pending' AND gamecode = ?", [id, game_code])
      return rows
   },

   async getagentbyid(id: number) {
      const [rows] = await promisePool.query<RowDataPacket[]>("SELECT * FROM agents WHERE id = ?", [id])
      return withLocalCallbackFallback(rows)
   },

   async getcallbyid(id: number) {
      const [rows] = await promisePool.query<RowDataPacket[]>("SELECT * FROM calls WHERE id = ?", [id])
      return rows
   },

   async updatertp(token: string, rtp: number) {
      const [result] = await promisePool.query<ResultSetHeader[]>("UPDATE users SET rtp = ? WHERE token = ?", [rtp, token])
      return result
   },

   async addcall(gamecode: string, iduser: number, json: number) {
      const [result] = await promisePool.query<ResultSetHeader[]>("INSERT INTO calls (iduser, gamecode, jsonname, bycall) VALUES (?, ?, ?, 'system')", [iduser, gamecode, json])
      return result
   },

   async updatestepscall(idcall: number, steps: number) {
      const [result] = await promisePool.query<ResultSetHeader[]>("UPDATE calls SET steps = ? WHERE id = ?", [steps, idcall])
      return result
   },

   async subtrairstepscall(idcall: number) {
      const [rows] = await promisePool.query<RowDataPacket[]>("SELECT steps FROM calls WHERE id = ?", [idcall])
      if (rows.length === 0) {
         throw new Error("Chamada não encontrada.")
      }
      const steps = rows[0].steps
      const newsteps = steps - 1

      const [result] = await promisePool.query<ResultSetHeader[]>("UPDATE calls SET steps = ? WHERE id = ?", [newsteps, idcall])
      return result
   },

   async completecall(idcall: number) {
      const [result] = await promisePool.query<ResultSetHeader[]>("UPDATE calls SET status = 'completed' WHERE id = ?", [idcall])
      return result
   },

   async adicionarZeroAntes(numero: number): Promise<number> {
      return Number("0." + numero.toString())
   },

   async determinarResultado(probabilidadeGanho: number, probabilidadebonus: number, id: number, gamecode: string) {
      const resultadoAleatorio = Math.random()
      const callpending = await this.getcall(id, gamecode)
      let numeroAleatorio = 0

      if (callpending.length > 0 && callpending[0].status === "pending" && callpending[0].gamecode === `${gamecode}`) {
         return {
            result: "bonus",
            gamecode: gamecode,
            json: callpending[0].jsonname,
            idcall: callpending[0].id,
         }
      }

      if (resultadoAleatorio < probabilidadeGanho) {
         if (resultadoAleatorio < probabilidadebonus) {
            const user = await this.getuserbyid(id)

            if (user[0].isinfluencer === 1) {
               numeroAleatorio = Math.floor(Math.random() * 6) + 1
               await this.addcall(gamecode, id, numeroAleatorio)
            } else {
               numeroAleatorio = Math.floor(Math.random() * (12 - 7 + 1)) + 7
               await this.addcall(gamecode, id, numeroAleatorio)
            }
            return { result: "ganho" }
         } else {
            return { result: "ganho" }
         }
      } else {
         return { result: "perda" }
      }
   },
   async calcularganho(valorAposta: number, saldoatual: number, token: string, gamecode: string) {
      if (gamecode === "shaolin-soccer") {
         return { result: "perda" }
      }

      var user = await this.getuserbyatk(token)
      var agent = await this.getagentbyid(user[0].agentid)
      let probabilidadeGanho = await this.adicionarZeroAntes(agent[0].probganho)
      let probabilidadebonus = await this.adicionarZeroAntes(agent[0].probbonus)

      if (user[0].rtp >= 0 && user[0].rtp <= 30 && user[0].isinfluencer === 0) {
         probabilidadeGanho = await this.adicionarZeroAntes(agent[0].probganhortp)
      }

      if (saldoatual >= 100) {
         probabilidadeGanho = await this.adicionarZeroAntes(agent[0].probganhosaldo)
      }
      if (valorAposta >= 2) {
         probabilidadeGanho = await this.adicionarZeroAntes(agent[0].probganhoaposta)
      }
      if (user[0].isinfluencer === 1) {
         probabilidadeGanho = await this.adicionarZeroAntes(agent[0].probganhoinfluencer)
         probabilidadebonus = await this.adicionarZeroAntes(agent[0].probbonusinfluencer)
      }
      console.log("PROBABILIDADE DE GANHO ATUAL " + probabilidadeGanho)
      console.log("PROBABILIDADE DE BONUS ATUAL " + probabilidadebonus)

      const resultado = this.determinarResultado(probabilidadeGanho, probabilidadebonus, user[0].id, gamecode)

      return resultado
   },

   calcularProbabilidadeComBaseNoRTP(rtp: number, probabilidadeBase: number): number {
      const rtpMin = 0
      const rtpMax = 80
      const probMin = 0
      const probMax = 1

      const rtpNormalized = Math.max(rtpMin, Math.min(rtp, rtpMax))
      const rtpFactor = (rtpNormalized - rtpMin) / (rtpMax - rtpMin)

      const probabilidadeAjustada = probabilidadeBase * (1 + rtpFactor)
      logger.info("Calculo de probabilidade final:" + probabilidadeAjustada)
      logger.info("Rtp Factor:" + rtpFactor)
      return Math.max(probMin, Math.min(probabilidadeAjustada, probMax))
   },
}
