<?php 
namespace Data\Repository;
include 'Connection.php';
use Data;
class Login extends Data\Connection{
    function CheckLogin($authModel){
        //var_dump($authModel);
        return $this->dbSelect("
        Select UserID, Login, Password
        FROM User
        Where Login = '$authModel->Login' 
        && Password =  BINARY '$authModel->Password' 
        && IsActive = 1");
    }
}

?>