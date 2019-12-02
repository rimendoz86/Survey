function modelClass (){
    this.View = new viewClass();
    this.Authentication = new Authentication();
    this.Surveys = [];
    this.EditSurvey = new Survey();
    window.ModelRef = this;
}