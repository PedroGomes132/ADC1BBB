<?php
error_reporting(0);
ini_set('display_errors', 1);
				include "includes/header.php";
				$data=[];

				$act = $_GET['act'];
				if($act == "edit") {
					$id = $_GET['id'];
					$users = getById("users", $id);
				}
				?>

<form method="post" action="save.php" enctype='multipart/form-data'>
    <fieldset>
        <legend class="hidden-first">Add New Users</legend>
        <input name="cat" type="hidden" value="users">
        <input name="id" type="hidden" value="<?=$id?>">
        <input name="act" type="hidden" value="<?=$act?>">

        <label>Username</label>
        <input class="form-control" type="text" name="username" value="<?=$users['username']?>" /><br>

        <label>TOKEN</label>
        <input class="form-control" type="text" name="token" value="<?=$users['token']?>" /><br>

        <label>ATK</label>
        <input class="form-control" type="text" name="atk" value="<?=$users['atk']?>" /><br>

        <label>SALDO</label>
        <input class="form-control" type="text" name="saldo" value="<?=$users['saldo']?>" /><br>


        <label>VALOR APOSTADO</label>
        <input class="form-control" type="text" name="valorapostado" value="<?=$users['valorapostado']?>" /><br>

        <label>VALOR DEBITADO</label>
        <input class="form-control" type="text" name="valordebitado" value="<?=$users['valordebitado']?>" /><br>

        <label>Valor ganho</label>
        <input class="form-control" type="text" name="valorganho" value="<?=$users['valorganho']?>" /><br>

        <label>RTP</label>
        <input class="form-control" type="text" name="rtp" value="<?=$users['rtp']?>" /><br>

        <label>BLOGAYRO</label>
        <input class="form-control" type="text" name="isinfluencer" value="<?=$users['isinfluencer']?>" /><br>

        <label>AGENTE ID</label>
        <input class="form-control" type="text" name="agentid" value="<?=$users['agentid']?>" /><br>





        <br>
        <input type="submit" value=" Save " class="btn btn-success">
</form>
<?php include "includes/footer.php";?>