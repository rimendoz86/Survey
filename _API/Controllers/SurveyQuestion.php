<?php
namespace API;
include_once '../APIBase.php';
include_once '../Data/Repository.php';
use API;
use Data\Repository;
class SurveyQuestion extends API\APIBase{
    function GetWith($req) {
        $user = $this->Sess_Auth->get();
        if(!isset($user)){
            $this->AddValidationMessage("You must be logged in to do this.");
            $this->SendResponse(200);
        }

        $repository = new Repository\SurveyQuestion();
        $this->Response->Result = $repository->SelectBySurveyID($req);
    }

    function Post($req){
        $user = $this->Sess_Auth->get();
        if(!isset($user)){
            $this->AddValidationMessage("You must be logged in to do this.");
            $this->SendResponse(200);
        }

        $repository = new Repository\SurveyQuestion();
        $this->Response->Result = $repository->Insert($req);
    }

    function Delete($req){
        $user = $this->Sess_Auth->get();
        if(!isset($user)){
            $this->AddValidationMessage("You must be logged in to do this.");
            $this->SendResponse(200);
        }

        $repository = new Repository\SurveyQuestion();
        $this->Response->Result = $repository->Delete($req);
    }

    function Put($req){
        $user = $this->Sess_Auth->get();
        if(!isset($user)){
            $this->AddValidationMessage("You must be logged in to do this.");
            $this->SendResponse(200);
        }
        
        $repository = new Repository\SurveyQuestion();
        $this->Response->Result = $repository->Update($req);
    }
}
new SurveyQuestion();
?>