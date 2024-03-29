function Survey() {
    this.ID = null;
    this.Name = null;
    this.Description = null;
    this.IsActive = 1;
    this.CreatedOn = null;
    this.UpdatedOn = null;
    this.SurveyUserID = null;
    this.IsComplete = null;
}

function Question(){
    this.ID  = null;
    this.SurveyID = null;
    this.QuestionOrder = null;
    this.Question  = null;
    this.Options  = null;
    this.CreatedOn = null;
    this.UpdatedOn = null;
    this.IsActive = 1;
}

function Answer(){
    this.Answer = null;
    this.Options = null;
    this.Question = null;
    this.QuestionID = null;
    this.SurveyID = null;
    this.SurveyUserAnswerID = null;
    this.SurveyUserID = null;
}

function Authentication() {
    this.UserID = null;
    this.Login = null;
    this.Password = null;
}

function DomRef(id){
    this.ID = id;
    this.nativeElementRef = document.getElementById(id);

    this.SetOnClick = function(methodByRef){
        this.nativeElementRef.addEventListener("click", methodByRef);
    }
    
    this.SetInnerHTML = function(innerHTML){
        this.nativeElementRef.innerHTML = innerHTML;
    }

    this.SetValue = function(value){
        this.nativeElementRef.value = value;
    }

    this.ReplaceClass = function(removeClass, addClass){
        this.nativeElementRef.classList.remove(removeClass);
        this.nativeElementRef.classList.add(addClass);
    }

    this.SetRotation = function(degree){
        this.nativeElementRef.style.transform = `rotate(${degree}deg)`;
    }

    this.SetLocation = function(left, top){
        this.nativeElementRef.style.top = `${top}px`;
        this.nativeElementRef.style.left = `${left}px`;
    }

    this.AppendChild = function(htmlNode){
        this.nativeElementRef.appendChild(htmlNode);
    }

    this.Reset = function(){
        this.nativeElementRef.reset();
    }

    this.OnShow = () => { return };
    this.OnHide = () => { return };

    this.Show = function (isShow) {
        if (isShow) {
            this.ReplaceClass("hide", 'show');
            this.OnShow();
        } else {
            this.ReplaceClass('show', "hide");
            this.OnHide();
        }
    }  

    this.Dirty = function (isDirty){
        if (isDirty) {
            this.ReplaceClass('clean', "dirty");
        } else {
            this.ReplaceClass("dirty", 'clean');
        }
    }
}

//Static Methods
var LocalStorage = {
    ShoppingCart: {
        get: () => {
            return JSON.parse(localStorage.getItem('ShoppingCart'));
        },
        set: (shoppingCart) => {
            localStorage.setItem('ShoppingCart',JSON.stringify(shoppingCart));
        },
        clear: () => {
            localStorage.removeItem('ShoppingCart');
        }
    }
}

var RegexType = {
    Username: `^[a-z0-9_-]{3,15}$`,
    Password: `((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%*]).{6,20})`,
    Hexadecimal: `^#([\iA-Fa-f0-9]{6}|[\iA-Fa-f0-9]{3})$`,
    Email: `^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$`,
    Image: `([^\\s]+(\\.(jpg|png|gif|bmp))$)`,
    IP: `^([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])$`,
    Time: `(1[012]|[1-9]):[0-5][0-9](\\\\s)?(am|pm)`,
    Time24: `([01]?[0-9]|2[0-3]):[0-5][0-9]`,
    DateFormat: `(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/((19|20)\\d\\d)`,
    HTML: `<("[^"]*"|'[^']*'|[^'">])*>`,
    HTMLink: `<a([^>]+)>(.+?)<\/a>`
};

String.prototype.IsType = function(regex, modifier = null){
let val = this.toString()
var re = !modifier ? new RegExp(regex) : new RegExp(regex, modifier);
return val.match(re) ? true: false;
}

