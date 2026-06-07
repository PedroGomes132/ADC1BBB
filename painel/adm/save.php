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

    if($cat == "users" || $cat_get == "users") {
        $username = addslashes(htmlentities($_POST["username"], ENT_QUOTES));
        $token = addslashes(htmlentities($_POST["token"], ENT_QUOTES));
        $atk = addslashes(htmlentities($_POST["atk"], ENT_QUOTES));
        $saldo = addslashes(htmlentities($_POST["saldo"], ENT_QUOTES));
        $valorapostado = addslashes(htmlentities($_POST["valorapostado"], ENT_QUOTES));
        $valordebitado = addslashes(htmlentities($_POST["valordebitado"], ENT_QUOTES));
        $valorganho = addslashes(htmlentities($_POST["valorganho"], ENT_QUOTES));
        $rtp = addslashes(htmlentities($_POST["rtp"], ENT_QUOTES));
        $isinfluencer = addslashes(htmlentities($_POST["isinfluencer"], ENT_QUOTES));
        $agentid = addslashes(htmlentities($_POST["agentid"], ENT_QUOTES));

        if($act == "add") {
            mysqli_query($conn, "INSERT INTO users (username, token, atk, saldo, valorapostado, valordebitado, valorganho, rtp, isinfluencer, agentid) VALUES ('$username', '$token', '$atk', '$saldo', '$valorapostado', '$valordebitado', '$valorganho', '$rtp', '$isinfluencer', '$agentid')");
        } elseif ($act == "edit") {
            mysqli_query($conn, "UPDATE users SET username = '$username', token = '$token', atk = '$atk', saldo = '$saldo', valorapostado = '$valorapostado', valordebitado = '$valordebitado', valorganho = '$valorganho', rtp = '$rtp', isinfluencer = '$isinfluencer', agentid = '$agentid' WHERE id = '$id'");
        } elseif ($act_get == "delete") {
            mysqli_query($conn, "DELETE FROM users WHERE id = '$id_get'");
        }
        header("location: users.php");
    }
?>
