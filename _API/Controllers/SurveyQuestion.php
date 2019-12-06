<?php
namespace API;
include_once '../APIBase.php';
include_once '../Data/Repository.php';
use API;
use Data\Repository;
class SurveyQuestion extends API\APIBase{
    function GetWith($req) {
        $repository = new Repository\SurveyQuestion();
        $this->Response->Result = $repository->SelectBySurveyID($req);
    }

    function Post($req){
        $repository = new Repository\SurveyQuestion();
        $this->Response->Result = $repository->Insert($req);
    }

    function Delete($req){
        $repository = new Repository\SurveyQuestion();
        $this->Response->Result = $repository->Delete($req);
    }

    function Put($req){
        $repository = new Repository\SurveyQuestion();
        $this->Response->Result = $repository->Update($req);
    }
}
new SurveyQuestion();
?>