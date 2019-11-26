var EnumPage = {
    HomePage: 'homePage',
    Page2: 'page2'
};

function Nav(){
    this.Pages = this.PageConfig();
};

Nav.prototype.PageConfig = function() {
    let pages = [
        new Page('homePage',function(){
            console.log("Home Page Loaded")
        }),
        new Page('page2')
    ];
    return pages;
};

Nav.prototype.GoTo = function(EnumPage){
    this.Pages.forEach((x) => {
        let show  = x.ID == EnumPage
        x.DomRef.Show(show);
        if (show) x.OnNavigate();
    });
};