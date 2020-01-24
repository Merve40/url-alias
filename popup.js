var addBtn = document.querySelector("#btn-add");
addBtn.onclick = (e)=>{
    var props = {
        active: true,
        url: "shortcut.html"
    };
    browser.tabs.create(props);
};