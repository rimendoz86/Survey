function modelClass (){
    this.View = new viewClass();
    this.Authentication = new Authentication();
    this.Surveys = [];
    this.EditSurvey = new Survey();
    this.SelectedSurvey = new Survey();
    this.SurveyQuestions = [];
    this.SurveyAnswers = [];
    window.ModelRef = this;
}