var Data = {
    Get: (controller, params = '') => {
        return Data._ReqWithURI('GET',controller,params)
    },
    Post:(controller, params) => {
        return Data._ReqWithBody('POST',controller,params)
    },
    Put:(controller, params) => {
        return Data._ReqWithBody('PUT',controller,params)
    },
    Delete: (controller, id) => {
        return Data._ReqWithURI('DELETE',controller,`id=${id}`)
    },
    _ReqWithBody: (verb, controller, params) => {
        let promise = new Promise((resolve, reject) => {
            let BaseURL = "\\_API\\Controllers\\";
            let req = new XMLHttpRequest;
            req.open(verb,BaseURL+controller+".php",true);
            req.setRequestHeader("Content-Type", "application/json");
            req.onreadystatechange = (event) => {
                let res = event.currentTarget;
                if(res.readyState == 4 && res.status == 200){
                    try{
                        resolve(JSON.parse(res.responseText));
                    }catch(err){
                        console.log(res.responseText);
                        reject(err);
                    }
                }else if (res.readyState == 4 && res.status != 200){
                    reject(event);
                }
            }
            let paramsJson = JSON.stringify(params);
            req.send(paramsJson);
        })
        return promise;
    },
    _ReqWithURI: (verb, controller, params) => {
        let promise = new Promise((resolve, reject) => {
            let BaseURL = "\\_API\\Controllers\\";
            let req = new XMLHttpRequest;
            req.open(verb,BaseURL+controller+".php?"+params,true);
            req.setRequestHeader("Content-type", "application/json");
            req.onreadystatechange = (event) => {
                let res = event.currentTarget;
                if(res.readyState == 4 && res.status == 200){
                    try{
                        let response = JSON.parse(res.responseText);
                        let responseModel = new ResponseModel(response.Result, response.ValidationMessages)
                        resolve(responseModel);
                    }catch(err){
                        console.log(res.responseText);
                        console.log(err);
                        reject(err);
                    }
                }else if (res.readyState == 4 && res.status != 200){
                    reject(event);
                }
            }
            req.send();
        })
        return promise;
    }
}

function ResponseModel(result, validationMessages){
    this.Result = result;
    this.ValidationMessages = validationMessages;
    this.IsValid = function(){
        let isValid = false;
        if (!this.ValidationMessages || this.ValidationMessages.length == 0)
        isValid = true;
        return isValid;
    }
}

function FormBinding(objectRef,formID, onChange = (modelData) =>{ return; }, onSubmit = (modelData) =>{ console.log(modelData); return; }) {
    this.ObjectRef = objectRef;
    this.FormID = formID;
    this.FormRef = new DomRef(formID);
    this.OnChange = onChange;
    this.OnSubmit = onSubmit;
    this.IsDirty = false;

    this.BindFormToModel = function() {
    this.FormRef.nativeElementRef.addEventListener("keyup", (event) => {
        if(this.FormToModel(this.ObjectRef,this.FormID)) {
            this.OnChange(this.ObjectRef);
            this.IsDirty = true;
        }
            
    });

    this.FormRef.nativeElementRef.addEventListener("change", (event) => {
        if(this.FormToModel(this.ObjectRef,this.FormID)) {
            this.OnChange(this.ObjectRef);
            this.IsDirty = true;
        }
    });

    this.FormRef.nativeElementRef.addEventListener("submit", (event) => {
        event.preventDefault();
        if(this.FormToModel(this.ObjectRef,this.FormID))
            this.OnChange(this.ObjectRef);

        this.OnSubmit(this.ObjectRef);
        this.IsDirty = false;
    });
    }

    this.ModelToForm = function (objectRef = this.ObjectRef, formID = this.FormID) {
    let objKeys = Object.keys(objectRef);
    let formRef = document.getElementById(formID);
    let changeFound = false;
    objKeys.forEach((key) => {
        let formInput = formRef.elements[key];
        if (formInput && formInput.value !== objectRef[key]){
          formInput.value = objectRef[key] != undefined ? objectRef[key].toString() : '';
          changeFound = true;
        } 
        });
        return changeFound;
    };

    this.FormToModel = function (objectRef = this.ObjectRef, formID = this.FormID){
        let objKeys = Object.keys(objectRef);
        let formRef = document.getElementById(formID);
        let changeFound = false;
        objKeys.forEach((key) => {
            let formInput = formRef.elements[key];
            if (formInput && formInput.value != objectRef[key]){
                objectRef[key] = formInput.value ? formInput.value : '';
                changeFound = true;
            } 
            });
            return changeFound;
    };
    this.BindFormToModel();
}