import express, { Request, Response } from "express"
import helmet from "helmet"
import cors from "cors"
import fs from "fs"
import https from "https"
import http from "http"
import logger from "./logger/index"
import routes from "./routes"
import * as figlet from "figlet"
import path from "path"
import compression from "compression"
import { Server, Socket } from "socket.io"
import allfunctions from "./functions/allfunctions"
import { emitirEventoInterno, adicionarListener } from "./serverEvents"
import { mask } from "./logger/safe"
import { appConfig } from "./config"

import "dotenv/config"

// const privateKey = fs.readFileSync("server.key", "utf8")
// const certificate = fs.readFileSync("server.crt", "utf8")
// const credentials = {
//   key: privateKey,
//   cert: certificate,
// }
const app = express()
const httpServer = http.createServer(app)
const publicPaths = [
   path.join(process.cwd(), "api", "public"),
   path.join(__dirname, "public"),
].filter((publicPath) => fs.existsSync(publicPath))
const io = new Server(httpServer, {
   cors: {
     origin: "*", // Permitir qualquer origem, ajuste conforme necessário
     methods: ["GET", "POST"]
   }
 });

console.log(figlet.textSync("API PHILLYPS"), "\n")
logger.info('DOMINIO CONECTADO: ' + appConfig.dominioApi)

// httpServer.listen(process.env.PORT, () => {
//   logger.info("SERVIDOR INICIADO JOHN " + process.env.PORT)

// })
declare module "express-serve-static-core" {
   interface Request {
      io: Server
   }
}
const users = new Map<string, any>()

io.on("connection", async (socket: Socket) => {
   let rtpInterval: NodeJS.Timeout | null = null

   logger.info({ event: "socket.connected", socketId: socket.id, address: socket.handshake.address }, "Socket conectado")
   console.log("Usuário Conectado", socket.id);

   socket.on("join", async (socket1) => {
      const token: any = socket1.token
      const gameid: any = socket1.gameId

      logger.info({ event: "socket.join", socketId: socket.id, token: mask(token), gameId: gameid }, "Socket entrou no jogo")

      if (!token) {
         logger.warn({ event: "socket.join_missing_token", socketId: socket.id, gameId: gameid, payload: socket1 }, "Socket join ignorado: token ausente")
         return
      }

      if (rtpInterval) {
         clearInterval(rtpInterval)
      }

      rtpInterval = setInterval(async function () {
         const user = await allfunctions.getuserbytoken(token)

         if (!user[0]) {
            logger.warn({ event: "socket.user_not_found", socketId: socket.id, token: mask(token), gameId: gameid }, "Socket desconectado: token sem usuario")
            if (rtpInterval) {
               clearInterval(rtpInterval)
               rtpInterval = null
            }
            socket.disconnect(true)
            return false
         }

         const retornado = user[0].valorganho
         const valorapostado = user[0].valorapostado

         const rtp = Math.round((retornado / valorapostado) * 100)

         if (isNaN(rtp) === false) {
            await allfunctions.updatertp(token, rtp)
            logger.debug({ event: "socket.rtp_updated", userId: user[0].id, token: mask(token), rtp }, "RTP atualizado pelo socket")
         }
      }, 10000)
   })

   adicionarListener("attganho", async (dados) => {
      users.forEach(async (valor, chave) => {
         let newvalue = parseFloat(users.get(socket.id).aw) + dados.aw
         users.set(socket.id, {
            aw: newvalue,
         })
      })
      emitirEventoInterno("awreceive", {
         aw: users.get(socket.id).aw,
      })
   })

   adicionarListener("att", (dados) => {
      users.forEach((valor, chave) => {
         if (valor.token === dados.token) {
            return false
         } else {
            users.set(socket.id, {
               token: dados.token,
               username: dados.username,
               bet: dados.bet,
               saldo: dados.saldo,
               rtp: dados.rtp,
               agentid: dados.agentid,
               socketid: socket.id,
               gamecode: dados.gamecode,
               aw: 0,
            })
         }
      })

      if (Object.keys(users).length === 0) {
         users.set(socket.id, {
            token: dados.token,
            username: dados.username,
            bet: dados.bet,
            saldo: dados.saldo,
            rtp: dados.rtp,
            agentid: dados.agentid,
            socketid: socket.id,
            gamecode: dados.gamecode,
            aw: 0,
         })
      }
   })

   socket.on("disconnect", (reason) => {
      if (rtpInterval) {
         clearInterval(rtpInterval)
         rtpInterval = null
         logger.debug({ event: "socket.rtp_interval_cleared", socketId: socket.id, reason }, "Intervalo RTP encerrado")
      }

      users.delete(socket.id)

      logger.info({ event: "socket.disconnected", socketId: socket.id, reason }, "Cliente desconectado")
      console.log("Cliente desconectado:", reason)
   })
})

// Middleware para adicionar compressão
app.use(compression());

// Middleware para adicionar o socket.io em cada requisição
app.use((req: Request, res: Response, next) => {
   req.io = io // Adiciona o socket.io ao objeto req
   next()
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req: Request, res: Response, next) => {
   if (!req.originalUrl.match(/^\/(api|game-api|web-api|status|socket\.io)\b/)) {
      return next()
   }

   const startedAt = Date.now()
   logger.info({ event: "http.request", method: req.method, url: req.originalUrl, ip: req.ip }, "HTTP recebido")
   res.on("finish", () => {
      logger.info(
         {
            event: "http.response",
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            durationMs: Date.now() - startedAt,
         },
         "HTTP respondido",
      )
   })
   next()
})
const staticOptions = {
   setHeaders: (res: Response, filePath: string) => {
      if (filePath.endsWith("index.html") || filePath.includes(`${path.sep}shared${path.sep}service-worker${path.sep}`)) {
         res.setHeader("Cache-Control", "no-store")
      }
      if (filePath.includes(`${path.sep}shared${path.sep}service-worker${path.sep}`)) {
         res.setHeader("Service-Worker-Allowed", "/")
      }
   },
}

publicPaths.forEach((publicPath) => {
   logger.info({ event: "static.public_path", publicPath }, "Public path habilitado")
   app.use("/", express.static(publicPath, staticOptions))
})
app.use(
   helmet.contentSecurityPolicy({
      directives: {
         "default-src": ["'none'"],
         "base-uri": ["'self'"],
         "font-src": ["'self'", "https:", "data:"],
         "frame-ancestors": ["'self'"],
         "img-src": ["'self'", "data:"],
         "object-src": ["'none'"],
         "script-src": ["'self'", "https://cdnjs.cloudflare.com"],
         "style-src": ["'self'", "https://cdnjs.cloudflare.com"],
      },
   }),
)

app.use("/status", (req, res) => {
   res.json({ status: "operational" })
})

app.use(routes)
httpServer.listen(appConfig.port, () => {
   logger.info("API RODANDO NA PORTA: " + appConfig.port)
})
