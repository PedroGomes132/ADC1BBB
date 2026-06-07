<?php
error_reporting(0);
ini_set('display_errors', 1);
				include "includes/header.php";
				?>

<a class="btn btn-primary" href="edit-agents.php?act=add"> <i class="glyphicon glyphicon-plus-sign"></i> Add New
    Agent</a>

<h1>AGENTS</h1>


<table id="sorted" class="table table-striped table-bordered">
    <thead>
        <tr>
            <th>Id</th>
            <th>AGENT CODE</th>
            <th>SENHA</th>
            <th>SALDO</th>
            <th>AGENT TOKEN</th>
            <th>SECRET KEY</th>
            <th>PROB GANHO</th>
            <th>PROB GANHO BONUS</th>
            <th>PROB GANHORTP</th>
            <th>PROB GANHO INFLENCER</th>
            <th>PROB BONUS INFLUENCER</th>
            <th>PROB GANHO APOSTA</th>
            <th>PROB GANHO SALDO</th>
            <th>CALLBACK URL</th>


            <th class="not">Edit</th>
            <th class="not">Delete</th>
        </tr>
    </thead>

    <?php
		
				 		
								
					$users = getAG("agents");
			
				if($users) foreach ($users as $userss):
					?>
    <tr>





        <td><?php echo $userss['id']?></td>
        <td><?php echo $userss['agentCode']?></td>
        <td><?php echo $userss['senha']?></td>
        <td><?php echo $userss['saldo']?></td>
        <td><?php echo $userss['agentToken']?></td>
        <td><?php echo $userss['secretKey']?></td>
        <td><?php echo $userss['probganho']?></td>
        <td><?php echo $userss['probbonus']?></td>
        <td><?php echo $userss['probganhortp']?></td>
        <td><?php echo $userss['probganhoinfluencer']?></td>
        <td><?php echo $userss['probbonusinfluencer']?></td>

        <td><?php echo $userss['probganhoaposta']?></td>
        <td><?php echo $userss['probganhosaldo']?></td>
        <td><?php echo $userss['callbackurl']?></td>





        <td><a href="edit-agents.php?act=edit&id=<?php echo $userss['id']?>"><i
                    class="glyphicon glyphicon-edit"></i></a></td>

    </tr>
    <?php endforeach; ?>
</table>
<?php include "includes/footer.php";?>