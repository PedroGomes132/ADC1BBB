# API independente da plataforma

Este arquivo orienta outra IA ou desenvolvedor a criar uma API separada dentro do mesmo servidor da plataforma, sem quebrar as rotas existentes.

## Servidor atual

- IP publico: `18.230.20.207`
- Raiz do site: `/var/www/html`
- Container PHP/Apache: `casa-site`
- Container MariaDB: `casa-db`
- Banco: `casa`
- Usuario do banco da aplicacao: `casa_user`
- Senha do banco da aplicacao: `admin132db`
- Root MariaDB: `root`
- Senha root MariaDB: `root132`

## Caminho correto da API nova

Use sempre uma pasta separada da API original:

```txt
/var/www/html/minha-api/
```

URLs publicas:

```txt
http://18.230.20.207/minha-api/status.php
http://18.230.20.207/minha-api/endpoint.php
```

## Caminho que NAO deve ser usado

Nao criar rotas novas em:

```txt
/var/www/html/api/
/var/www/html/api/v1/
```

Motivo: o `.htaccess` principal captura quase tudo em `/api/*` e redireciona para:

```txt
/var/www/html/api/v1/api.php
```

Esse arquivo principal e protegido por ionCube e nao deve ser alterado.

## Criar endpoint de teste

```bash
sudo mkdir -p /var/www/html/minha-api

sudo tee /var/www/html/minha-api/status.php > /dev/null <<'PHP'
<?php
header('Content-Type: application/json; charset=utf-8');

echo json_encode([
    'success' => true,
    'message' => 'API independente funcionando',
    'time' => date('Y-m-d H:i:s')
]);
PHP
```

Teste:

```bash
curl http://18.230.20.207/minha-api/status.php
```

Resposta esperada:

```json
{"success":true,"message":"API independente funcionando","time":"2026-06-06 20:00:00"}
```

## Conexao com banco

Para reutilizar a conexao existente:

```php
include_once('/var/www/html/admin/services/database.php');
```

Exemplo:

```bash
sudo tee /var/www/html/minha-api/usuario.php > /dev/null <<'PHP'
<?php
header('Content-Type: application/json; charset=utf-8');

include_once('/var/www/html/admin/services/database.php');

$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

if (!$id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID invalido']);
    exit;
}

$stmt = $mysqli->prepare('SELECT id, mobile, saldo, cpf FROM usuarios WHERE id = ? LIMIT 1');
$stmt->bind_param('i', $id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
$stmt->close();

echo json_encode([
    'success' => (bool) $user,
    'data' => $user
]);
PHP
```

Teste:

```bash
curl "http://18.230.20.207/minha-api/usuario.php?id=928376393"
```

## Protecao simples por chave

Use header `X-API-Key`.

```bash
sudo tee /var/www/html/minha-api/protegida.php > /dev/null <<'PHP'
<?php
header('Content-Type: application/json; charset=utf-8');

$apiKey = $_SERVER['HTTP_X_API_KEY'] ?? '';

if (!hash_equals('troque-esta-chave', $apiKey)) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Nao autorizado']);
    exit;
}

echo json_encode(['success' => true]);
PHP
```

Teste:

```bash
curl -H "X-API-Key: troque-esta-chave" \
  http://18.230.20.207/minha-api/protegida.php
```

## Regras de seguranca

- Nao editar `api/v1/api.php`.
- Nao editar arquivos ionCube.
- Nao sobrescrever `.htaccess` da raiz.
- Nao criar arquivos soltos na raiz se puder usar `/minha-api`.
- Usar `prepare()` e `bind_param()` em toda query com entrada do usuario.
- Retornar sempre JSON com `Content-Type: application/json`.
- Validar metodo HTTP antes de executar a acao.
- Para endpoints internos, exigir `X-API-Key` ou token equivalente.

## Logs

Ver logs em tempo real:

```bash
sudo docker logs -f --tail 80 casa-site
```

Filtrar erros:

```bash
sudo docker logs casa-site 2>&1 | grep -iE "fatal|uncaught|error|alert| 500 | 404 | 403 " | tail -n 100
```

## Reiniciar site

```bash
sudo docker restart casa-site
```

## Conferir containers

```bash
sudo docker ps
```

Deve existir:

```txt
casa-site
casa-db
```

## Observacao sobre CPF e Asaas

O gateway Asaas exige CPF/CNPJ para criar Pix. O projeto ja tem:

- fallback no gateway Asaas para gerar CPF valido quando usuario antigo esta sem CPF;
- trigger SQL opcional para novos usuarios nascerem com CPF matematicamente valido.

Arquivos relacionados:

```txt
/var/www/html/gateway/asaas_lib.php
/var/www/html/gateway/asaas_create_pix.php
/var/www/html/sql/cpf_auto_trigger.sql
```

Para producao real, prefira CPF informado pelo usuario.
