<?php
namespace API;
include_once '../APIBase.php';
include_once '../Data/Repository.php';
use API;
use Data\Repository;
class Login extends API\APIBase{
    function Get(){
        $user = $this->Sess_Auth->get();
        if(!isset($user)){
            $this->AddValidationMessage("You must be logged in to do this.");
            $this->SendResponse(200);
        }
        $this->Response->Result = $user;
    }

    function Post($authModel){

        if(empty($authModel->Login) || empty($authModel->Password)){
            array_push($this->Response->ValidationMessages,"Login AND Password are required");
            $this->SendResponse(200);
        }

        $repository = new Repository\Login();
        $result = $repository->CheckLogin($authModel);

        if(empty($result)) 
            array_push($this->Response->ValidationMessages,"UserName/Password Not FoundDB");
            
        if(count($this->Response->ValidationMessages) > 0){
            $this->SendResponse(200);
        }

        $this->Sess_Auth->set($result[0]);
        $this->Response->Result = $result;
    }

    function Delete($req){
        $user = $this->Sess_Auth->clear();
    }

}
new Login();
?>