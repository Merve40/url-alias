'use strict';
// if body has class 'neterror' then file does not exist -> user must have entered alias
var error = document.querySelector(".neterror");

if(error){
    var url = window.location.href.split("///")[1];

    var getPromise = browser.storage.sync.get(url);
    getPromise.then((redirect) =>{

        // navigate to url
        window.location.assign(redirect);
        
    }, (error)=>{
        // do nothing
    });
}