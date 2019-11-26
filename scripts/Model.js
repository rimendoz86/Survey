function modelClass (){
    this.View = new viewClass();
    this.Authentication = new Authentication();
    window.ModelRef = this;
}