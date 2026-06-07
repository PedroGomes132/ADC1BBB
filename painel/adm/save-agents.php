<?php
    include("includes/connect.php");
    error_reporting(0);
    ini_set('display_errors', 1);
    $cat = $_POST['cat'];
    $cat_get = $_GET['cat'];
    $act = $_POST['act'];
    $act_get = $_GET['act'];
    $id = $_POST['id'];
    $id_get = $_GET['id'];

    if ($cat == "agents" || $cat_get == "agents") {
        $id = addslashes(htmlentities($_POST["id"], ENT_QUOTES));
        $agentCode = addslashes(htmlentities($_POST["agentCode"], ENT_QUOTES));
        $senha = addslashes(htmlentities($_POST["senha"], ENT_QUOTES));
        $saldo = addslashes(htmlentities($_POST["saldo"], ENT_QUOTES));
        $agentToken = addslashes(htmlentities($_POST["agentToken"], ENT_QUOTES));
        $secretKey = addslashes(htmlentities($_POST["secretKey"], ENT_QUOTES));
        $probganho = addslashes(htmlentities($_POST["probganho"], ENT_QUOTES));
        $probbonus = addslashes(htmlentities($_POST["probbonus"], ENT_QUOTES));
        $probganhortp = addslashes(htmlentities($_POST["probganhortp"], ENT_QUOTES));
        $probganhoinfluencer = addslashes(htmlentities($_POST["probganhoinfluencer"], ENT_QUOTES));
        $probbonusinfluencer = addslashes(htmlentities($_POST["probbonusinfluencer"], ENT_QUOTES));
        $probganhoaposta = addslashes(htmlentities($_POST["probganhoaposta"] ?? 30, ENT_QUOTES));
        $probganhosaldo = addslashes(htmlentities($_POST["probganhosaldo"], ENT_QUOTES));
        $limitadorchicky = addslashes(htmlentities($_POST["limitadorchicky"] ?? 5, ENT_QUOTES));
        $callbackurl = addslashes(htmlentities($_POST["callbackurl"], ENT_QUOTES));

        if ($act == "add") {
            // Insert data into the users table with the unique id
            mysqli_query($conn, "INSERT INTO agents (
                id,
                agentCode,
                senha,
                saldo,
                agentToken,
                secretKey,
                probganho,
                probbonus,
                probganhortp,
                probganhoinfluencer,
                probbonusinfluencer,
                probganhoaposta,
                probganhosaldo,
                callbackurl,
                limitadorchicky
            ) VALUES (
                '$id',
                '$agentCode',
                '$senha',
                '$saldo',
                '$agentToken',
                '$secretKey',
                '$probganho',
                '$probbonus',
                '$probganhortp',
                '$probganhoinfluencer',
                '$probbonusinfluencer',
                '$probganhoaposta',
                '$probganhosaldo',
                '$callbackurl',
                '$limitadorchicky'
            )");
        } elseif ($act == "edit") {
            mysqli_query($conn, "UPDATE agents SET
                agentCode = '$agentCode',
                senha = '$senha',
                saldo = '$saldo',
                agentToken = '$agentToken',
                secretKey = '$secretKey',
                probganho = '$probganho',
                probbonus = '$probbonus',
                probganhortp = '$probganhortp',
                probganhoinfluencer = '$probganhoinfluencer',
                probbonusinfluencer = '$probbonusinfluencer',
                probganhoaposta = '$probganhoaposta',
                probganhosaldo = '$probganhosaldo',
                callbackurl = '$callbackurl',
                limitadorchicky = '$limitadorchicky'
                WHERE id = '$id'
            ");
        } elseif ($act_get == "delete") {
            mysqli_query($conn, "DELETE FROM agents WHERE id = '$id_get'");
        }
        header("location: agents.php");
    }
?>
