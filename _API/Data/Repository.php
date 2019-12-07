<?php 
namespace Data\Repository;
include 'Connection.php';
use Data;
class Login extends Data\Connection{
    function CheckLogin($authModel){
        $sql = "
        Select UserID, Login, '' as Password, IsAdmin
        FROM entityUser
        Where Login = '$authModel->Login' 
        && Password =  BINARY '$authModel->Password' 
        && IsActive = 1";

        return $this->dbSelect($sql);
    }
}

class Survey extends Data\Connection{
    function GetAllSurveys(){
        $sql = "
        SELECT eS.ID, eS.Name, eS.Description, CreatedOn, IsActive  
        FROM entitysurvey as eS
        WHERE eS.IsActive = 1;";
        return $this->dbSelect($sql);
    }

    function GetUserSurveys($id){
        $sql = "
        SELECT eS.CreatedOn, eU.Login, eS.Name, eS.Description, eU.Login, eS.ID as SurveyID, eU.UserID as UserID, xSU.ID as SurveyUserID, xSU.IsComplete
        FROM entitysurvey as eS
        LEFT JOIN xrefsurveyuser as xSU ON (eS.ID = xSU.SurveyID)
        AND (xSU.UserID = $id)
        LEFT JOIN entityuser as eU ON (eU.UserID = xSU.UserID)
                               
        WHERE eS.IsActive = 1";

        
        return $this->dbSelect($sql);
    }

    function Insert($req){
        $sql = "INSERT INTO entitySurvey
        (
            Name, 
            Description,
            IsActive
        )
        VALUES
        (
            '$req->Name',
            '$req->Description',
            $req->IsActive
        )";
        return $this->dbInsert($sql);
    }

    function Update($req){
        $sql = "UPDATE entitySurvey SET
        Name = '$req->Name',
        Description = '$req->Description',
        IsActive = $req->IsActive
        WHERE ID = $req->ID;
        ";
        return $this->dbUpdate($sql);
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

class SurveyQuestion extends Data\Connection{
    function SelectBySurveyID($req){
        $sql = "
        SELECT eSQ.ID, eSQ.SurveyID, eSQ.QuestionOrder, eSQ.Question, eSQ.Options, eSQ.IsActive  
        FROM entitysurveyquestion as eSQ 
        WHERE eSQ.SurveyID = $req->SurveyID AND eSQ.IsActive 
        ORDER BY eSQ.QuestionOrder ASC, eSQ.ID;
        ";
        return $this->dbSelect($sql);
    }

    function Insert($req){
        $isActive = (int) $req->IsActive; 
        $sql = "INSERT INTO entitysurveyquestion
        (SurveyID, QuestionOrder, Question, Options, IsActive)  
        VALUES
        ($req->SurveyID, $req->QuestionOrder,'$req->Question','$req->Options', $isActive);
        ";
        return $this->dbInsert($sql);
    }

    function Update($req){
        $sql = "UPDATE entitysurveyquestion SET
        SurveyID = $req->SurveyID,
        QuestionOrder = $req->QuestionOrder,
        Question = '$req->Question',
        Options = '$req->Options', 
        IsActive = $req->IsActive
        WHERE ID = $req->ID;
        ";
        return $this->dbUpdate($sql);
    }

    function Delete($req){
        $sql = "UPDATE entitysurveyquestion SET
        IsActive = 0
        WHERE ID = $req;
        ";
        return $this->dbUpdate($sql);
    }

}

class SurveyUserAnswer extends Data\Connection{

    function SurveyUserUpdate($surveyID, $userID){
        $sqlSelect = "Select ID 
        FROM xrefSurveyUser 
        WHERE SurveyID = $surveyID AND UserID = $userID";

        $checkFirst = $this->dbSelect($sqlSelect);

        if(count($checkFirst) > 0){
            return $checkFirst[0]->ID;
        }

        $sqlInsert = "INSERT INTO xrefSurveyUser 
        (SurveyID, UserID)
        VALUES
        ($surveyID,$userID);";
        // $TMP = $this->dbInsert($sqlInsert);
        // echo $tmp;
        return $this->dbInsert($sqlInsert);
    }

    function SelectUserAnswers($surveyID, $surveyUserID){
        $sql = "SELECT eSQ.SurveyID as SurveyID, eSQ.ID as QuestionID, eSQ.Question, eSQ.Options, xSU.ID as SurveyUserID, xSUA.ID as SurveyUserAnswerID, xSUA.Answer
        FROM entitysurveyquestion as eSQ
        LEFT JOIN xrefsurveyuseranswer as xSUA ON (eSQ.ID = xSUA.QuestionID) AND xSUA.IsActive
        LEFT JOIN xrefsurveyuser as xSU ON (xSU.SurveyID = eSQ.SurveyID)
        WHERE eSQ.IsActive AND eSQ.SurveyID = $surveyID and xSU.ID = $surveyUserID
        ORDER BY eSQ.QuestionOrder ASC, eSQ.ID;";

        return $this->dbSelect($sql);
    }

    function Insert($req){
        $sql = "
        INSERT INTO xrefSurveyUserAnswer 
        (QuestionID, SurveyUserID, Answer)
        VALUES
        ($req->QuestionID,$req->SurveyUserID,'$req->Answer');";

        return $this->dbInsert($sql);
    }

    function Update($req){
        $sql = "
        UPDATE xrefSurveyUserAnswer SET
        Answer = '$req->Answer'
        WHERE ID = $req->SurveyUserAnswerID";
        $this->dbUpdate($sql);

        return $req->SurveyUserAnswerID;
    }

    function Finish($surveyUserID){
        $sql = "
        UPDATE xrefSurveyUser SET
        IsComplete = 1
        WHERE ID = $surveyUserID";
        $this->dbUpdate($sql);

        return $surveyUserID;
    }
}
?>