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
}
new Survey();
?>