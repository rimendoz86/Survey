function viewClass() {
    window.GlobalViewRef = this;
    this.ProductsTable = new DomRef('surveyTable');
    this.LoginForm = new DomRef('loginForm');
    this.Welcome = new DomRef('welcome');
};

viewClass.prototype.DisplaySurveys = function (surveys) {
    let tableContent = `<thead><tr><th>Name</th><th>Description</th><th>CreatedOn</th><th></th></tr></thead>
                        <tbody>`;
    surveys.forEach(survey => {
        tableContent += `
        <tr>
            <td>${survey.Name}</td>
            <td>${survey.Description}</td>
            <td>${survey.CreatedOn}</td>
            <td><span class="btn btn-primary">Start</span></td>
        </tr>
        `
    });
    tableContent += "</tbody>"
    this.ProductsTable.SetInnerHTML(tableContent);
}
