"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
const index_1 = __importDefault(require("./logger/index"));
const routes_1 = __importDefault(require("./routes"));
const figlet = __importStar(require("figlet"));
const path_1 = __importDefault(require("path"));
const compression_1 = __importDefault(require("compression"));
const socket_io_1 = require("socket.io");
const allfunctions_1 = __importDefault(require("./functions/allfunctions"));
const serverEvents_1 = require("./serverEvents");
const safe_1 = require("./logger/safe");
const config_1 = require("./config");
require("dotenv/config");
// const privateKey = fs.readFileSync("server.key", "utf8")
// const certificate = fs.readFileSync("server.crt", "utf8")
// const credentials = {
//   key: privateKey,
//   cert: certificate,
// }
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const publicPaths = [
    path_1.default.join(process.cwd(), "api", "public"),
    path_1.default.join(__dirname, "public"),
].filter((publicPath) => fs_1.default.existsSync(publicPath));
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*", // Permitir qualquer origem, ajuste conforme necessário
        methods: ["GET", "POST"]
    }
});
console.log(figlet.textSync("API PHILLYPS"), "\n");
index_1.default.info('DOMINIO CONECTADO: ' + config_1.appConfig.dominioApi);
const users = new Map();
io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    let rtpInterval = null;
    index_1.default.info({ event: "socket.connected", socketId: socket.id, address: socket.handshake.address }, "Socket conectado");
    console.log("Usuário Conectado", socket.id);
    socket.on("join", (socket1) => __awaiter(void 0, void 0, void 0, function* () {
        const token = socket1.token;
        const gameid = socket1.gameId;
        index_1.default.info({ event: "socket.join", socketId: socket.id, token: (0, safe_1.mask)(token), gameId: gameid }, "Socket entrou no jogo");
        if (!token) {
            index_1.default.warn({ event: "socket.join_missing_token", socketId: socket.id, gameId: gameid, payload: socket1 }, "Socket join ignorado: token ausente");
            return;
        }
        if (rtpInterval) {
            clearInterval(rtpInterval);
        }
        rtpInterval = setInterval(function () {
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield allfunctions_1.default.getuserbytoken(token);
                if (!user[0]) {
                    index_1.default.warn({ event: "socket.user_not_found", socketId: socket.id, token: (0, safe_1.mask)(token), gameId: gameid }, "Socket desconectado: token sem usuario");
                    if (rtpInterval) {
                        clearInterval(rtpInterval);
                        rtpInterval = null;
                    }
                    socket.disconnect(true);
                    return false;
                }
                const retornado = user[0].valorganho;
                const valorapostado = user[0].valorapostado;
                const rtp = Math.round((retornado / valorapostado) * 100);
                if (isNaN(rtp) === false) {
                    yield allfunctions_1.default.updatertp(token, rtp);
                    index_1.default.debug({ event: "socket.rtp_updated", userId: user[0].id, token: (0, safe_1.mask)(token), rtp }, "RTP atualizado pelo socket");
                }
            });
        }, 10000);
    }));
    (0, serverEvents_1.adicionarListener)("attganho", (dados) => __awaiter(void 0, void 0, void 0, function* () {
        users.forEach((valor, chave) => __awaiter(void 0, void 0, void 0, function* () {
            let newvalue = parseFloat(users.get(socket.id).aw) + dados.aw;
            users.set(socket.id, {
                aw: newvalue,
            });
        }));
        (0, serverEvents_1.emitirEventoInterno)("awreceive", {
            aw: users.get(socket.id).aw,
        });
    }));
    (0, serverEvents_1.adicionarListener)("att", (dados) => {
        users.forEach((valor, chave) => {
            if (valor.token === dados.token) {
                return false;
            }
            else {
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
                });
            }
        });
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
            });
        }
    });
    socket.on("disconnect", (reason) => {
        if (rtpInterval) {
            clearInterval(rtpInterval);
            rtpInterval = null;
            index_1.default.debug({ event: "socket.rtp_interval_cleared", socketId: socket.id, reason }, "Intervalo RTP encerrado");
        }
        users.delete(socket.id);
        index_1.default.info({ event: "socket.disconnected", socketId: socket.id, reason }, "Cliente desconectado");
        console.log("Cliente desconectado:", reason);
    });
}));
// Middleware para adicionar compressão
app.use((0, compression_1.default)());
// Middleware para adicionar o socket.io em cada requisição
app.use((req, res, next) => {
    req.io = io; // Adiciona o socket.io ao objeto req
    next();
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    if (!req.originalUrl.match(/^\/(api|game-api|web-api|status|socket\.io)\b/)) {
        return next();
    }
    const startedAt = Date.now();
    index_1.default.info({ event: "http.request", method: req.method, url: req.originalUrl, ip: req.ip }, "HTTP recebido");
    res.on("finish", () => {
        index_1.default.info({
            event: "http.response",
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            durationMs: Date.now() - startedAt,
        }, "HTTP respondido");
    });
    next();
});
const staticOptions = {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith("index.html") || filePath.includes(`${path_1.default.sep}shared${path_1.default.sep}service-worker${path_1.default.sep}`)) {
            res.setHeader("Cache-Control", "no-store");
        }
        if (filePath.includes(`${path_1.default.sep}shared${path_1.default.sep}service-worker${path_1.default.sep}`)) {
            res.setHeader("Service-Worker-Allowed", "/");
        }
    },
};
const rabbitPublicId = "1543462";
publicPaths.forEach((publicPath) => {
    const rabbitPath = path_1.default.join(publicPath, rabbitPublicId);
    if (!fs_1.default.existsSync(rabbitPath)) {
        return;
    }
    app.use((req, res, next) => {
        if (req.method !== "GET" && req.method !== "HEAD") {
            return next();
        }
        const requestedPath = decodeURIComponent(req.path);
        const normalizedPath = path_1.default.normalize(requestedPath).replace(/^(\.\.(\/|\\|$))+/, "");
        const fallbackPath = path_1.default.join(rabbitPath, normalizedPath);
        if (!fallbackPath.startsWith(rabbitPath) || !fs_1.default.existsSync(fallbackPath) || fs_1.default.statSync(fallbackPath).isDirectory()) {
            return next();
        }
        index_1.default.debug({ event: "static.rabbit_fallback", url: req.originalUrl, filePath: fallbackPath }, "Fallback Rabbit servindo arquivo");
        res.sendFile(fallbackPath);
    });
});
publicPaths.forEach((publicPath) => {
    index_1.default.info({ event: "static.public_path", publicPath }, "Public path habilitado");
    app.use("/", express_1.default.static(publicPath, staticOptions));
});
app.use(helmet_1.default.contentSecurityPolicy({
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
}));
app.use("/status", (req, res) => {
    res.json({ status: "operational" });
});
app.use(routes_1.default);
httpServer.listen(config_1.appConfig.port, () => {
    index_1.default.info("API RODANDO NA PORTA: " + config_1.appConfig.port);
});
