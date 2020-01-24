'use strict';

var callback = function(details){
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
        browser.tabs.update(details.tabId, {url: redirect[url]+"?new="+url});
    }); 
}

var filter = {
    url : [{}]
};

browser.webNavigation.onErrorOccurred.addListener(callback, filter);

function setIcon(tab){
    var icon = {
        path: "icons/icon-32.png",
        tabId: tab.id
    };
    browser.pageAction.setIcon(icon);
}

browser.webNavigation.onCompleted.addListener((details)=>{
    browser.pageAction.show(details.tabId);

    browser.tabs.query({currentWindow:true, active:true} ,(tabs, error)=>{
        var url = tabs[0].url;

        browser.storage.sync.get().then((entries)=>{
            for(var key in entries){
                var entry = entries[key];
                if(entry == url.trim()){
                    //TODO: change icon (maybe just color of icon)
                    setIcon(tabs[0]);
                }
            }
        });
    });

}, filter);

browser.tabs.query({currentWindow:true, active:true} ,(tabs, error)=>{
    for (var tab in tabs){
        browser.pageAction.show(tabs[tab].id);
    }
});

browser.runtime.onMessage.addListener((message, sender, response)=>{
    setIcon(message.tab);
});

