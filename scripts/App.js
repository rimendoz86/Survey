function gameClass (){
    this.Controller = new controllerClass();
    this.Bindings = new bindingClass(this.Controller);
    console.log(this);
    this.tmp = new Nav();
};
var Game = new gameClass();