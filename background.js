'use strict';

// event listeners for web-navigation
var filter = {
    url : [{}]
};

browser.webNavigation.onErrorOccurred.addListener((details)=>{
    var alias = details.url.split("///")[1];

    if(!alias){
        return;
    }

    util.db.get(alias).then(result=>{
        browser.tabs.update(details.tabId, {url: result[alias]});
    }).catch(e=>{
        //if alias does not exist -> redirect to URL-Alias website
        browser.tabs.update(details.tabId, {url: "url-alias.html?new="+alias});
    }); 
}, filter);

browser.webNavigation.onCompleted.addListener(async function(details){
    browser.pageAction.show(details.tabId);

    var tab = await util.getCurrentTab();
    util.db.find(tab.url).then(result=>{
        util.icon.setSelected();
    });

}, filter);

// event listener for add/remove operation
browser.runtime.onMessage.addListener((message, sender, response)=>{
    
    if(message.action == 'add'){
        util.icon.setSelected();
    }else if(message.action == 'remove'){
        util.icon.set();
    }
});

// shows icon for all pages
browser.tabs.query({}).then((tabs)=>{
    for (var tab in tabs){
        browser.pageAction.show(tabs[tab].id);
    }
});