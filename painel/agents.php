<!doctype html>
<html>
<?php
error_reporting(0);
ini_set('display_errors', 1);
?>

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
                                <div class="card-title header-elements">
                                    <div>
                                        <h5 class="m-0 me-2">Agentes da API</h5>
                                        <p class="page-help">Cada agente representa um site, operador ou integracao autorizada a chamar o endpoint de lancamento dos jogos.</p>
                                    </div>
                                    <div class="card-title-elements ms-auto">
                                        <a href="edit-agents.php?act=add" class="btn btn-primary">
                                            <span class="tf-icon bx bx-plus"></span>
                                            Novo agente
                                        </a>
                                    </div>
                                </div>

                                <div class="admin-note">
                                    <strong>Campos mais importantes:</strong>
                                    <code>agentToken</code> e <code>secretKey</code> autenticam o site externo no <code>/api/v1/game_launch</code>.
                                    <code>callbackurl</code> define onde a API consulta saldo e envia resultado das apostas. Se ficar vazio, a API usa o saldo local.
                                </div>
                            </div>

                            <div class="card-datatable table-responsive">
                                <table id="sorted" class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Codigo do agente</th>
                                            <th>Senha painel</th>
                                            <th>Saldo local</th>
                                            <th>Agent Token</th>
                                            <th>Secret Key</th>
                                            <th>Prob. ganho</th>
                                            <th>Prob. bonus</th>
                                            <th>Prob. ganho RTP</th>
                                            <th>Prob. influencer</th>
                                            <th>Bonus influencer</th>
                                            <th>Ganho por aposta</th>
                                            <th>Ganho por saldo</th>
                                            <th>Limite Chicky</th>
                                            <th>Callback URL</th>
                                            <th class="not">Acoes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php
                                        $users = getAG("agents");
                                        if ($users) foreach ($users as $userss) :
                                            $callback = trim($userss['callbackurl'] ?? '');
                                        ?>
                                        <tr>
                                            <td><?php echo htmlspecialchars($userss['id']); ?></td>
                                            <td><strong><?php echo htmlspecialchars($userss['agentcode']); ?></strong></td>
                                            <td><?php echo htmlspecialchars($userss['senha']); ?></td>
                                            <td><?php echo htmlspecialchars($userss['saldo']); ?></td>
                                            <td class="code-cell"><code><?php echo htmlspecialchars($userss['agentToken']); ?></code></td>
                                            <td class="code-cell"><code><?php echo htmlspecialchars($userss['secretKey']); ?></code></td>
                                            <td><?php echo htmlspecialchars($userss['probganho']); ?>%</td>
                                            <td><?php echo htmlspecialchars($userss['probbonus']); ?>%</td>
                                            <td><?php echo htmlspecialchars($userss['probganhortp']); ?>%</td>
                                            <td><?php echo htmlspecialchars($userss['probganhoinfluencer']); ?>%</td>
                                            <td><?php echo htmlspecialchars($userss['probbonusinfluencer']); ?>%</td>
                                            <td><?php echo htmlspecialchars($userss['probganhoaposta']); ?></td>
                                            <td><?php echo htmlspecialchars($userss['probganhosaldo']); ?></td>
                                            <td><?php echo htmlspecialchars($userss['limitadorchicky']); ?></td>
                                            <td class="code-cell">
                                                <?php if ($callback): ?>
                                                    <code><?php echo htmlspecialchars($callback); ?></code>
                                                <?php else: ?>
                                                    <span class="badge bg-label-warning">Saldo local</span>
                                                <?php endif; ?>
                                            </td>
                                            <td>
                                                <div class="text-nowrap">
                                                    <a href="edit-agents.php?act=edit&id=<?php echo $userss['id']; ?>" class="btn btn-icon btn-label-info" title="Editar agente">
                                                        <span class="tf-icons bx bx-message-square-edit"></span>
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                </table>
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
