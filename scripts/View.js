function viewClass() {
    window.GlobalViewRef = this;
    this.UserSurveyTable = new DomRef('surveyTable');
    this.AdminSurveyTable = new DomRef('adminSurveys');
    this.LoginForm = new DomRef('loginForm');
    this.LoggedIn = new DomRef('loggedIn');
    this.Pages = this.PageConfig();
    this.QuestionList = new DomRef('questionList');
    this.QuestionForms = [];
    this.AnswerList = new DomRef('answerSurvey');
    this.AnswerForms = []
    this.AnswerContainer = new DomRef('answerContainer');
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
    let tableContent = `<thead><tr><th>Description</th><th>CreatedOn</th><th>Started</th><th>Status</th></tr></thead>
                        <tbody>`;

    surveys.forEach((survey, i) => {
        let actionButton = `<span>Completed</span>`
        let started = survey.Login ? true : false;
        if (!survey.IsComplete){
            actionButton = `<span class="btn btn-primary" onclick="GlobalControllerRef.StartSurvey(${i})">${started ? "Continue" : "Start"}</span>`
        }

        tableContent += `
        <tr>
            <td>${survey.Name}</td>
            <td>${survey.Description}</td>
            <td>${started ? 'Yes' : "No"}</td>
            <td>${actionButton}</td>
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
                <input type="number" style="width: 10%;" name="QuestionOrder" id="questionOrder_${question.ID}" placeholder="Question Order" value="${question.QuestionOrder}">
                <input type="text" name="Question" id="questionQuestion_${question.ID}" placeholder="Question" value="${question.Question}">
                <input type="text" name="Options" id="questionOptions_${question.ID}" value="${question.Options}"
                    placeHolder="Options: Blank for Text CSV for Options">
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

viewClass.prototype.DisplayAnswerForm = function(answers){
    if (!answers || answers.length == 0) {
        this.AnswerList.SetInnerHTML("This survey is not yet ready");
        return;
    }
    this.AnswerList.SetInnerHTML("");

        answers.forEach((answer, index) => {
            let answerAnswer = answer.Answer ? answer.Answer : '';
            let answerBox = `<input type="text" name="Answer" id="answerAnswer_${answer.ID}" placeholder="Answer" value="${answerAnswer}">`

            if (answer.Options){
                let options = answer.Options.split(',');
                answerBox = `<select name="Answer" id="answerAnswer_${answer.ID}" placeholder="Answer" value="${answerAnswer}">`
                options.forEach((option)=>{
                    answerBox += `<option value="${option}">${option}</option>`
                });
                answerBox += `</select>`;
            }

            let questionForm = `                                
            <form id="answerForm_${answer.QuestionID}" class="horizontalForm">
                <input readonly type="text" class="notInput" name="Question" id="answerQuestion_${answer.ID}" placeholder="Question" value="${answer.Question}">
                ${answerBox}
                <input type="submit" class="btn btn-primary" value="Save">
            </form>`;


            let container = document.createElement("div");
            container.innerHTML = questionForm;
            this.AnswerList.AppendChild(container);
    
            let questionFormBind = new FormBinding(answer,`answerForm_${answer.QuestionID}`);

            questionFormBind.OnSubmit = (model) => {
                questionFormBind.FormRef.Dirty(false);
                GlobalControllerRef.UpdateAnswer(model);
            };
            questionFormBind.OnChange = () => { 
                questionFormBind.FormRef.Dirty(true);
            }
            this.AnswerForms.push(questionFormBind);
        });
}