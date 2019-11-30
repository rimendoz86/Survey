function controllerClass (){
    this.Model = new modelClass();
    window.GlobalControllerRef = this;
    this.LoginForm = new FormBinding(ModelRef.Authentication,'loginForm');
    // this.Pages = this.PageConfig();
    this.GetAllSurveys();
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
        GlobalViewRef.Welcome.SetInnerHTML(`
        <span>Welcome, ${loginModel.Login}</span>
        <span class="btn btn-light" onclick="GlobalControllerRef.LogOut()">Log Out</span>`);   
    });
}

controllerClass.prototype.LogOut = function(){
    this.Model.Authentication.UserID = null;
    GlobalViewRef.Welcome.SetInnerHTML('');  
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
    Data.Get('Survey').then(
        (res) => {
            console.log(res)

            GlobalViewRef.DisplaySurveys(res.Result);
        });
}
