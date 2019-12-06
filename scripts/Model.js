function modelClass (){
    this.View = new viewClass();
    this.Authentication = new Authentication();
    this.Surveys = [];
    this.EditSurvey = new Survey();
    this.SurveyQuestions = [];
    window.ModelRef = this;
}