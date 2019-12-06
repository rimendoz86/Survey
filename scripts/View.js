function viewClass() {
    window.GlobalViewRef = this;
    this.UserSurveyTable = new DomRef('surveyTable');
    this.AdminSurveyTable = new DomRef('adminSurveys');
    this.LoginForm = new DomRef('loginForm');
    this.LoggedIn = new DomRef('loggedIn');
    this.Pages = this.PageConfig();
    this.QuestionList = new DomRef('questionList');
    this.QuestionForms = [];
};

viewClass.prototype.PageConfig = function(){
    let pages = [];

    let welcomePage = new DomRef('welcomePage');
    pages.push(welcomePage);

    let surveyPage = new DomRef('surveyPage');
    surveyPage.OnShow = () => {
        GlobalControllerRef.GetUserSurveys();
    }
    pages.push(surveyPage);

    let createSurveyPage = new DomRef('createSurveyPage');
    createSurveyPage.OnShow = () => {
        GlobalControllerRef.GetAllSurveys();
    }
    pages.push(createSurveyPage);
    return pages;

};

viewClass.prototype.DisplaySurveys = function (surveys) {
    let tableContent = `<thead><tr><th>Name</th><th>Description</th><th>CreatedOn</th><th></th></tr></thead>
                        <tbody>`;
    surveys.forEach(survey => {
        tableContent += `
        <tr>
            <td>${survey.Login}</td>
            <td>${survey.Name}</td>
            <td>${survey.Description}</td>
            <td><span class="btn btn-primary">Start</span></td>
        </tr>
        `
    });
    tableContent += "</tbody>"
    this.UserSurveyTable.SetInnerHTML(tableContent);
}

viewClass.prototype.DisplayAdminSurveys = function (surveys) {
    let tableContent = `<thead><tr><th></th><th>ID</th><th>Name</th><th>Description</th><th>CreatedOn</th><th>IsActive</th></tr></thead>
                        <tbody>`;
    surveys.forEach(survey => {
        tableContent += `
        <tr>
            <td><span class="btn btn-light" onclick="GlobalControllerRef.SetEditSurvey(${survey.ID})">Edit</span></td>
            <td>${survey.ID}</td>
            <td>${survey.Name}</td>
            <td>${survey.Description}</td>
            <td>${survey.CreatedOn}</td>
            <td>${survey.IsActive}</td>
        </tr>
        `
    });
    tableContent += "</tbody>"
    this.AdminSurveyTable.SetInnerHTML(tableContent);
}

viewClass.prototype.DisplayQuestionForms = function (questions){
    if (!questions || questions.length == 0) {
        this.QuestionList.SetInnerHTML("There were no questions found, pleast add some.");
        return;
    }
    this.QuestionList.SetInnerHTML("");
        questions.forEach((question, index) => {
            let questionForm = `                                
            <form id="questionForm_${question.ID}" class="horizontalForm">
                <input type="number" name="QuestionOrder" id="questionOrder_${question.ID}" placeholder="Question Order" value="${question.QuestionOrder}">
                <input type="text" name="Question" id="questionQuestion_${question.ID}" placeholder="Question" value="${question.Question}">
                <input type="text" name="Options" id="questionOptions_${question.ID}" value="${question.Options}"
                    placeHolder="Options: Blank for text (Yes,No,Maybe) for options">
                <input type="button" class="btn btn-alert" value="Remove" onclick="GlobalControllerRef.DeleteQuestion(${question.ID})">
                <input type="submit" class="btn btn-primary" value="Save">
            </form>`;
            let container = document.createElement("div");
            container.innerHTML = questionForm;
            this.QuestionList.AppendChild(container);
    
            let questionFormBind = new FormBinding(question,`questionForm_${question.ID}`);
            questionFormBind.OnSubmit = (model) => {
                GlobalControllerRef.UpdateQuestion(model);
                questionFormBind.FormRef.Dirty(false);
            };
            questionFormBind.OnChange = () => { 
                questionFormBind.FormRef.Dirty(true);
            }
            this.QuestionForms.push(questionFormBind);
        });
}