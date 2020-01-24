var tableBody = document.querySelector("tbody");
var aliasInput = document.querySelector("#input-alias");
var urlInput = document.querySelector("#input-url");            
var addBtn = document.querySelector("#btn-add");

addBtn.onclick = add;

urlInput.value = "https://";

function add(e){
    console.log("adding..");
    var alias = aliasInput.value.trim();
    var url = urlInput.value.trim();

    if(alias && url){
        createNewEntry(alias, url);
    }
}

function edit(e){
    var id = this.id.split("-")[0];
    var aliasInput = document.querySelector(`#${id}-td-input-alias`);
    var urlInput = document.querySelector(`#${id}-td-input-url`);
    
    var alias = document.querySelector(`#${id}-td-alias`);
    var url = document.querySelector(`#${id}-td-url`);
    
    var saveButton = document.querySelector(`#${id}-save`);
    var editButton = document.querySelector(`#${id}-edit`);

    aliasInput.classList.remove("hide");
    urlInput.classList.remove("hide");
    
    alias.classList.add("hide");
    url.classList.add("hide");
    
    saveButton.classList.remove("hide");
    editButton.classList.add("hide");
}

function save(e){
    var id = this.id.split("-")[0];
    var aliasInput = document.querySelector(`#${id}-td-input-alias`);
    var urlInput = document.querySelector(`#${id}-td-input-url`);
    
    var alias = document.querySelector(`#${id}-td-alias`);
    var url = document.querySelector(`#${id}-td-url`);
    
    var saveButton = document.querySelector(`#${id}-save`);
    var editButton = document.querySelector(`#${id}-edit`);

    function close(newAlias, newUrl){
        alias.innerHTML = newAlias;
        url.innerHTML = `<a href="${newUrl}">${newUrl}</a>`;

        aliasInput.classList.add("hide");
        urlInput.classList.add("hide");
        
        alias.classList.remove("hide");
        url.classList.remove("hide");
        
        saveButton.classList.add("hide");
        editButton.classList.remove("hide");
    }

    browser.storage.sync.get(id).then((result)=>{
        console.log(aliasInput.children[0].value);
        console.log(urlInput.children[0].value);

        // if values remained unchanged -> exit
        if(id == aliasInput.children[0].value && result[id] == urlInput.children[0].value){
            return;
        }

        if( id != aliasInput.children[0].value){
            updateElementIds(id, aliasInput.children[0].value);

            browser.storage.sync.remove(id).then(()=>{
                var obj = {}
                obj[aliasInput.children[0].value] = urlInput.children[0].value;
                browser.storage.sync.set(obj).then(()=>{
                    close(aliasInput.children[0].value, urlInput.children[0].value);
                });
            });

        }else{
            var obj = {};
            obj[id] = urlInput.children[0].value;
            browser.storage.sync.set(obj).then(()=>{
                close(id, urlInput.children[0].value);
            });
        }

    }, (error)=>{
    });

    function getElements(oldAlias){
        var elements = [];

        var xpath = `//*[starts-with(@id, '${oldAlias}')]`;
        var sel = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE,null);
        var el = sel.iterateNext();
        elements.push(el);

        while( (el = sel.iterateNext()) != null){
            elements.push(el);
        }
        return elements;
    }

    function updateElementIds(oldAlias, newAlias){
        var elements = getElements(oldAlias);
        for(var e in elements){
            var id = elements[e].id;
            var newId = id.replace(oldAlias, newAlias);
            elements[e].id = newId;
        }
    }
}

function remove(e){
    var id = this.id.split("-")[0];
    browser.storage.sync.remove(id).then(()=>{
        tableBody.removeChild(`#${id}`);
    });
}

function createNewEntry(alias, url){

    if(url.startsWith("https://") || url.startsWith("http://")){
    
        console.log("creating new entry");
        browser.storage.sync.get(alias).then((result)=>{
            
            // if entry is empty -> create new
            if(Object.keys(result).length === 0 && result.constructor === Object){
                create(alias, url);
                aliasInput.value = "";
                urlInput.value = "https://";
            }else{
                console.log("entry already exists!");
            }

        }, (error)=>{
            create(alias, url);
            aliasInput.value = "";
            urlInput.value = "https://";
        });
    
    }else{
        showError();
    } 
}

function create(alias, url){
    var obj = {};
    obj[alias] = url;
    browser.storage.sync.set(obj);

    var tr = document.createElement("tr");
    tr.id = alias;
    var html =  `<th id="${alias}-td-alias" scope="row">${alias}</th>
                <td id="${alias}-td-input-alias" class="hide">
                    <input class="form-control edit" type="text" value="${alias}">
                </td>
                <td id="${alias}-td-input-url" class="hide">
                    <input class="form-control edit" type="text" value="${url}">
                </td>    
                <td id="${alias}-td-url">
                    <a href="${url}">${url}</a>
                </td>
                <td>
                    <button id="${alias}-save" type="button delete" class="hide btn btn-sm btn-secondary">save</button>
                    <button id="${alias}-edit" type="button edit" class="btn btn-sm btn-secondary">edit</button>
                    <button id="${alias}-delete" type="button delete" class="btn btn-sm btn-secondary">delete</button>                                
                </td>`;
    tr.innerHTML = html;
    tableBody.appendChild(tr);
    
    var saveBtn = document.querySelector(`#${alias}-save`);
    var editBtn = document.querySelector(`#${alias}-edit`);
    var deleteBtn = document.querySelector(`#${alias}-delete`);
    saveBtn.onclick = save;
    editBtn.onclick = edit;
    deleteBtn.onclick = remove;
}

function load(){
    var al = (new URL(window.location.href).searchParams.get("new"));
    if(al){
        aliasInput.value = al;
    }

    browser.storage.sync.get().then((result)=>{
        for(var key in result){
            create(key, result[key]);
        }
    });
}

function showError(){
    console.log("error");
}

load();