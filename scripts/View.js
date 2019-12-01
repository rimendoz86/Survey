function viewClass() {
    window.GlobalViewRef = this;
    this.UserSurveyTable = new DomRef('surveyTable');
    this.AdminSurveyTable = new DomRef('adminSurveys');
    this.LoginForm = new DomRef('loginForm');
    this.LoggedIn = new DomRef('loggedIn');
    this.Pages = this.PageConfig();
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

viewClass.prototype.DisplayAdminSurveys = function (surveys) {
    let tableContent = `<thead><tr><th></th><th>ID</th><th>Name</th><th>Description</th><th>CreatedOn</th><th>IsActive</th></tr></thead>
                        <tbody>`;
    surveys.forEach(survey => {
        tableContent += `
        <tr>
            <td><span class="btn btn-light">Edit</span></td>
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