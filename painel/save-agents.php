<?php
error_reporting(0);
ini_set('display_errors', 1);

include("includes/connect.php");

$cat = $_POST['cat'] ?? '';
$act = $_POST['act'] ?? '';
$id = $_POST['id'] ?? '';

if ($cat == "agents") {
    $agentcode = addslashes(htmlentities($_POST["agentcode"] ?? '', ENT_QUOTES));
    $senha = addslashes(htmlentities($_POST["senha"] ?? '', ENT_QUOTES));
    $saldo = addslashes(htmlentities($_POST["saldo"] ?? '', ENT_QUOTES));
    $agentToken = addslashes(htmlentities($_POST["agentToken"] ?? '', ENT_QUOTES));
    $secretKey = addslashes(htmlentities($_POST["secretKey"] ?? '', ENT_QUOTES));
    $probganho = addslashes(htmlentities($_POST["probganho"] ?? '', ENT_QUOTES));
    $probbonus = addslashes(htmlentities($_POST["probbonus"] ?? '', ENT_QUOTES));
    $probganhortp = addslashes(htmlentities($_POST["probganhortp"] ?? '', ENT_QUOTES));
    $probganhoinfluencer = addslashes(htmlentities($_POST["probganhoinfluencer"] ?? '', ENT_QUOTES));
    $probbonusinfluencer = addslashes(htmlentities($_POST["probbonusinfluencer"] ?? '', ENT_QUOTES));
    $probganhosaldo = addslashes(htmlentities($_POST["probganhosaldo"] ?? '', ENT_QUOTES));
    $callbackurl = addslashes(htmlentities($_POST["callbackurl"] ?? '', ENT_QUOTES));
    $probganhoaposta = addslashes(htmlentities($_POST["probganhoaposta"] ?? '', ENT_QUOTES));
    $limitadorchicky = addslashes(htmlentities($_POST["limitadorchicky"] ?? '', ENT_QUOTES));

    try {
        $result = false;

        if ($act == "add") {
            $result = mysqli_query($conn, "INSERT INTO agents (agentCode, senha, saldo, agentToken, secretKey, probganho, probbonus, probganhortp, probganhoinfluencer, probbonusinfluencer, probganhosaldo, probganhoaposta, callbackurl, limitadorchicky) VALUES ('$agentcode', '$senha', '$saldo', '$agentToken', '$secretKey', '$probganho', '$probbonus', '$probganhortp', '$probganhoinfluencer', '$probbonusinfluencer', '$probganhosaldo', '$probganhoaposta', '$callbackurl', '$limitadorchicky')");
        } elseif ($act == "edit") {
            $result = mysqli_query($conn, "UPDATE agents SET agentCode = '$agentcode', senha = '$senha', saldo = '$saldo', agentToken = '$agentToken', secretKey = '$secretKey', probganho = '$probganho', probbonus = '$probbonus', probganhortp = '$probganhortp', probganhoinfluencer = '$probganhoinfluencer', probbonusinfluencer = '$probbonusinfluencer', probganhosaldo = '$probganhosaldo', probganhoaposta = '$probganhoaposta', callbackurl = '$callbackurl', limitadorchicky = '$limitadorchicky' WHERE id = '$id'");
        } elseif ($act == "delete") {
            $result = mysqli_query($conn, "DELETE FROM agents WHERE id = '$id'");
        }

        if (!$result) {
            http_response_code(400);
            echo json_encode(['message' => 'Ops, erro ao atualizar dados: ' . mysqli_error($conn)]);
            return;
        }

        http_response_code(200);
        echo json_encode(['message' => 'Dados atualizado com sucesso', 'redirect' => './agents.php']);
    } catch (Exception $ex) {
        http_response_code(400);
        echo json_encode(['message' => 'Ops, erro ao atualizar dados.']);
    }
}
