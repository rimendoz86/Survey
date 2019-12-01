function modelClass (){
    this.View = new viewClass();
    this.Authentication = new Authentication();
    this.EditSurvey = new Survey();
    window.ModelRef = this;
}