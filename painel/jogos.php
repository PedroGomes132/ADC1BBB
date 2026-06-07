<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <?php include "template/head.php"; ?>
    <?php include "includes/games.php"; ?>
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
                                <div class="card-title header-elements">
                                    <div>
                                        <h5 class="m-0 me-2">Catalogo de jogos</h5>
                                        <p class="page-help">Lista dos jogos conhecidos pela API, com o codigo usado no <code>/api/v1/game_launch</code> e o status dos seeds/assets locais.</p>
                                    </div>
                                </div>
                                <div class="admin-note">
                                    <strong>Como usar:</strong> envie o valor da coluna <code>Game Code</code> no campo <code>game_code</code> da rota <code>/api/v1/game_launch</code>.
                                    Se algum jogo aparecer com seed faltando, rode <code>npm run bootstrap:games</code> na pasta da API.
                                </div>
                                <div class="table-responsive text-nowrap">
                                    <table class="table table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Jogo</th>
                                                <th>Game Code</th>
                                                <th>ID PG</th>
                                                <th>Seed no banco</th>
                                                <th>Assets</th>
                                                <th>Uso no site</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php foreach ($GAME_CATALOG as $game):
                                                $code = mysqli_real_escape_string($conn, $game['code']);
                                                $seedQuery = mysqli_query($conn, "SELECT id FROM spins_inicial WHERE game_code = '{$code}' LIMIT 1");
                                                $hasSeed = $seedQuery && mysqli_num_rows($seedQuery) > 0;
                                                $assetPath = $projectRoot . '/api/public/' . $game['id'] . '/index.html';
                                                $distAssetPath = $projectRoot . '/dist/public/' . $game['id'] . '/index.html';
                                                $hasAssets = file_exists($assetPath) || file_exists($distAssetPath);
                                            ?>
                                            <tr>
                                                <td><?php echo htmlspecialchars($game['name']); ?></td>
                                                <td><?php echo htmlspecialchars($game['code']); ?></td>
                                                <td><?php echo htmlspecialchars($game['id']); ?></td>
                                                <td>
                                                    <span class="badge bg-<?php echo $hasSeed ? 'success' : 'danger'; ?>">
                                                        <?php echo $hasSeed ? 'OK' : 'Faltando'; ?>
                                                    </span>
                                                </td>
                                                <td>
                                                    <span class="badge bg-<?php echo $hasAssets ? 'success' : 'warning'; ?>">
                                                        <?php echo $hasAssets ? 'OK' : 'Sem pasta'; ?>
                                                    </span>
                                                </td>
                                                <td>
                                                    <code>game_code=<?php echo htmlspecialchars($game['code']); ?></code>
                                                    <span class="table-help d-block">Use este codigo na chamada de lancamento.</span>
                                                </td>
                                            </tr>
                                            <?php endforeach; ?>
                                        </tbody>
                                    </table>
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
