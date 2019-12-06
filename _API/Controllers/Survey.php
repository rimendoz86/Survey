<?php
namespace API;
include_once '../APIBase.php';
include_once '../Data/Repository.php';
use API;
use Data\Repository;
class Survey extends API\APIBase{
    function Get(){
        $repository = new Repository\Survey();
        $this->Response->Result = $repository->GetAllSurveys();
    }

    function GetWith($req) {
        $user = $this->Sess_Auth->get();
        if(!isset($user)){
            $this->AddValidationMessage("You must be logged in to do this.");
            $this->SendResponse(200);
        }

        $repository = new Repository\Survey();
        $this->Response->Result = $repository->GetUserSurveys($user->UserID);
    }

    function Post($req){
        $user = $this->Sess_Auth->get();
        if(!isset($user)){
            $this->AddValidationMessage("You must be logged in to do this.");
            $this->SendResponse(200);
        }

        $repository = new Repository\Survey();
        if(isset($req->ID)){
            $this->Response->Result = $repository->Update($req);
        }else{
            $this->Response->Result = $repository->Insert($req);
        }
    }
}
new Survey();
?>