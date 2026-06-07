<?php
error_reporting(0);
ini_set('display_errors', 1);
session_start();
if (($_COOKIE['auth'] ?? '') == "admin_in") {
    header("location:home.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="pt-br" class="light-style customizer-hide" dir="ltr" data-theme="theme-default"
    data-assets-path="../assets/" data-template="vertical-menu-template-free">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <title>Painel Administrativo da API PGSoft</title>
    <link rel="icon" type="image/x-icon" href="assets/img/favicon/favicon.ico">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/vendor/fonts/boxicons.css">
    <link rel="stylesheet" href="assets/vendor/css/core.css" class="template-customizer-core-css">
    <link rel="stylesheet" href="assets/vendor/css/theme-default.css" class="template-customizer-theme-css">
    <link rel="stylesheet" href="assets/css/demo.css">
    <link rel="stylesheet" href="assets/css/admin-help.css">
    <link rel="stylesheet" href="assets/vendor/libs/sweetalert2/sweetalert2.css">
    <link rel="stylesheet" href="assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css">
    <link rel="stylesheet" href="assets/vendor/css/pages/page-auth.css">
    <script src="assets/vendor/js/helpers.js"></script>
    <script src="assets/js/config.js"></script>
</head>

<body>
    <div class="container-xxl">
        <div class="authentication-wrapper authentication-basic container-p-y">
            <div class="authentication-inner">
                <div class="card">
                    <div class="card-body">
                        <div class="app-brand justify-content-center">
                            <a href="#" class="app-brand-link gap-2">
                                <span class="app-brand-logo demo">API PGSoft</span>
                            </a>
                        </div>

                        <h4 class="mb-2">Painel Administrativo da API PGSoft</h4>
                        <p class="mb-4">Entre com o codigo e a senha do agente para configurar a integracao.</p>

                        <?php if (($_GET['erro'] ?? '') == 'login'): ?>
                            <div class="alert alert-danger">Codigo do agente ou senha invalidos.</div>
                        <?php endif; ?>

                        <form id="formAuthentication" class="mb-3" method="POST" action="login.php">
                            <div class="mb-3">
                                <label for="agentCode" class="form-label">Codigo do agente</label>
                                <input type="text" class="form-control" id="agentCode" name="agentCode" placeholder="Exemplo: demo" autofocus>
                                <small class="field-help">No ambiente local, o agente padrao e <code>demo</code>.</small>
                            </div>
                            <div class="mb-3 form-password-toggle">
                                <div class="d-flex justify-content-between">
                                    <label class="form-label" for="senha">Senha</label>
                                    <small class="text-muted">Configurada no cadastro do agente</small>
                                </div>
                                <div class="input-group input-group-merge">
                                    <input type="password" id="password" class="form-control" name="senha" placeholder="************" aria-describedby="senha">
                                    <span class="input-group-text cursor-pointer"><i class="bx bx-hide"></i></span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <button type="submit" class="btn btn-primary d-grid w-100">Acessar painel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="assets/vendor/libs/jquery/jquery.js"></script>
    <script src="assets/vendor/libs/popper/popper.js"></script>
    <script src="assets/vendor/js/bootstrap.js"></script>
    <script src="assets/vendor/libs/sweetalert2/sweetalert2.js"></script>
    <script src="assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"></script>
    <script src="assets/js/jquery.form.js"></script>
    <script src="assets/vendor/libs/formvalidation/dist/js/FormValidation.min.js"></script>
    <script src="assets/vendor/libs/formvalidation/dist/js/plugins/Bootstrap5.min.js"></script>
    <script src="assets/vendor/libs/formvalidation/dist/js/plugins/AutoFocus.min.js"></script>
    <script src="assets/js/main.js"></script>
</body>

</html>
