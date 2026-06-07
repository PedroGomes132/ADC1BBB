<?php
				include "includes/header.php";
				error_reporting(0);
ini_set('display_errors', 1);
				?>

<a class="btn btn-primary" href="edit-users.php?act=add"> <i class="glyphicon glyphicon-plus-sign"></i> Add New
    Users</a>

<h1>Users</h1>
<p>Total de users <?php echo counting("users", "id");?> users.</p>

<table id="sorted" class="table table-striped table-bordered">
    <thead>
        <tr>
            <th>Id</th>
            <th>Username</th>
            <th>TOKEN</th>
            <th>ATK</th>
            <th>SALDO</th>
            <th>VALOR APOSTADO</th>
            <th>VALOR DEBITADO</th>
            <th>VALOR GANHO</th>
            <th>RTP</th>
            <th>INFLUENCER</th>
            <th>AGENTID</th>


            <th class="not">Edit</th>
            <th class="not">Delete</th>
        </tr>
    </thead>

    <?php
		
				 		
								
					$users = getAll("users");
			
				if($users) foreach ($users as $userss):
					?>
    <tr>
        <td><?php echo $userss['id']?></td>
        <td><?php echo $userss['username']?></td>
        <td><?php echo $userss['token']?></td>
        <td><?php echo $userss['atk']?></td>
        <td><?php echo $userss['saldo']?></td>
        <td><?php echo $userss['valorapostado']?></td>
        <td><?php echo $userss['valordebitado']?></td>
        <td><?php echo $userss['valorganho']?></td>
        <td><?php echo $userss['rtp']?></td>
        <td><?php echo $userss['isinfluencer']?></td>
        <td><?php echo $userss['agentid']?></td>







        <td><a href="edit-users.php?act=edit&id=<?php echo $userss['id']?>"><i class="glyphicon glyphicon-edit"></i></a>
        </td>
        <td><a href="save.php?act=delete&id=<?php echo $userss['id']?>&cat=users"
                onclick="return navConfirm(this.href);"><i class="glyphicon glyphicon-trash"></i></a></td>
    </tr>
    <?php endforeach; ?>
</table>
<?php include "includes/footer.php";?>