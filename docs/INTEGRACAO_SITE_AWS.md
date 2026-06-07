# Integracao do site com a API PGSoft na AWS

Este documento e para a IA/desenvolvedor que esta editando o site de cassino. A API PGSoft roda separada do site e deve ser usada para abrir os jogos, validar sessao, consultar saldo e registrar resultados de aposta.

## Dados atuais da API

```txt
API base URL: http://54.233.39.179:3006
Status: http://54.233.39.179:3006/status
Provider padrao: PGSOFT
Moeda padrao: BRL
```

## URLs da integracao

Use exatamente este formato no painel/configuracao do site:

```txt
Status da API:
http://54.233.39.179:3006/status

Abrir jogo:
http://54.233.39.179:3006/api/v1/game_launch

Callback saldo:
http://18.230.20.207/gold_api/user_balance

Callback rodada:
http://18.230.20.207/gold_api/game_callback
```

Observacao: os callbacks acima usam `18.230.20.207` porque esse e o IP informado para o site de cassino. Se o site estiver em outro IP ou dominio, troque somente as URLs de callback.

Credenciais de teste do agente:

```txt
agentToken: demo-token
secretKey: demo-secret
agentCode: demo
```

Importante: em producao real, troque `demo-token` e `demo-secret` por credenciais fortes no painel/banco.

## Fluxo principal

1. Usuario loga no site de cassino.
2. Site escolhe qual jogo abrir.
3. Site chama a API PGSoft em `/api/v1/game_launch`.
4. API retorna `launch_url`.
5. Site redireciona o usuario para `launch_url` ou abre em iframe/pagina de jogo.
6. O jogo roda dentro da API PGSoft.
7. Se o agente tiver `callbackurl`, a API chama o site para consultar saldo e registrar aposta/ganho.

## Abrir jogo

Endpoint:

```txt
POST http://54.233.39.179:3006/api/v1/game_launch
Content-Type: application/json
```

Payload:

```json
{
  "agentToken": "demo-token",
  "secretKey": "demo-secret",
  "user_code": "ID_UNICO_DO_USUARIO_NO_SITE",
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
  "launch_url": "http://54.233.39.179:3006/126/index.html?..."
}
```

O site deve abrir o valor de `launch_url`.

Exemplo em JavaScript:

```js
async function abrirJogoPgsoft(usuario, jogo) {
  const response = await fetch("http://54.233.39.179:3006/api/v1/game_launch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      agentToken: "demo-token",
      secretKey: "demo-secret",
      user_code: String(usuario.id),
      provider_code: "PGSOFT",
      game_code: jogo,
      user_balance: Number(usuario.saldo || 0)
    })
  });

  const data = await response.json();

  if (!data.launch_url) {
    throw new Error(data.msg || "Falha ao abrir jogo");
  }

  window.location.href = data.launch_url;
}
```

## Codigos dos jogos

Use estes valores em `game_code`:

```txt
fortune-tiger
fortune-dragon
fortune-rabbit
fortune-ox
fortune-mouse
bikini-paradise
jungle-delight
double-fortune
ganesha-gold
dragon-tiger-luck
butterfly-blossom
lucky-clover
chicky-run
prosper-ftree
ultimate-striker
ninja-raccoon
cash-mania
wings-iguazu
piggy-gold
wild-bandito
zombie-outbreak
majestic-ts
treasures-aztec
thai-river
gdn-ice-fire
rise-apollo
wild-bounty-sd
three-cz-pigs
shaolin-soccer
```

Observacao: `shaolin-soccer` ainda tem pendencia tecnica conhecida na API. Para producao, priorize os demais jogos.

## Saldo: dois modos possiveis

### Modo 1: saldo local da API

Se `callbackurl` do agente estiver vazio, a API usa a tabela interna `users`.

Nesse modo o site so envia `user_balance` no `game_launch`. A API controla saldo localmente.

Vantagem: mais simples para teste.

Desvantagem: o saldo do site e o saldo da API podem divergir.

### Modo 2: saldo controlado pelo site

Este e o modo recomendado para cassino real.

O site deve expor dois endpoints:

```txt
POST {callbackurl}gold_api/user_balance
POST {callbackurl}gold_api/game_callback
```

Exemplo de `callbackurl`:

```txt
https://seusite.com/
```

Com isso, a API chamara:

```txt
https://seusite.com/gold_api/user_balance
https://seusite.com/gold_api/game_callback
```

## Callback de consulta de saldo

O site precisa criar:

```txt
POST /gold_api/user_balance
```

A API enviara algo parecido com:

