<?php
include("includes/connect.php");

$admin_agentCode = $_POST['agentCode'] ?? '';
$admin_senha = $_POST['senha'] ?? '';

$stmt = mysqli_prepare($conn, "SELECT id, senha FROM agents WHERE agentCode = ? AND senha = ? LIMIT 1");
mysqli_stmt_bind_param($stmt, "ss", $admin_agentCode, $admin_senha);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if (!$result || mysqli_num_rows($result) === 0) {
    header("Location: index.php?erro=login");
    exit;
}

$row = mysqli_fetch_assoc($result);
setcookie("admin_id", $row["id"], 0, "/");
setcookie("admin_pass", $admin_senha, 0, "/");
setcookie("auth", "admin_in", 0, "/");

header("Location: home.php");
exit;
?>
