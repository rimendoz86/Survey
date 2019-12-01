<?php 
namespace Data\Repository;
include 'Connection.php';
use Data;
class Login extends Data\Connection{
    function CheckLogin($authModel){
        //var_dump($authModel);
        return $this->dbSelect("
        Select UserID, Login, '' as Password, IsAdmin
        FROM entityUser
        Where Login = '$authModel->Login' 
        && Password =  BINARY '$authModel->Password' 
        && IsActive = 1");
    }
}

class Survey extends Data\Connection{
    function GetAllSurveys(){
        $sql = "
        SELECT eS.ID, eS.Name, eS.Description, CreatedOn, IsActive  
        FROM entitysurvey as eS;";
        return $this->dbSelect($sql);
    }

    function GetUserSurveys($id){
        $sql = "
        SELECT eU.Login, eS.Name, eS.Description
        FROM entitysurvey as eS
        INNER JOIN xrefsurveyuser as xSU ON (eS.ID = xSU.SurveyID)
        INNER JOIN entityuser as eU ON (eU.UserID = xSU.UserID)
        WHERE eS.IsActive = 1 && xSU.UserID = $id";
        return $this->dbSelect($sql);
    }

    function CreateSurvey($req){
        $sql = "INSERT INTO entitySurvey
        (
            Name, 
            Description
        )
        VALUES
        (
            '$req->Name',
            '$req->Description'
        )";
        return $this->dbSelect($req)
    }
}

    class User extends Data\Connection{
        function CheckForUser($req){
            $sql = "Select UserID
            FROM entityUser
            WHERE Login = '$req->Login'";
            return $this->dbSelect($sql);
        } 
        
        function Register($req){
            $sql = "INSERT INTO entityUser
            (Login, Password)
            Values
            ('$req->Login','$req->Password')";
            return $this->dbInsert($sql);
        }
        function GetAllUsers(){
            $sql = "
            SELECT UserID, Login, CreatedOn, IsAdmin, IsActive
            FROM entityUser";
            return $this->dbSelect($sql);
        }
        function DeleteUser($id){
            $sql = "UPDATE entityUser SET IsActive = 0 where UserID = $id";
            return $id;
        }
        function GetUser($id){
            $sql = "
            SELECT UserID, Login, UpdatedOn, IsAdmin, IsActive
            FROM entityUser
            WHERE UserID = $id";
            return $this->dbSelect($sql);
        }
        function UpdateUser($req){
            // die(json_encode($req));
            $sql = "
            UPDATE entityUser SET
            Login = '$req->Login',
            IsAdmin = $req->IsAdmin,
            IsActive = $req->IsActive
            WHERE UserID = $req->UserID";
            
            $this->dbUpdate($sql);
            return $this->GetUser($req->UserID);
        }
    }

?>