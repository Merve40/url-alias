var tableBody = document.querySelector("tbody");
var aliasInput = document.querySelector("#input-alias");
var urlInput = document.querySelector("#input-url");
var addBtn = document.querySelector("#btn-add");
var error = document.querySelector("#error");

addBtn.onclick = add;
urlInput.value = "https://";

load();

function add(e) {
    var alias = aliasInput.value.trim();
    var url = urlInput.value.trim();

    if (/[^a-zA-Z0-9]/.test(alias)) {
        error.classList.remove("hide");
        console.log("error in alias: special characters not allowed!");
        return;
    }

    if (alias && url) {
        if (url.startsWith("https://") || url.startsWith("http://")) {
            util.db
                .get(alias)
                .then((result) => {})
                .catch((err) => {
                    create(alias, url);
                    aliasInput.value = "";
                    urlInput.value = "https://";
                    error.classList.add("hide");
                });
        }
    }
}

function edit(e) {
    var id = this.id.split("-")[0];
    util.html.toggleRowVisibility(id);
}

function save(e) {
    var id = this.id.split("-")[0];
    var aliasInput = document.querySelector(`#${id}-td-input-alias`);
    var urlInput = document.querySelector(`#${id}-td-input-url`);

    var alias = document.querySelector(`#${id}-td-alias`);
    var url = document.querySelector(`#${id}-td-url`);

    function close(newAlias, newUrl) {
        alias.innerHTML = newAlias;
        url.innerHTML = `<a href="${newUrl}">${newUrl}</a>`;
        util.html.toggleRowVisibility(newAlias);
    }

    util.db.get(id).then(
        (result) => {
            if (
                id == aliasInput.children[0].value.trim() &&
                result[id] == urlInput.children[0].value.trim()
            ) {
                close(id, result[id]);
            } else if (id != aliasInput.children[0].value.trim()) {
                if (/[^a-zA-Z0-9]/.test(aliasInput.children[0].value)) {
                    console.log(
                        "error in alias: special characters not allowed!"
                    );
                    return;
                }

                util.db
                    .remove(id)
                    .then(() => {
                        util.db
                            .save(
                                aliasInput.children[0].value.trim(),
                                urlInput.children[0].value.trim()
                            )
                            .then(() => {
                                util.html.updateElementIds(
                                    id,
                                    aliasInput.children[0].value.trim()
                                );
                                close(
                                    aliasInput.children[0].value.trim(),
                                    urlInput.children[0].value.trim()
                                );
                            })
                            .catch((e) => {
                                close(id, result[id]);
                            });
                    })
                    .catch((e) => {
                        close(id, result[id]);
                    });
            } else {
                promise = util.db
                    .save(id, urlInput.children[0].value.trim())
                    .then(() => {
                        close(
                            aliasInput.children[0].value.trim(),
                            urlInput.children[0].value.trim()
                        );
                    })
                    .catch((e) => {
                        close(id, result[id]);
                    });
            }
        },
        (error) => {}
    );
}

function remove(e) {
    var id = this.id.split("-")[0];
    util.db.remove(id).then(() => {
        var node = document.querySelector(`#${id}`);
        tableBody.removeChild(node);
    });
}

function create(alias, url) {
    util.db.save(alias, url);

    var tr = document.createElement("tr");
    tr.id = alias;
    var html = `<th id="${alias}-td-alias" scope="row">${alias}</th>
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

function load() {
    var al = new URL(window.location.href).searchParams.get("new");

    if (al) {
        if (al !== "aliases") {
            aliasInput.value = al;
        }
    }

    util.db.getAll().then((result) => {
        for (var key in result) {
            create(key, result[key]);
        }
    });
}
