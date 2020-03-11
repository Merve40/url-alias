var alias = document.querySelector("#inp-alias");
var url = document.querySelector("#inp-url");
var removeBtn = document.querySelector("#btn-remove");
var addBtn = document.querySelector("#btn-add");
var error = document.querySelector("#error");
var title = document.querySelector("h1");
var oldAlias = null;

addBtn.onclick = (e)=>{
    if(alias.value.trim().length > 0 & url.value.trim().length > 0){
        
        if(/[^a-zA-Z0-9]/.test(alias.value.trim())) {
            //TODO: show error message
            error.classList.remove('hide');
            return;
        }

        if(oldAlias != null && oldAlias != alias.value){
            util.db.remove(oldAlias);            
        }
        util.db.save(alias.value, url.value); 
        browser.runtime.sendMessage({action: 'add'});
        window.close();   
    }
};

removeBtn.onclick = (e)=>{
    util.db.remove(alias.value).then(()=>{
        alias.value = "";
        addBtn.classList.toggle("btn-add-scale");
        removeBtn.classList.toggle('hide');
        browser.runtime.sendMessage({action: 'remove'});
        window.close();           
    });   
}

window.onload = async function(){

    var tab = await util.getCurrentTab();
    url.value = tab.url;
    util.db.find(tab.url).then(result=>{
        // set input fields
        alias.value = result.key;
        oldAlias = alias.value;
        // set icon
        util.icon.setSelected();
        // make button visible 
        addBtn.classList.toggle("btn-add-scale");
        addBtn.innerHTML="CHANGE";
        title.innerHTML = "Edit Alias"
        removeBtn.classList.toggle('hide');
    }).catch(e=>{
        util.icon.set();
    });
};
