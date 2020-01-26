/**
 * Utility module for storage and UI.
 */
var util = (function(){
    
    var db = (function(){

        function handleResult(resolve, error, result){
            if(Object.keys(result).length === 0 && result.constructor === Object){
                error('key does not exist!');
            }else{
                resolve(result);
            }
        }

        function get(key){
            return new Promise((resolve, error)=>{
                browser.storage.sync.get(key).then((result)=>{
                    handleResult(resolve, error, result);
                });
            }); 
        }

        function getAll(){
            return new Promise((resolve, error)=>{
                browser.storage.sync.get().then((result)=>{
                    handleResult(resolve, error, result);
                });
            });
        }

        function save(key, value){
            var obj = {};
            obj[key] = value;
            return browser.storage.sync.set(obj);
        }

        function remove(key){
            return browser.storage.sync.remove(key);
        }

        function find(value){
            return new Promise((resolve, error)=>{
                browser.storage.sync.get().then((result)=>{
                    for(var key in result){
                        if(result[key] == value){
                            resolve({key: key, value: value});
                            return;
                        }
                    }
                    error('could not find matching value.');
                });
            });
        }

        return{
            get,
            getAll,
            find,
            save,
            remove
        }
    }());

    function getCurrentTab(){
        return new Promise((resolve, error)=>{
            browser.tabs.query({currentWindow:true, active:true}).then(tabs=>{
                resolve(tabs[0]);
            }).catch(e=>{
                throw "could not get current active tab.";
            });
        });
    }

    var icon = (function(){
        var icon = "icons/ic_48.png";
        var iconSelected = "icons/ic_selected_48.png";
        
        async function _set(path){
            var tab = await getCurrentTab();
            var icon = {
                path: path,
                tabId: tab.id
            };
            browser.pageAction.setIcon(icon);
        }

        function set(){
            _set(icon);    
        }

        function setSelected(){
            _set(iconSelected);
        }

        return{
            set,
            setSelected
        }
    }());

    var html = (function(){
        function getElementsByXpath(xpath){
            var elements = [];
            var sel = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE,null);
            var el = sel.iterateNext();
            elements.push(el);
    
            while( (el = sel.iterateNext()) != null){
                elements.push(el);
            }
            return elements;
        }

        function toggleRowVisibility(id){
            var xpath = `//tr[@id='${id}']//*[starts-with(@id, '${id}')]`;
            var elements = getElementsByXpath(xpath);
    
            for(var el in elements){
                elements[el].classList.toggle('hide');
            }
        }

        function updateElementIds(oldId, newId){
            var xpath = `//*[starts-with(@id, '${oldId}')]`;
            var elements = getElementsByXpath(xpath);
            for(var e in elements){
                var id = elements[e].id.replace(oldId, newId);
                elements[e].id = id;
            }
        }

        return{
            toggleRowVisibility,
            updateElementIds
        }
    }());

    return{
        db,
        icon,
        html,
        getCurrentTab
    }
}())