<?php 
namespace Data\Repository;
include 'Connection.php';
use Data;
class Login extends Data\Connection{
    function CheckLogin($authModel){
        //var_dump($authModel);
        return $this->dbSelect("
        Select UserID, Login, '' as Password, IsAdmin
        FROM User
        Where Login = '$authModel->Login' 
        && Password =  BINARY '$authModel->Password' 
        && IsActive = 1");
    }
    class User extends Data\Connection{
        function CheckForUser($req){
            $sql = "Select UserID
            FROM user
            WHERE Login = '$req->Login'";
            return $this->dbSelect($sql);
        } 
        
        function Register($req){
            $sql = "INSERT INTO user
            (Login, Password)
            Values
            ('$req->Login','$req->Password')";
            return $this->dbInsert($sql);
        }
        function GetAllUsers(){
            $sql = "
            SELECT UserID, Login, CreatedOn, IsAdmin, IsActive
            FROM user";
            return $this->dbSelect($sql);
        }
        function DeleteUser($id){
            $sql = "UPDATE user SET IsActive = 0 where UserID = $id";
            return $id;
        }
        function GetUser($id){
            $sql = "
            SELECT UserID, Login, UpdatedOn, IsAdmin, IsActive
            FROM user
            WHERE UserID = $id";
            return $this->dbSelect($sql);
        }
        function UpdateUser($req){
            // die(json_encode($req));
            $sql = "
            UPDATE user SET
            Login = '$req->Login',
            IsAdmin = $req->IsAdmin,
            IsActive = $req->IsActive
            WHERE UserID = $req->UserID";
            
            $this->dbUpdate($sql);
            return $this->GetUser($req->UserID);
        }
    }
}

?>