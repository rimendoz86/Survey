function viewClass() {
    window.GlobalViewRef = this;
    this.SurveyTable = new DomRef('surveyTable');
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
    this.SurveyTable.SetInnerHTML(tableContent);
}

viewClass.prototype.ShowPage = function (pageID){
    this.Pages.forEach((page) =>{
        page.Show(page.ID == pageID);
        });
};
