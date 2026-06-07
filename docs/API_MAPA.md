# Mapa da API PGSoft

Este documento descreve como configurar, rodar e integrar a API com um site externo.

## Configuracao

As configuracoes principais ficam no `.env` da raiz do projeto. O painel em `C:\xampp\htdocs\painel` tambem le esse arquivo para usar o mesmo banco.

Variaveis principais:

```env
AMBIENTE=DEV
PORT=3006
DOMINIO_API=127.0.0.1:3006
API_PUBLIC_URL=http://127.0.0.1:3006
API_HOST=127.0.0.1:3006
RESOURCE_HOST=//127.0.0.1:3006
LOCAL_CALLBACK_URL=http://127.0.0.1:3006

DB_HOST=127.0.0.1
DB_PORT=3307
DB_USERNAME=phillypsapi
DB_PASSWORD=123456
DB_NAME=phillypsapi

DEFAULT_PROVIDER_CODE=PGSOFT
DEFAULT_CURRENCY=BRL
```

Em producao, ajuste pelo menos:

```env
AMBIENTE=PROD
PORT=3006
DOMINIO_API=api.seudominio.com
API_PUBLIC_URL=https://api.seudominio.com
API_HOST=api.seudominio.com
RESOURCE_HOST=//api.seudominio.com
LOCAL_CALLBACK_URL=https://api.seudominio.com
```

Se usar saldo em site externo, configure `callbackurl` no agent pelo painel. Exemplo:

```text
https://seusite.com/
```

A barra final importa, porque a API monta:

```text
{callbackurl}gold_api/user_balance
{callbackurl}gold_api/game_callback
```

## Rodar

Instalar dependencias:

```bash
npm install
```

Compilar:

```bash
npm run build
```

Criar/atualizar seeds dos jogos no banco:

```bash
npm run bootstrap:games
```

Subir API:

```bash
npm start
```

Painel local:

```text
http://127.0.0.1/painel/
```

Login demo:

```text
demo / demo
```

## Fluxo Principal

1. O site externo chama `/api/v1/game_launch`.
2. A API valida `agentToken` e `secretKey`.
3. A API cria ou reutiliza o usuario em `users`.
4. A API retorna `launch_url`.
5. O navegador abre o jogo pelo `launch_url`.
6. O jogo chama `verifySession`, `GameInfo/Get` e depois `Spin`.
7. A API atualiza saldo local e, se houver `callbackurl`, avisa o site externo.

## Rotas de Integracao

### Abrir jogo

`POST /api/v1/game_launch`

Body:

```json
{
  "agentToken": "demo-token",
  "secretKey": "demo-secret",
  "user_code": "usuario-123",
  "game_type": "slot",
  "provider_code": "PGSOFT",
  "game_code": "fortune-tiger",
  "user_balance": 100
}
```

Resposta:

```json
{
  "status": 1,
  "msg": "SUCCESS",
  "launch_url": "http://127.0.0.1:3006/126/index.html?...",
  "user_code": "usuario-123",
  "user_balance": "100.00",
  "user_created": true,
  "currency": "BRL"
}
```

### Consultar agent

`POST /api/v1/getagent`

```json
{
  "agentToken": "demo-token",
  "secretKey": "demo-secret"
}
```

### Alterar probabilidades do agent

`POST /api/v1/attagent`

```json
{
  "agentToken": "demo-token",
  "secretKey": "demo-secret",
  "probganho": 50,
  "probbonus": 0,
  "probganhortp": 40,
  "probganhoinfluencer": 80,
  "probbonusinfluencer": 0,
  "probganhoaposta": 30,
  "probganhosaldo": 20
}
```

## Callbacks Para Site Externo

Se `agents.callbackurl` estiver vazio, a API usa saldo local do banco.

Se `callbackurl` estiver preenchido, o site externo precisa expor:

### Consultar saldo

`POST {callbackurl}gold_api/user_balance`

Request enviado pela API:

```json
{
  "user_code": "usuario-123"
}
```

Resposta esperada:

```json
{
  "status": 1,
  "msg": "SUCCESS",
  "user_balance": 100
}
```

Erros aceitos:

```json
{ "msg": "INVALID_USER" }
```

```json
{ "msg": "INSUFFICIENT_USER_FUNDS" }
```

### Receber resultado de aposta

`POST {callbackurl}gold_api/game_callback`

Exemplo de request enviado pela API:

```json
{
  "agent_code": "demo",
  "agent_secret": "demo-secret",
  "user_code": "usuario-123",
  "user_balance": 100,
  "user_total_credit": 2.4,
  "user_total_debit": 0.4,
  "game_type": "slot",
  "slot": {
    "provider_code": "PGSOFT",
    "game_code": "fortune-tiger",
    "round_id": "abc123",
    "type": "BASE",
    "bet": 0.4,
    "win": 2.4,
    "txn_id": "uuid",
    "txn_type": "debit_credit",
    "is_buy": false,
    "is_call": false,
    "user_before_balance": 100,
    "user_after_balance": 102,
    "created_at": "2026-05-16T19:00:00.000Z"
  }
}
```

Resposta recomendada:

```json
{
  "status": 1,
  "msg": "SUCCESS"
}
```

## Rotas Internas do Jogo

Essas rotas sao chamadas pelo jogo no navegador, nao pelo site externo diretamente:

