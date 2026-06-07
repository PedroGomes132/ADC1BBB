<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <?php include "template/head.php"; ?>
</head>

<body>
    <div class="layout-wrapper layout-content-navbar">
        <div class="layout-container">
            <?php include "template/aside.php"; ?>
            <div class="layout-page">
                <?php include "template/top.php"; ?>
                <div class="content-wrapper">
                    <div class="container-xxl flex-grow-1 container-p-y">
                        <div class="card">
                            <div class="card-body">
                                <?php
                                $data = [];
                                $act = $_GET['act'] ?? 'add';
                                $id = $_GET['id'] ?? '';
                                $users = [];
                                if ($act == "edit") {
                                    $users = getById("agents", $id);
                                }
                                ?>

                                <div class="card-title header-elements">
                                    <div>
                                        <h5 class="m-0 me-2"><?php echo $act == "edit" ? "Editar agente" : "Novo agente"; ?></h5>
                                        <p class="page-help">Configure aqui as credenciais, probabilidades e callback usados pela API para este agente.</p>
                                    </div>
                                </div>

                                <div class="admin-note">
                                    <strong>Uso na API:</strong> o site externo envia <code>agentToken</code> e <code>secretKey</code> no <code>/api/v1/game_launch</code>.
                                    A <code>callbackurl</code> deve terminar com barra, por exemplo <code>http://127.0.0.1/cassino/</code>, para a API chamar <code>gold_api/user_balance</code> e <code>gold_api/game_callback</code>.
                                </div>

                                <form method="post" action="save-agents.php" enctype="multipart/form-data">
                                    <input name="cat" type="hidden" value="agents">
                                    <input name="id" type="hidden" value="<?= htmlspecialchars($id) ?>">
                                    <input name="act" type="hidden" value="<?= htmlspecialchars($act) ?>">

                                    <h6 class="mt-2">Identificacao e acesso</h6>
                                    <div class="row">
                                        <div class="mb-3 col-md-4 fv-plugins-icon-container">
                                            <label for="agentcode" class="col-form-label">Codigo do agente</label>
                                            <input class="form-control" type="text" name="agentcode" value="<?= htmlspecialchars($users['agentcode'] ?? '') ?>">
                                            <small class="field-help">Nome interno do operador/site. Exemplo local: demo.</small>
                                        </div>

                                        <div class="mb-3 col-md-4 fv-plugins-icon-container">
                                            <label for="senha" class="col-form-label">Senha do agente</label>
                                            <input class="form-control" type="text" name="senha" value="<?= htmlspecialchars($users['senha'] ?? '') ?>">
                                            <small class="field-help">Usada para login/controle do agente no painel.</small>
                                        </div>

                                        <div class="mb-3 col-md-4 fv-plugins-icon-container">
                                            <label for="saldo" class="col-form-label">Saldo local do agente</label>
                                            <input class="form-control" type="text" name="saldo" value="<?= htmlspecialchars($users['saldo'] ?? '') ?>">
                                            <small class="field-help">Saldo administrativo do agente. Nao e o saldo individual do jogador.</small>
                                        </div>

                                        <div class="mb-3 col-md-6 fv-plugins-icon-container">
                                            <label for="agentToken" class="col-form-label">Agent Token</label>
                                            <input class="form-control" type="text" name="agentToken" value="<?= htmlspecialchars($users['agentToken'] ?? '') ?>">
                                            <small class="field-help">Credencial enviada pelo site externo em cada lancamento de jogo.</small>
                                        </div>

                                        <div class="mb-3 col-md-6 fv-plugins-icon-container">
                                            <label for="secretKey" class="col-form-label">Secret Key</label>
                                            <input class="form-control" type="text" name="secretKey" value="<?= htmlspecialchars($users['secretKey'] ?? '') ?>">
                                            <small class="field-help">Segunda credencial enviada pelo site externo. Deve ficar privada.</small>
                                        </div>
                                    </div>

                                    <h6 class="mt-2">Controle de resultado</h6>
                                    <div class="row">
                                        <div class="mb-3 col-md-4 fv-plugins-icon-container">
                                            <label for="probganho" class="col-form-label">Probabilidade de ganho (%)</label>
                                            <input class="form-control" type="text" name="probganho" value="<?= htmlspecialchars($users['probganho'] ?? '') ?>">
                                            <small class="field-help">Chance geral de retornar uma rodada vencedora.</small>
                                        </div>

                                        <div class="mb-3 col-md-4 fv-plugins-icon-container">
                                            <label for="probbonus" class="col-form-label">Probabilidade de bonus (%)</label>
                                            <input class="form-control" type="text" name="probbonus" value="<?= htmlspecialchars($users['probbonus'] ?? '') ?>">
                                            <small class="field-help">Chance de acionar rodadas/eventos de bonus quando o jogo suporta.</small>
                                        </div>

                                        <div class="mb-3 col-md-4 fv-plugins-icon-container">
                                            <label for="probganhortp" class="col-form-label">Probabilidade por RTP (%)</label>
                                            <input class="form-control" type="text" name="probganhortp" value="<?= htmlspecialchars($users['probganhortp'] ?? '') ?>">
                                            <small class="field-help">Usada quando a API tenta ajustar o comportamento pelo RTP do usuario.</small>
                                        </div>

                                        <div class="mb-3 col-md-4 fv-plugins-icon-container">
                                            <label for="probganhoinfluencer" class="col-form-label">Ganho influencer (%)</label>
                                            <input class="form-control" type="text" name="probganhoinfluencer" value="<?= htmlspecialchars($users['probganhoinfluencer'] ?? '') ?>">
                                            <small class="field-help">Chance de ganho para jogadores marcados como influencer.</small>
                                        </div>

                                        <div class="mb-3 col-md-4 fv-plugins-icon-container">
                                            <label for="probbonusinfluencer" class="col-form-label">Bonus influencer (%)</label>
                                            <input class="form-control" type="text" name="probbonusinfluencer" value="<?= htmlspecialchars($users['probbonusinfluencer'] ?? '') ?>">
                                            <small class="field-help">Chance de bonus para jogadores marcados como influencer.</small>
                                        </div>

                                        <div class="mb-3 col-md-4 fv-plugins-icon-container">
                                            <label for="probganhoaposta" class="col-form-label">Controle por aposta</label>
                                            <input class="form-control" type="text" name="probganhoaposta" value="<?= htmlspecialchars($users['probganhoaposta'] ?? '') ?>">
                                            <small class="field-help">Parametro usado pela logica para limitar/permitir ganho conforme valor apostado.</small>
                                        </div>

                                        <div class="mb-3 col-md-4 fv-plugins-icon-container">
                                            <label for="probganhosaldo" class="col-form-label">Controle por saldo</label>
                                            <input class="form-control" type="text" name="probganhosaldo" value="<?= htmlspecialchars($users['probganhosaldo'] ?? '') ?>">
                                            <small class="field-help">Parametro usado pela logica para limitar/permitir ganho conforme saldo do jogador.</small>
                                        </div>

                                        <div class="mb-3 col-md-4 fv-plugins-icon-container">
                                            <label for="limitadorchicky" class="col-form-label">Limitador Chicky Run</label>
                                            <input class="form-control" type="text" name="limitadorchicky" value="<?= htmlspecialchars($users['limitadorchicky'] ?? '') ?>">
                                            <small class="field-help">Valor maximo usado no Chicky Run antes de forcar perda para evitar ganho acima do limite.</small>
                                        </div>
                                    </div>

                                    <h6 class="mt-2">Integracao com site externo</h6>
                                    <div class="row">
                                        <div class="mb-3 col-md-8 fv-plugins-icon-container">
                                            <label for="callbackurl" class="col-form-label">Callback URL</label>
                                            <input class="form-control" type="text" name="callbackurl" placeholder="http://127.0.0.1/cassino/" value="<?= htmlspecialchars($users['callbackurl'] ?? '') ?>">
                                            <small class="field-help">Deixe vazio para usar saldo local. Preencha para o site externo controlar saldo e receber resultados.</small>
                                        </div>
                                    </div>

                                    <div class="mt-3">
                                        <hr>
                                        <button type="submit" class="btn btn-label-primary me-2">Salvar alteracoes</button>
                                        <a href="agents.php" class="btn btn-label-secondary">Voltar</a>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <footer class="content-footer footer bg-footer-theme">
                        <div class="container-xxl d-flex flex-wrap justify-content-between py-2 flex-md-row flex-column">
                            <div class="mb-2 mb-md-0">
                                &copy;
                                <script>document.write(new Date().getFullYear())</script>
                                , Todos os direitos reservados
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
        <?php include "template/footer.php"; ?>
</body>

</html>
