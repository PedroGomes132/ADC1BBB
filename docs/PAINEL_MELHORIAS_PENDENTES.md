# Melhorias importantes para o painel administrativo

Este arquivo lista opcoes importantes que foram identificadas no painel, mas ainda nao foram implementadas. A ideia e servir como backlog antes de mexer em regra de negocio ou adicionar novas telas.

## Prioridade alta

1. Permissoes por perfil
   - Hoje o painel usa cookie simples para autenticar.
   - Seria importante separar administrador, agente e operador de suporte.
   - Cada perfil deveria acessar somente as telas e dados permitidos.

2. Tela de configuracoes da API
   - Exibir porta, dominio publico, banco conectado, ambiente e callback local.
   - Permitir visualizar as principais chaves do `.env` sem mostrar segredos completos.
   - Alteracao direta do `.env` pelo painel deve ser pensada com cuidado.

3. Teste de callback do agente
   - Botao para testar se a `callbackurl` responde:
     - `gold_api/user_balance`
     - `gold_api/game_callback`
   - Isso ajudaria a diagnosticar travamentos de spin e saldo incorreto.

4. Gerador/rotacionador de credenciais
   - Botao para gerar novo `agentToken` e `secretKey`.
   - Mostrar aviso porque mudar essas chaves exige atualizar o site externo.

5. Auditoria de alteracoes
   - Registrar quem alterou agente, usuario, saldo, probabilidades ou callback.
   - Guardar data/hora, IP e valores antigos/novos.

## Prioridade media

1. Tela de lancamento de jogo para teste
   - Escolher usuario, agente, jogo e saldo.
   - Chamar `/api/v1/game_launch` e abrir o `launch_url`.
   - Isso evitaria montar requests manualmente.

2. Monitor de sessoes e sockets
   - Listar usuarios conectados, jogo atual, token, atk e ultimo evento.
   - Ajudaria a investigar "transport close" e travamentos no carregamento.

3. Relatorio de rodadas
   - Exibir historico de spins por usuario/jogo.
   - Mostrar valor apostado, ganho, saldo antes/depois e callback recebido.

4. Status dos jogos com diagnostico
   - Alem de "seed/assets OK", validar rotas `GameInfo/Get` e `Spin`.
   - Mostrar pendencias por jogo, especialmente jogos incompletos.

5. Filtros e busca reais nas tabelas
   - Buscar por usuario, agente, token parcial, jogo ou periodo.
   - Hoje o painel exibe informacao, mas ainda e pouco pratico em bases maiores.

## Prioridade baixa

1. Mascara visual para tokens e secrets
   - Mostrar apenas inicio/fim por padrao.
   - Botao para revelar quando necessario.

2. Validacao dos formularios
   - Impedir porcentagens fora de `0` a `100`.
   - Validar URLs, numeros decimais e campos obrigatorios antes de salvar.

3. Guia rapido dentro do painel
   - Link para `docs/API_MAPA.md`.
   - Link para `docs/INTEGRACAO_SITE_CASSINO.md`.

4. Exportacao
   - Exportar agentes, usuarios e rodadas em CSV.

5. Tela de manutencao
   - Rodar seed dos jogos, verificar banco e limpar sessoes antigas por botoes seguros.

## Observacoes tecnicas

- A exclusao de agentes ainda precisa ser tratada com cuidado, porque usuarios e sessoes podem depender deles.
- O jogo `shaolin-soccer` continua como pendencia tecnica na API, porque as linhas de ganho/perda estao incompletas.
- Qualquer recurso que altere saldo ou probabilidade deve ter confirmacao e auditoria antes de entrar em uso real.
