# Integracao do Site de Cassino com a API PGSoft

Este documento e para a IA/equipe que esta editando o site de cassino nesta mesma maquina.

## Ambiente Local Atual

API PGSoft:

```text
http://127.0.0.1:3006
```

Painel admin:

```text
http://127.0.0.1/painel/
```

Banco MySQL:

```text
Host: 127.0.0.1
Porta: 3307
Banco: phillypsapi
Usuario: phillypsapi
Senha: 123456
```

Agent demo:

```text
agentCode: demo
senha painel: demo
agentToken: demo-token
secretKey: demo-secret
callbackurl: vazio atualmente
```

Enquanto `callbackurl` estiver vazio, a API usa o saldo local da tabela `users`.

## Como Abrir Um Jogo

O site deve chamar:

```text
POST http://127.0.0.1:3006/api/v1/game_launch
```

Headers:

```http
Content-Type: application/json
```

Body exemplo:

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

Resposta esperada:

```json
{
  "status": 1,
  "msg": "SUCCESS",
  "launch_url": "http://127.0.0.1:3006/126/index.html?operator_token=...&t=...",
  "user_code": "usuario-123",
  "user_balance": "100.00",
  "user_created": true,
  "currency": "BRL"
}
```

O site deve abrir `launch_url` no navegador, iframe, popup ou nova aba.

## Exemplo JavaScript

```js
async function abrirJogo(usuario, saldo, gameCode) {
  const response = await fetch("http://127.0.0.1:3006/api/v1/game_launch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      agentToken: "demo-token",
      secretKey: "demo-secret",
      user_code: usuario,
      game_type: "slot",
      provider_code: "PGSOFT",
      game_code: gameCode,
      user_balance: saldo
    })
  });

  const data = await response.json();

  if (data.status !== 1) {
    throw new Error(data.message || "Falha ao abrir jogo");
  }

  window.location.href = data.launch_url;
}
```

## Jogos Disponiveis

Use `game_code` no `game_launch`.

| Nome | game_code | ID |
|---|---|---:|
| Fortune Tiger | fortune-tiger | 126 |
| Fortune Ox | fortune-ox | 98 |
| Fortune Dragon | fortune-dragon | 1695365 |
| Fortune Rabbit | fortune-rabbit | 1543462 |
| Fortune Mouse | fortune-mouse | 68 |
| Bikini Paradise | bikini-paradise | 69 |
| Jungle Delight | jungle-delight | 40 |
| Double Fortune | double-fortune | 48 |
| Ganesha Gold | ganesha-gold | 42 |
| Dragon Tiger Luck | dragon-tiger-luck | 63 |
| Butterfly Blossom | butterfly-blossom | 125 |
| Lucky Clover | lucky-clover | 1601012 |
| Chicky Run | chicky-run | 1738001 |
| Prosperity Fortune Tree | prosper-ftree | 1312883 |
| Ultimate Striker | ultimate-striker | 1489936 |
| Ninja Raccoon | ninja-raccoon | 1529867 |
| Cash Mania | cash-mania | 1682240 |
| Wings of Iguazu | wings-iguazu | 1747549 |
| Piggy Gold | piggy-gold | 39 |
| Wild Bandito | wild-bandito | 104 |
| Zombie Outbreak | zombie-outbreak | 1635221 |
| Majestic Treasures | majestic-ts | 95 |
| Treasures of Aztec | treasures-aztec | 87 |
| Thai River Wonders | thai-river | 92 |
| Guardians of Ice and Fire | gdn-ice-fire | 91 |
| Rise of Apollo | rise-apollo | 101 |
| Wild Bounty Showdown | wild-bounty-sd | 135 |
| Three Crazy Pigs | three-cz-pigs | 1727711 |
| Shaolin Soccer | shaolin-soccer | 67 |

Observacao: `shaolin-soccer` responde sem ganho no modo atual porque os JSONs de ganho/perda desse jogo estao incompletos no projeto da API.

## Integracao de Saldo Externo

Existem dois modos.

### Modo 1: Saldo Local na API

E o modo atual.

O site manda `user_balance` no `game_launch`.
A API grava/atualiza o saldo em `users.saldo`.
Os spins usam esse saldo local.

Nao precisa implementar callbacks no site.

### Modo 2: Saldo Controlado Pelo Site

Nesse modo, o site precisa expor endpoints para a API consultar saldo e receber resultado de aposta.

No painel admin, editar o agent e preencher:

```text
callbackurl=https://url-do-site/
```

Como o site esta nesta mesma maquina, exemplos locais possiveis:

```text
http://127.0.0.1:8000/
http://127.0.0.1:8080/
http://localhost/
```

A URL precisa terminar com `/`.

### Endpoint que o site deve criar: consultar saldo

```text
POST {callbackurl}gold_api/user_balance
```

Request enviado pela API:

```json
{
  "user_code": "usuario-123"
}
```

Resposta de sucesso:

```json
{
  "status": 1,
  "msg": "SUCCESS",
  "user_balance": 100
}
```

Respostas de erro aceitas:

```json
{
  "msg": "INVALID_USER"
}
```

```json
{
  "msg": "INSUFFICIENT_USER_FUNDS"
}
```

### Endpoint que o site deve criar: receber resultado

```text
POST {callbackurl}gold_api/game_callback
```

Request enviado pela API:

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
    "round_id": "round-id",
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

## Endpoints Uteis da API

Consultar agent:

```text
POST http://127.0.0.1:3006/api/v1/getagent
```

Body:

```json
{
  "agentToken": "demo-token",
  "secretKey": "demo-secret"
}
```

Alterar probabilidades:

```text
POST http://127.0.0.1:3006/api/v1/attagent
```

Body:

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

## Regras Importantes

- `user_code` e o identificador do usuario do site. Use sempre o mesmo para o mesmo jogador.
- `user_balance` deve ser numero.
- `agentToken` e `secretKey` precisam bater com a tabela `agents`.
- O site nao deve chamar `/game-api/...` diretamente; essas rotas sao usadas pelo jogo aberto no navegador.
- Para teste local, use `127.0.0.1`, nao `api.jrapi.fun`.
- Se mudar `.env` da API, reinicie a API.
- Se mudar saldo/probabilidades no painel, normalmente nao precisa reiniciar a API.

## Checklist Para a IA do Site

1. Criar botao/listagem de jogos usando `game_code`.
2. Ao clicar no jogo, chamar `/api/v1/game_launch`.
3. Abrir `launch_url`.
4. Se usar saldo local, mandar saldo atual em `user_balance`.
5. Se usar saldo do site, implementar `gold_api/user_balance`.
6. Se usar saldo do site, implementar `gold_api/game_callback`.
7. Configurar `callbackurl` no painel admin.
8. Testar primeiro com `fortune-tiger` e `fortune-dragon`.

## Informacoes Que Preciso Receber do Site

Envie estas informacoes para finalizar a integracao:

```text
URL local do site:
Porta do site:
Framework/backend usado:
Rota atual de login:
Como identificar usuario logado:
Campo/id do usuario:
Campo de saldo:
Banco do site:
Se o saldo sera controlado pelo site ou pela API:
URL desejada para callbackurl:
```

Exemplo:

```text
URL local do site: http://127.0.0.1:8000
Porta do site: 8000
Framework/backend usado: Laravel
Como identificar usuario logado: auth()->user()->id
Campo/id do usuario: users.id
Campo de saldo: wallets.balance
Saldo controlado por: site
callbackurl: http://127.0.0.1:8000/
```
