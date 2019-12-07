<?php
namespace API;
include_once '../APIBase.php';
include_once '../Data/Repository.php';
use API;
use Data\Repository;
class SurveyUserAnswer extends API\APIBase{

    function GetWith($req){
        $user = $this->Sess_Auth->get();
        if(!isset($user)){
            $this->AddValidationMessage("You must be logged in to do this.");
            $this->SendResponse(200);
        }

        $repository = new Repository\SurveyUserAnswer();

        if(empty($req->SurveyUserID)){
            $surveyUserID = $repository->SurveyUserUpdate($req->SurveyID, $user->UserID);
        }else{
            $surveyUserID = $req->SurveyUserID;
        }

        $this->Response->Result = $repository->SelectUserAnswers($req->SurveyID, $surveyUserID);
    }

    function Post($req){
        $user = $this->Sess_Auth->get();
        if(!isset($user)){
            $this->AddValidationMessage("You must be logged in to do this.");
            $this->SendResponse(200);
        }
        $repository = new Repository\SurveyUserAnswer();

        if(empty($req->SurveyUserAnswerID)){
            $this->Response->Result = $repository->Insert($req);
        } else {
            $this->Response->Result = $repository->Update($req);
        }
    }

    function Put($req){
        $user = $this->Sess_Auth->get();
        if(!isset($user)){
            $this->AddValidationMessage("You must be logged in to do this.");
            $this->SendResponse(200);
        }
        $repository = new Repository\SurveyUserAnswer();

        $this->Response->Result = $repository->Finish($req->SurveyUserID);
    }

}
new SurveyUserAnswer();
?>