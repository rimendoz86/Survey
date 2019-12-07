function controllerClass (){
    this.Model = new modelClass();
    window.GlobalControllerRef = this;
    this.RegisterForms();
    this.SessionLogin();
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

        this.LoginSuccess(loginModel);
    });
}

controllerClass.prototype.SessionLogin = function (){
    Data.Get('Login').then((res)=>{
        let loginModel = res.Result;
        if(res.IsValid()){
            this.LoginSuccess(loginModel);
        }
    });
}

controllerClass.prototype.LoginSuccess = function(loginModel){
    Object.assign(this.Model.Authentication, loginModel);
    this.LoginForm.ModelToForm(); 
    GlobalViewRef.LoginForm.Show(false);  
    GlobalViewRef.LoggedIn.SetInnerHTML(`
    <span>Welcome, ${loginModel.Login}</span>
    <span class="btn btn-light" onclick="GlobalControllerRef.LogOut()">Log Out</span>`);
    this.ShowPage('surveyPage');
}

controllerClass.prototype.LogOut = function(){
    this.Model.Authentication.UserID = null;
    GlobalViewRef.LoggedIn.SetInnerHTML('');  
    GlobalViewRef.LoginForm.Show(true);  
    this.LoginForm.ModelToForm(this.Model.Authentication, 'loginForm');
    Data.Delete('Login','Logout');
}

controllerClass.prototype.SignUp = function () {
    let auth = this.Model.Authentication;
    if(!auth.Password.IsType(RegexType.Password)){
        alert('Password must contain 6-24 characters, upper and lower case with number and one of @#$%');
        return;
    }

    if(!auth.Login.IsType(RegexType.Username)){
        alert('You username is not long enough');
        return;
    }
    
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
        this.Model.UserSurveys = res.Result;
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
    this.GetQuestionBySurveyID(survey.ID)
}

controllerClass.prototype.ClearEditSurvey = function(){
    Object.assign(this.Model.EditSurvey, new Survey());
    this.SurveyForm.ModelToForm();
}

controllerClass.prototype.GetQuestionBySurveyID = function(){
    let surveyID = this.Model.EditSurvey.ID;
    Data.Get('SurveyQuestion',`SurveyID=${surveyID}`).then(res =>{
        this.Model.SurveyQuestions = res.Result
        GlobalViewRef.DisplayQuestionForms(res.Result);
    });
}

controllerClass.prototype.AddQuestion = function(){
    let formIsDirty = this.Model.View.QuestionForms.some(x => x.IsDirty);
    if(formIsDirty){
        alert("You have unsaved answers");
        return;
    }

    let questions = this.Model.SurveyQuestions;
    let newQuestions = new Question();
    let questionOrders = questions.map(x => x.QuestionOrder);

    newQuestions.QuestionOrder = questionOrders.length == 0 ? 1 : Math.max(...questionOrders) + 1;
    newQuestions.SurveyID = this.Model.EditSurvey.ID;

    Data.Post('SurveyQuestion', newQuestions).then((res) => {
        this.GetQuestionBySurveyID(newQuestions.SurveyID)
    });
}

controllerClass.prototype.DeleteQuestion = function(id){
    let editSurvey = this.Model.EditSurvey;
    Data.Delete('SurveyQuestion',id).then((res)=>{
        this.GetQuestionBySurveyID(editSurvey.ID)
    });
}

controllerClass.prototype.UpdateQuestion = function(question){
    Data.Put('SurveyQuestion', question).then((res)=>{});
}

controllerClass.prototype.StartSurvey = function(surveyIndex){
    let selectedSurvey = this.Model.UserSurveys[surveyIndex];
    this.Model.SelectedSurvey = selectedSurvey;
    let userID = selectedSurvey.UserID ? selectedSurvey.UserID : ''
    let surveyID = selectedSurvey.SurveyID ? selectedSurvey.SurveyID : ''
    let surveyUserID = selectedSurvey.SurveyUserID ? selectedSurvey.SurveyUserID : ''

    Data.Get('SurveyUserAnswer',`UserID=${userID}&SurveyID=${surveyID}&SurveyUserID=${surveyUserID}`).then((res)=>{
        this.Model.SurveyAnswers = res.Result;
        GlobalViewRef.DisplayAnswerForm(this.Model.SurveyAnswers);
        GlobalViewRef.AnswerContainer.Show(true);
        this.GetUserSurveys();

    });
}

controllerClass.prototype.UpdateAnswer = function(answer){
    Data.Post('SurveyUserAnswer',answer).then((res)=>{});
}

controllerClass.prototype.CompleteSurvey = function(){
    let selectedSurvey = this.Model.SelectedSurvey;

    let isComplete = this.Model.SurveyAnswers.every( x=> x.Answer);
    if(!isComplete){
        alert("Please answer all the questions");
        return;
    }

    let formIsDirty = this.Model.View.AnswerForms.some(x => x.IsDirty);
    if(formIsDirty){
        alert("You have unsaved answers");
        return;
    }

    Data.Put('SurveyUserAnswer',selectedSurvey).then((res)=>{
        GlobalViewRef.AnswerContainer.Show(false);
        this.GetUserSurveys();
    });
}