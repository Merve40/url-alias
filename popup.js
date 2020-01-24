var alias = document.querySelector("#inp-alias");
var url = document.querySelector("#inp-url");
var addBtn = document.querySelector("#btn-add");

var oldAlias = null;

addBtn.onclick = (e)=>{
    if(alias.value.trim().length > 0 & url.value.trim().length > 0){
        var obj = {};
        obj[alias.value] = url.value;
        
        if(oldAlias != null && oldAlias != alias.value){
            browser.storage.sync.remove(oldAlias);            
        }
        
        browser.storage.sync.set(obj);
         
        browser.tabs.query({currentWindow:true, active:true} ,(tabs, error)=>{
            browser.runtime.sendMessage({tab: tabs[0]});
        });  

        window.close();   
    }
};

window.onload = ()=>{
    browser.tabs.query({currentWindow:true, active:true} ,(tabs, error)=>{
        url.value = tabs[0].url;

        browser.storage.sync.get().then((entries)=>{
            for(var key in entries){
                var entry = entries[key];
                if(entry == url.value.trim()){
                    alias.value = key;
                    oldAlias = alias.value;
                }
            }
        });
    });
};