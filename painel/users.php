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
                                <div class="card-title header-elements">
                                    <div>
                                        <h5 class="m-0 me-2">Usuarios de jogo</h5>
                                        <p class="page-help">Usuarios criados quando um site chama <code>/api/v1/game_launch</code>. Aqui voce acompanha saldo, sessoes e estatisticas de aposta.</p>
                                    </div>
                                    <div class="card-title-elements ms-auto">
                                        <a href="edit-users.php?act=add" class="btn btn-primary">
                                            <span class="tf-icon bx bx-plus"></span>
                                            Novo usuario
                                        </a>
                                    </div>
                                </div>

                                <div class="admin-note">
                                    <strong>Total:</strong> <?php echo counting("users", "id"); ?> usuarios.
                                    <span class="d-block mt-1">Normalmente o usuario deve ser criado pela API no lancamento do jogo. Edite manualmente apenas para testes ou correcao pontual.</span>
                                </div>

                                <div class="table-responsive text-nowrap">
                                    <table id="sorted" class="table table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Usuario</th>
                                                <th>Token sessao</th>
                                                <th>ATK jogo</th>
                                                <th>Saldo</th>
                                                <th>Total apostado</th>
                                                <th>Total debitado</th>
                                                <th>Total ganho</th>
                                                <th>RTP</th>
                                                <th>Influencer</th>
                                                <th>Agente</th>
                                                <th class="not">Acoes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php
                                            $users = getAll("users");
                                            if ($users) foreach ($users as $userss) :
                                            ?>
                                            <tr>
                                                <td><?php echo htmlspecialchars($userss['id']); ?></td>
                                                <td><strong><?php echo htmlspecialchars($userss['username']); ?></strong></td>
                                                <td class="code-cell"><code><?php echo htmlspecialchars($userss['token']); ?></code></td>
                                                <td class="code-cell"><code><?php echo htmlspecialchars($userss['atk']); ?></code></td>
                                                <td><?php echo htmlspecialchars($userss['saldo']); ?></td>
                                                <td><?php echo htmlspecialchars($userss['valorapostado']); ?></td>
                                                <td><?php echo htmlspecialchars($userss['valordebitado']); ?></td>
                                                <td><?php echo htmlspecialchars($userss['valorganho']); ?></td>
                                                <td><?php echo htmlspecialchars($userss['rtp']); ?></td>
                                                <td>
                                                    <span class="badge bg-<?php echo $userss['is_influencer'] ? 'label-success' : 'label-secondary'; ?>">
                                                        <?php echo $userss['is_influencer'] ? 'Sim' : 'Nao'; ?>
                                                    </span>
                                                </td>
                                                <td><?php echo htmlspecialchars($userss['agentid']); ?></td>
                                                <td>
                                                    <div class="text-nowrap">
                                                        <a href="edit-users.php?act=edit&id=<?php echo $userss['id']; ?>" class="btn btn-icon btn-label-info" title="Editar usuario">
                                                            <span class="tf-icons bx bx-message-square-edit"></span>
                                                        </a>
                                                        <a href="save.php?act=delete&id=<?php echo $userss['id']; ?>&cat=users" onclick="return navConfirm(this.href);" class="btn btn-icon btn-label-danger" title="Excluir usuario">
                                                            <span class="tf-icons bx bx-trash"></span>
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
