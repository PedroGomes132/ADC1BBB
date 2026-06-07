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
                                <div class="card-title">
                                    <h5 class="m-0 me-2">Resumo do painel</h5>
                                    <p class="page-help">Use este painel para configurar agentes, acompanhar usuarios de jogo e conferir se os jogos estao prontos no banco.</p>
                                </div>

                                <div class="row g-3 mt-1">
                                    <div class="col-md-4">
                                        <a href="agents.php" class="d-block panel-kpi">
                                            <div class="label">Agentes da API</div>
                                            <div class="value"><?php echo counting("agents", "id"); ?></div>
                                            <div class="table-help">Credenciais e callback dos sites integrados.</div>
                                        </a>
                                    </div>
                                    <div class="col-md-4">
                                        <a href="users.php" class="d-block panel-kpi">
                                            <div class="label">Usuarios de jogo</div>
                                            <div class="value"><?php echo counting("users", "id"); ?></div>
                                            <div class="table-help">Sessoes, saldo local e estatisticas.</div>
                                        </a>
                                    </div>
                                    <div class="col-md-4">
                                        <a href="jogos.php" class="d-block panel-kpi">
                                            <div class="label">Catalogo de jogos</div>
                                            <div class="value">29</div>
                                            <div class="table-help">Codigos, IDs PG, seeds e assets.</div>
                                        </a>
                                    </div>
                                </div>

                                <div class="admin-note mt-4 mb-0">
                                    <strong>Fluxo principal:</strong> o site chama <code>/api/v1/game_launch</code> com token, secret, usuario e jogo.
                                    A API cria/atualiza o usuario, abre o jogo e usa o callback do agente para consultar saldo quando configurado.
                                </div>
                            </div>
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