```text
POST /web-api/auth/session/v2/verifySession
POST /web-api/game-proxy/v2/Resources/GetByReferenceIdsResourceTypeIds
POST /web-api/game-proxy/v2/Resources/GetByResourcesTypeIds
POST /web-api/game-proxy/v2/GameName/Get
POST /web-api/game-proxy/v2/GameRule/Get
POST /web-api/game-proxy/v2/BetSummary/Get
POST /web-api/game-proxy/v2/BetHistory/Get
```

Para cada jogo:

```text
POST /game-api/{game-route}/v2/GameInfo/Get
POST /game-api/{game-route}/v2/Spin
```

Excecao:

```text
POST /game-api/chicky-run/v2/Play
```

## Jogos Mapeados

| game_code | ID | rota |
|---|---:|---|
| fortune-tiger | 126 | fortune-tiger |
| fortune-ox | 98 | fortune-ox |
| fortune-dragon | 1695365 | fortune-dragon |
| fortune-rabbit | 1543462 | fortune-rabbit |
| fortune-mouse | 68 | fortune-mouse |
| bikini-paradise | 69 | bikine-paradise |
| jungle-delight | 40 | jungle-delight |
| double-fortune | 48 | double-fortune |
| ganesha-gold | 42 | ganesha-gold |
| dragon-tiger-luck | 63 | dragon-tiger-luck |
| butterfly-blossom | 125 | butterfly-blossom |
| lucky-clover | 1601012 | lucky-clover |
| chicky-run | 1738001 | chicky-run |
| prosper-ftree | 1312883 | prosper-ftree |
| ultimate-striker | 1489936 | ultimate-striker |
| ninja-raccoon | 1529867 | ninja-raccoon |
| cash-mania | 1682240 | cash-mania |
| wings-iguazu | 1747549 | wings-iguazu |
| piggy-gold | 39 | piggy-gold |
| wild-bandito | 104 | wild-bandito |
| zombie-outbreak | 1635221 | zombie-outbreak |
| majestic-ts | 95 | majestic-ts |
| treasures-aztec | 87 | treasures-aztec |
| thai-river | 92 | thai-river |
| gdn-ice-fire | 91 | gdn-ice-fire |
| rise-apollo | 101 | rise-apollo |
| wild-bounty-sd | 135 | wild-bounty-sd |
| three-cz-pigs | 1727711 | three-cz-pigs |
| shaolin-soccer | 67 | shaolin-soccer |

## Banco de Dados

Tabelas principais:

```text
agents          credenciais, probabilidades e callbackurl
users           usuarios, saldo, token, atk e RTP
spins_inicial   seed inicial por game_code
spins           estado atual do jogo por usuario
calls           rodadas especiais/bonus pendentes
last_spin       historico auxiliar de alguns jogos
```

Campos importantes em `agents`:

```text
agentCode
senha
agentToken
secretKey
callbackurl
probganho
probbonus
probganhortp
probganhoinfluencer
probbonusinfluencer
probganhoaposta
probganhosaldo
limitadorchicky
```

## Painel Admin

O painel altera o mesmo banco usado pela API. Alteracoes em `agents`, `users`, probabilidades e `callbackurl` passam a valer nos proximos requests.

Arquivos publicados no XAMPP:

```text
C:\xampp\htdocs\painel
```

Tela de status dos jogos:

```text
http://127.0.0.1/painel/jogos.php
```

## O Que Falta Fazer

Pontos tecnicos pendentes:

- Completar JSONs reais de ganho/perda do `shaolin-soccer`; hoje ele responde sem ganho para nao quebrar.
- Revisar jogos que ainda usam controllers antigos com muito codigo duplicado.
- Criar autenticação real usando `API_SECRET` ou assinatura por request; hoje `API_SECRET` esta reservado e nao protege as rotas publicas.
- Mover o catalogo dos jogos para tabela no banco se quiser editar jogos pelo painel sem deploy.
- Adicionar logs estruturados em todos os controllers, igual foi feito em Fortune Tiger e Fortune Dragon.
- Normalizar callbacks externos com timeout e retry.
- Criar migrations SQL versionadas para nao depender de import manual.
- Criar testes automatizados para `game_launch`, `verifySession`, `GameInfo/Get` e `Spin`.
- Ajustar assets faltantes em `api/public` copiando de `dist/public` ou do pacote final do jogo quando necessario.

## Checklist Para Integrar Um Site Externo

1. Criar agent no painel.
2. Guardar `agentToken` e `secretKey`.
3. Se o saldo for do site externo, preencher `callbackurl`.
4. Implementar no site externo `gold_api/user_balance`.
5. Implementar no site externo `gold_api/game_callback`.
6. Chamar `/api/v1/game_launch`.
7. Abrir `launch_url` no navegador.
8. Conferir logs da API em caso de erro.

## Exemplo Completo de Launch

```bash
curl -X POST http://127.0.0.1:3006/api/v1/game_launch ^
  -H "Content-Type: application/json" ^
  -d "{\"agentToken\":\"demo-token\",\"secretKey\":\"demo-secret\",\"user_code\":\"user-1\",\"game_type\":\"slot\",\"provider_code\":\"PGSOFT\",\"game_code\":\"fortune-tiger\",\"user_balance\":100}"
```
