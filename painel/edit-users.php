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
                                    $users = getById("users", $id);
                                }
                                ?>

                                <div class="card-title header-elements">
                                    <div>
                                        <h5 class="m-0 me-2"><?php echo $act == "edit" ? "Editar usuario de jogo" : "Novo usuario de jogo"; ?></h5>
                                        <p class="page-help">Use esta tela para testes locais. Em producao, o site normalmente cria ou atualiza o usuario pela chamada de lancamento do jogo.</p>
                                    </div>
                                </div>

                                <div class="admin-note">
                                    <strong>Atencao:</strong> <code>token</code> e <code>atk</code> fazem parte da sessao aberta no jogo. Alterar esses campos enquanto o jogo esta aberto pode desconectar ou travar a sessao.
                                </div>

                                <form method="post" action="save.php" enctype="multipart/form-data">
                                    <input name="cat" type="hidden" value="users">
                                    <input name="id" type="hidden" value="<?= htmlspecialchars($id) ?>">
                                    <input name="act" type="hidden" value="<?= htmlspecialchars($act) ?>">

                                    <h6 class="mt-2">Sessao do jogador</h6>
                                    <div class="row">
                                        <div class="mb-3 col-md-4 fv-plugins-icon-container">
                                            <label class="col-form-label">Username / user_code</label>
                                            <input class="form-control" type="text" name="username" value="<?= htmlspecialchars($users['username'] ?? '') ?>">
                                            <small class="field-help">Mesmo valor enviado pelo site em <code>user_code</code>.</small>
                                        </div>

                                        <div class="mb-3 col-md-4 fv-plugins-icon-container">
                                            <label class="col-form-label">Token da sessao</label>
                                            <input class="form-control" type="text" name="token" value="<?= htmlspecialchars($users['token'] ?? '') ?>">
                                            <small class="field-help">Token usado nas chamadas de sessao e carregamento do jogo.</small>
                                        </div>

                                        <div class="mb-3 col-md-4 fv-plugins-icon-container">
                                            <label class="col-form-label">ATK do jogo</label>
                                            <input class="form-control" type="text" name="atk" value="<?= htmlspecialchars($users['atk'] ?? '') ?>">
                                            <small class="field-help">Chave usada pelas rotas internas do jogo, como GameInfo e Spin.</small>
                                        </div>
                                    </div>

                                    <h6 class="mt-2">Saldo e estatisticas</h6>
                                    <div class="row">
                                        <div class="mb-3 col-md-3 fv-plugins-icon-container">
                                            <label class="col-form-label">Saldo</label>
                                            <input class="form-control" type="text" name="saldo" value="<?= htmlspecialchars($users['saldo'] ?? '') ?>">
                                            <small class="field-help">Saldo local usado quando o agente nao possui callback externo.</small>
                                        </div>

                                        <div class="mb-3 col-md-3 fv-plugins-icon-container">
                                            <label class="col-form-label">Valor apostado</label>
                                            <input class="form-control" type="text" name="valorapostado" value="<?= htmlspecialchars($users['valorapostado'] ?? '') ?>">
                                            <small class="field-help">Soma registrada das apostas realizadas.</small>
                                        </div>

                                        <div class="mb-3 col-md-3 fv-plugins-icon-container">
                                            <label class="col-form-label">Valor debitado</label>
                                            <input class="form-control" type="text" name="valordebitado" value="<?= htmlspecialchars($users['valordebitado'] ?? '') ?>">
                                            <small class="field-help">Total debitado do saldo em rodadas.</small>
                                        </div>

                                        <div class="mb-3 col-md-3 fv-plugins-icon-container">
                                            <label class="col-form-label">Valor ganho</label>
                                            <input class="form-control" type="text" name="valorganho" value="<?= htmlspecialchars($users['valorganho'] ?? '') ?>">
                                            <small class="field-help">Total ganho pelo usuario nas rodadas.</small>
                                        </div>

                                        <div class="mb-3 col-md-3 fv-plugins-icon-container">
                                            <label class="col-form-label">RTP</label>
                                            <input class="form-control" type="text" name="rtp" value="<?= htmlspecialchars($users['rtp'] ?? '') ?>">
                                            <small class="field-help">Percentual calculado/atualizado pela API durante as jogadas.</small>
                                        </div>

                                        <div class="mb-3 col-md-3 fv-plugins-icon-container">
                                            <label class="col-form-label">Modo influencer</label>
                                            <select class="form-select" name="isinfluencer">
                                                <?php $isInfluencer = !empty($users['is_influencer']); ?>
                                                <option value="false" <?php echo !$isInfluencer ? 'selected' : ''; ?>>Nao</option>
                                                <option value="true" <?php echo $isInfluencer ? 'selected' : ''; ?>>Sim</option>
                                            </select>
                                            <small class="field-help">Quando ativo, usa as probabilidades influencer configuradas no agente.</small>
                                        </div>

                                        <div class="mb-3 col-md-3 fv-plugins-icon-container">
                                            <label class="col-form-label">ID do agente</label>
                                            <input class="form-control" type="text" name="agentid" value="<?= htmlspecialchars($users['agentid'] ?? '') ?>">
                                            <small class="field-help">Relaciona o usuario ao agente da API.</small>
                                        </div>
                                    </div>

                                    <div class="mt-3">
                                        <hr>
                                        <button type="submit" class="btn btn-label-primary me-2">Salvar alteracoes</button>
                                        <a href="users.php" class="btn btn-label-secondary">Voltar</a>
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
