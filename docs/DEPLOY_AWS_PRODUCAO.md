# Deploy AWS Producao

Este guia sobe a API em uma EC2 Ubuntu com MySQL, PM2 e Nginx. O Node fica privado em `127.0.0.1:3006`; o publico acessa somente `https://api.seudominio.com`.

## Informacoes que preciso receber da AWS

Antes de eu executar a subida direto no servidor, me envie:

```txt
IP publico da EC2:
Usuario SSH: ubuntu ou outro?
Caminho da chave .pem no seu PC:
Dominio da API:
Dominio do painel, se for separado:
O site de cassino tambem vai ficar nessa EC2? sim/nao
Vai usar MySQL na EC2 ou RDS?
```

## Portas no Security Group

Abra somente:

```txt
22  SSH    seu IP
80  HTTP   0.0.0.0/0
443 HTTPS  0.0.0.0/0
```

Nao abra `3006` para internet. O Nginx encaminha para ela internamente.

## DNS

Crie um registro `A` apontando para o IP publico da EC2:

```txt
api.seudominio.com -> IP_PUBLICO_DA_EC2
```

Se o painel tambem for publico:

```txt
painel.seudominio.com -> IP_PUBLICO_DA_EC2
```

### Dominio gratis temporario para teste

Para testar HTTPS sem comprar dominio, use `sslip.io`. Com o IP atual da AWS:

```txt
IP publico: 18.230.116.113
Dominio temporario: 18.230.116.113.sslip.io
URL publica da API: https://18.230.116.113.sslip.io
```

Nesse modo, a `.env` da API deve usar:

```env
DOMINIO_API=18.230.116.113.sslip.io
API_PUBLIC_URL=https://18.230.116.113.sslip.io
API_HOST=18.230.116.113.sslip.io
RESOURCE_HOST=//18.230.116.113.sslip.io
LOCAL_CALLBACK_URL=https://18.230.116.113.sslip.io
```

## Instalar base do servidor

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y git curl unzip nginx mysql-server
```

Instale Node LTS com `nvm`:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts
node -v
npm -v
```

Instale PM2:

```bash
npm install -g pm2
```

## Criar banco MySQL

Entre no MySQL:

```bash
sudo mysql
```

Crie banco e usuario. Troque a senha antes de usar:

```sql
CREATE DATABASE IF NOT EXISTS phillypsapi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'phillypsapi'@'localhost' IDENTIFIED BY 'SENHA_FORTE_AQUI';
CREATE USER IF NOT EXISTS 'phillypsapi'@'127.0.0.1' IDENTIFIED BY 'SENHA_FORTE_AQUI';
GRANT ALL PRIVILEGES ON phillypsapi.* TO 'phillypsapi'@'localhost';
GRANT ALL PRIVILEGES ON phillypsapi.* TO 'phillypsapi'@'127.0.0.1';
FLUSH PRIVILEGES;
EXIT;
```

Importe o schema do projeto:

```bash
mysql -u phillypsapi -p phillypsapi < local-mysql-schema.sql
```

## Subir arquivos da API

Pasta recomendada:

```bash
sudo mkdir -p /var/www/pgsoft-api
sudo chown -R $USER:$USER /var/www/pgsoft-api
```

Copie o projeto para `/var/www/pgsoft-api`. Se usar Git:

```bash
cd /var/www
git clone SEU_REPOSITORIO pgsoft-api
cd /var/www/pgsoft-api
```

Se enviar por ZIP/SFTP, extraia dentro de `/var/www/pgsoft-api`.

## Sincronizar com GitHub

Repositorio atual:

```txt
HTTPS: https://github.com/PedroGomes132/ADC1BBB.git
SSH: git@github.com:PedroGomes132/ADC1BBB.git
```

Instale Git na EC2:

```bash
sudo apt install -y git
git --version
```

Crie uma chave SSH para a EC2:

```bash
ssh-keygen -t ed25519 -C "aws-pgsoft-api" -f ~/.ssh/pgsoft_github -N ""
cat ~/.ssh/pgsoft_github.pub
```

Cadastre a chave publica no GitHub em `Settings > SSH and GPG keys` ou como `Deploy key` do repositorio.

Configure o SSH:

```bash
cat > ~/.ssh/config <<'EOF'
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/pgsoft_github
  IdentitiesOnly yes
EOF

chmod 600 ~/.ssh/config
ssh -T git@github.com
```

Depois use o repositorio para sincronizar:

```bash
cd /var/www/pgsoft-api
git remote add origin git@github.com:SEU_USUARIO/SEU_REPOSITORIO.git
git fetch origin
```

Se a pasta ja tiver arquivos de producao, faca backup antes de substituir qualquer coisa.

## Configurar `.env` de producao

Na EC2:

```bash
cd /var/www/pgsoft-api
cp .env.production.example .env
nano .env
```