```json
{
  "user_code": "ID_UNICO_DO_USUARIO_NO_SITE",
  "agent_secret": "demo-secret"
}
```

Resposta que o site deve retornar:

```json
{
  "status": 1,
  "user_balance": 100.5
}
```

Se o usuario nao existir ou estiver bloqueado:

```json
{
  "status": 0,
  "msg": "Usuario invalido"
}
```

Exemplo PHP:

```php
<?php
header('Content-Type: application/json; charset=utf-8');

$input = json_decode(file_get_contents('php://input'), true);
$userCode = $input['user_code'] ?? null;
$agentSecret = $input['agent_secret'] ?? '';

if ($agentSecret !== 'demo-secret') {
    http_response_code(401);
    echo json_encode(['status' => 0, 'msg' => 'Nao autorizado']);
    exit;
}

// Buscar usuario no banco do site pelo $userCode.
// Retornar o saldo real do site.

echo json_encode([
    'status' => 1,
    'user_balance' => 100.00
]);
```

## Callback de resultado da aposta

O site precisa criar:

```txt
POST /gold_api/game_callback
```

A API enviara dados da rodada. Os nomes podem variar por jogo, mas o site deve tratar pelo menos:

```json
{
  "agent_secret": "demo-secret",
  "user_code": "ID_UNICO_DO_USUARIO_NO_SITE",
  "game_code": "fortune-tiger",
  "bet": 0.4,
  "win": 2.0,
  "txn_id": "identificador-da-rodada"
}
```

Regra esperada:

```txt
novo_saldo = saldo_atual - bet + win
```

Resposta esperada:

```json
{
  "status": 1,
  "msg": "OK"
}
```

Exemplo PHP simplificado:

```php
<?php
header('Content-Type: application/json; charset=utf-8');

$input = json_decode(file_get_contents('php://input'), true);

if (($input['agent_secret'] ?? '') !== 'demo-secret') {
    http_response_code(401);
    echo json_encode(['status' => 0, 'msg' => 'Nao autorizado']);
    exit;
}

$userCode = $input['user_code'] ?? null;
$bet = (float) ($input['bet'] ?? 0);
$win = (float) ($input['win'] ?? 0);

// Buscar usuario no banco do site.
// Debitar aposta e creditar ganho:
// saldo = saldo - $bet + $win
// Registrar historico da rodada para auditoria.

echo json_encode(['status' => 1, 'msg' => 'OK']);
```

## Configurar callbackurl do agente

Depois que o site tiver os callbacks, configure o agente da API com:

```txt
callbackurl=https://seusite.com/
```

Atencao: mantenha a barra final `/`.

Se o site estiver no mesmo servidor e ainda sem dominio, pode ser:

```txt
callbackurl=http://54.233.39.179/
```

Mas para producao real, prefira HTTPS.

## CORS e abertura em navegador

Se o site chamar a API pelo navegador, a API atual aceita CORS amplo. Ainda assim, em producao ideal:

```txt
Site: https://seusite.com
API: https://api.seusite.com
```

Evite misturar site HTTPS com API HTTP, porque o navegador pode bloquear por mixed content.

## Checklist para a IA do site

1. Criar botao/listagem de jogos usando os `game_code`.
2. Ao clicar no jogo, chamar `/api/v1/game_launch`.
3. Usar `user_code` como ID unico e estavel do usuario no site.
4. Enviar saldo atual em `user_balance`.
5. Abrir o `launch_url` retornado.
6. Se o saldo for controlado pelo site, criar `/gold_api/user_balance`.
7. Se o saldo for controlado pelo site, criar `/gold_api/game_callback`.
8. Validar `agent_secret` nos callbacks.
9. Registrar historico de apostas/ganhos no banco do site.
10. Configurar `callbackurl` no agente da API.

## Teste rapido com curl

```bash
curl http://54.233.39.179:3006/status
```

```bash
curl -X POST http://54.233.39.179:3006/api/v1/game_launch \
  -H "Content-Type: application/json" \
  -d '{
    "agentToken":"demo-token",
    "secretKey":"demo-secret",
    "user_code":"teste-site-001",
    "provider_code":"PGSOFT",
    "game_code":"fortune-tiger",
    "user_balance":100
  }'
```

Copie o `launch_url` e abra no navegador.

## Informacoes que precisamos receber do site

```txt
URL publica do site:
Banco usado pelo site:
Tabela de usuarios:
Campo ID do usuario:
Campo saldo:
Como identificar usuario logado:
Rotas criadas para callback:
O saldo final sera controlado pelo site ou pela API:
```
