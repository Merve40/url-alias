'use strict';

try{
    var test = browser;
}catch(e){
    console.log("'browser' not defined!");
}

var callback = function(details){
    var url = details.url.split("///")[1];
   
    if(!url){
        return;
    }
   
    var getPromise = browser.storage.sync.get(url); 
    getPromise.then((redirect) =>{

        if(Object.keys(redirect).length === 0 && redirect.constructor === Object){
            browser.tabs.update(details.tabId, {url: "url-alias.html?new="+url});
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

function setIcon(tab, icPath){
    var icon = {
        path: icPath,
        tabId: tab.id
    };
    browser.pageAction.setIcon(icon);
}

browser.webNavigation.onCompleted.addListener((details)=>{
    browser.pageAction.show(details.tabId);

    browser.tabs.query({currentWindow:true, active:true}).then((tabs, error)=>{
        var url = tabs[0].url.trim();

        browser.storage.sync.get().then((entries)=>{
            for(var key in entries){
                var entry = entries[key];
                if(entry == url){
                    setIcon(tabs[0], "icons/ic_selected_48.png");
                }
            }
        });
    });

}, filter);

browser.tabs.query({currentWindow:true, active:true}).then((tabs, error)=>{
    for (var tab in tabs){
        browser.pageAction.show(tabs[tab].id);
    }
});

browser.runtime.onMessage.addListener((message, sender, response)=>{
    
    if(message.action == 'add'){
        setIcon(message.tab, "icons/ic_selected_48.png");
    }else if(message.action == 'remove'){
        setIcon(message.tab, "icons/ic_48.png");
    }
    
});