Exemplo:

```env
AMBIENTE=PROD
NODE_ENV=production
PORT=3006
DOMINIO_API=api.seudominio.com
API_PUBLIC_URL=https://api.seudominio.com
API_HOST=api.seudominio.com
RESOURCE_HOST=//api.seudominio.com
LOCAL_CALLBACK_URL=https://api.seudominio.com

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=phillypsapi
DB_PASSWORD=SENHA_FORTE_AQUI
DB_NAME=phillypsapi

DEFAULT_PROVIDER_CODE=PGSOFT
DEFAULT_CURRENCY=BRL
API_SECRET=SEGREDO_FORTE_AQUI
```

## Instalar dependencias e compilar

```bash
cd /var/www/pgsoft-api
npm ci
npm run build
npm run bootstrap:games
mkdir -p logs
```

Teste localmente na EC2:

```bash
npm start
```

Em outro terminal:

```bash
curl http://127.0.0.1:3006/status
```

Deve responder:

```json
{"status":"operational"}
```

Pare o `npm start` com `CTRL+C`.

## Rodar com PM2

```bash
cd /var/www/pgsoft-api
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

O comando `pm2 startup` vai imprimir outro comando com `sudo`. Execute exatamente o comando que ele mostrar.

Comandos uteis:

```bash
pm2 status
pm2 logs pgsoft-api
pm2 restart pgsoft-api
pm2 stop pgsoft-api
```

## Configurar Nginx

Crie o arquivo:

```bash
sudo nano /etc/nginx/sites-available/pgsoft-api
```

Conteudo, trocando o dominio:

```nginx
server {
    listen 80;
    server_name api.seudominio.com;

    client_max_body_size 20m;

    location /socket.io/ {
        proxy_pass http://127.0.0.1:3006;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
    }

    location / {
        proxy_pass http://127.0.0.1:3006;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
    }
}
```

Ative:

```bash
sudo ln -s /etc/nginx/sites-available/pgsoft-api /etc/nginx/sites-enabled/pgsoft-api
sudo nginx -t
sudo systemctl reload nginx
```

## HTTPS com Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.seudominio.com
```

Teste renovacao:

```bash
sudo certbot renew --dry-run
```

## Testes de producao

Status:

```bash
curl https://api.seudominio.com/status
```

Agent:

```bash
curl -X POST https://api.seudominio.com/api/v1/getagent \
  -H "Content-Type: application/json" \
  -d '{"agentToken":"SEU_AGENT_TOKEN","secretKey":"SUA_SECRET_KEY"}'
```

Lancamento do jogo:

```bash
curl -X POST https://api.seudominio.com/api/v1/game_launch \
  -H "Content-Type: application/json" \
  -d '{
    "agentToken":"SEU_AGENT_TOKEN",
    "secretKey":"SUA_SECRET_KEY",
    "user_code":"teste-prod-001",
    "provider_code":"PGSOFT",
    "game_code":"fortune-tiger",
    "user_balance":100
  }'
```

A resposta deve trazer `launch_url`. Abra a URL no navegador.

## Painel administrativo em producao

O painel PHP pode rodar no mesmo servidor, mas ele precisa apontar para o mesmo `.env` da API.

Opcoes:

1. Painel privado por VPN/IP
   - Melhor opcao para producao.
   - Nao deixa painel administrativo aberto para todos.

2. Painel publico com dominio separado
   - Exemplo: `https://painel.seudominio.com`.
   - Precisa reforcar login, senha forte e HTTPS.

Se usar Nginx + PHP-FPM:

```bash
sudo apt install -y php-fpm php-mysql
sudo mkdir -p /var/www/painel
sudo cp -r painel/* /var/www/painel/
sudo chown -R www-data:www-data /var/www/painel
```

Depois configure um `server` do Nginx para PHP. Antes de publicar painel aberto, recomendo implementar permissao melhor e protecao por IP.

## Checklist antes de liberar

- `.env` em `AMBIENTE=PROD`.
- `DOMINIO_API`, `API_PUBLIC_URL`, `API_HOST` e `RESOURCE_HOST` com dominio real.
- MySQL com senha forte.
- Agent de producao com `agentToken` e `secretKey` novos.
- `callbackurl` do agent apontando para o site real, se o saldo for do site.
- Porta `3006` fechada no Security Group.
- HTTPS funcionando.
- `pm2 status` online.
- `npm run bootstrap:games` executado.
- Teste de `fortune-tiger` e `fortune-dragon` feito pelo dominio publico.

## Observacoes

- O jogo `shaolin-soccer` ainda esta documentado como pendencia tecnica.
- Se o site de cassino for HTTPS, a API tambem precisa ser HTTPS para evitar bloqueios do navegador.
- Se usar RDS, o Security Group do RDS deve liberar MySQL apenas para o Security Group da EC2.
