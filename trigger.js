'use strict';

var callback = function(details){
    console.log(details);
    var url = details.url.split("///")[1];
   
    if(!url){
        return;
    }
   
    var getPromise = browser.storage.sync.get(url); 
    getPromise.then((redirect) =>{

        if(Object.keys(redirect).length === 0 && redirect.constructor === Object){
            browser.tabs.update(details.tabId, {url: "shortcut.html?new="+url});
        }else{
            browser.tabs.update(details.tabId, {url: redirect[url]});
        }
            
    }, (error)=>{
        // TODO: load config site for creating a new alias and prefill with the alias from url 
        browser.tabs.update(details.tabId, {url: redirect[url]+"?new="+url});
    }); 
}

var filter = {
    url : [{}]
};

browser.webNavigation.onErrorOccurred.addListener(callback, filter);
//browser.webNavigation.onCompleted.addListener(callback, filter);