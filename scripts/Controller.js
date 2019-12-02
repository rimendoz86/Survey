function controllerClass (){
    this.Model = new modelClass();
    window.GlobalControllerRef = this;
    this.RegisterForms();
}

controllerClass.prototype.ShowPage = function (pageID){
    GlobalViewRef.Pages.forEach((page) =>{
        page.Show(page.ID == pageID);
    });
};

controllerClass.prototype.RegisterForms = function(){
    this.LoginForm = new FormBinding(ModelRef.Authentication,'loginForm');

    this.SurveyForm = new FormBinding(ModelRef.EditSurvey,'addSurvey')
    this.SurveyForm.OnSubmit = (s) => { this.InsertSurvey()};

}

controllerClass.prototype.Login = function(){
    Data.Post("Login",this.Model.Authentication)
    .then((res) => {
        if(res.ValidationMessages.length > 0) {
            alert(res.ValidationMessages[0]);
            return;
        }
        if(res.Result.length == 0){
            alert("Username/Password Combination not found.");
            return;
        }
        let loginModel = res.Result[0];
        Object.assign(this.Model.Authentication, loginModel);

        this.LoginForm.ModelToForm(); 
        GlobalViewRef.LoginForm.Show(false);  
        GlobalViewRef.LoggedIn.SetInnerHTML(`
        <span>Welcome, ${loginModel.Login}</span>
        <span class="btn btn-light" onclick="GlobalControllerRef.LogOut()">Log Out</span>`);
        this.ShowPage('surveyPage');
    });
}

controllerClass.prototype.LogOut = function(){
    this.Model.Authentication.UserID = null;
    GlobalViewRef.LoggedIn.SetInnerHTML('');  
    GlobalViewRef.LoginForm.Show(true);  
    this.LoginForm.ModelToForm(this.Model.Authentication, 'loginForm'); 
}

controllerClass.prototype.SignUp = function () {
    Data.Post('User', this.Model.Authentication).then((res) =>{
      if(res.ValidationMessages.length > 0) {
        alert(res.ValidationMessages[0]);
        return;
      }

      alert("Success, Please Login to Continue");
    });
  }

controllerClass.prototype.GetAllSurveys = function(){
    Data.Get('Survey').then((res) => {
        this.Model.Surveys = res.Result;
        GlobalViewRef.DisplayAdminSurveys(res.Result);
    });
}

controllerClass.prototype.GetUserSurveys = function(){
    Data.Get('Survey','*').then((res) => {
        GlobalViewRef.DisplaySurveys(res.Result);
    });
}

controllerClass.prototype.InsertSurvey = function(){
    Data.Post('Survey',this.Model.EditSurvey).then((res)=>{
            this.GetAllSurveys();
        });
};

controllerClass.prototype.SetEditSurvey = function (surveyID){
    let survey = this.Model.Surveys.find( x => x.ID == surveyID);
    Object.assign(this.Model.EditSurvey, survey)
    this.SurveyForm.ModelToForm();
    //GlobalViewRef.UserEdit.Show(true);
}

controllerClass.prototype.ClearEditSurvey = function(){
    Object.assign(this.Model.EditSurvey, new Survey());
    this.SurveyForm.ModelToForm();
}