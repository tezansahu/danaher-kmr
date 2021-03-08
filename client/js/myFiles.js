function doCall(url, callback){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}

function doPatch(url, body, callback){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
          callback(xmlHttp.responseText);
        }    
    }
    xmlHttp.open("PATCH", url, true); // true for asynchronous 
    xmlHttp.send(body);
}

function getUserFolders() {
    window.localStorage.setItem("parent", null);

    user = JSON.parse(window.localStorage.getItem("user"));
    url = `http://localhost:8000/folders/?user_id=${user["id"]}`;
    doCall(url, (res) => {
        res = JSON.parse(res)
        console.log(res)

        folder_str = ""

        if (res.length == 0) {
            document.getElementById("my_folders").style.textAlign = "center";
            document.getElementById("my_folders").innerHTML = `
            <div class="column col-lg-12 mt-5" > 
            <div class="card empty-msg">
                <i class="fa fa-frown-o fa-5x"></i>
                <div class="container">
                    <h4><b>Oops!!</b></h4>
                    <h6>You do not have any folders yet. Get started by creating new folders.</h6>
                </div>
            </div>
          </div>
            `
        }
        else{
            for (let i = 0; i < res.length; i++){
                folder_str += `
                <div class="column col-lg-3 mt-3">
                    <div class="card" style="position: relative; cursor: pointer;">
                        <div class="dropdown fa fa-ellipsis-v" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" style="position: absolute; top: 8px; right: 8px;" onclick='setCurrFolder(${res[i]["id"]})'></div>
                        <div class="dropdown-menu dropdown-primary">
                            <a class="dropdown-item" href="#" data-toggle="modal" data-target="#rename"><i class="fa fa-pencil-square-o"></i>&nbsp;&nbsp;Rename</a>
                            <a class="dropdown-item" href="#" data-toggle="modal" data-target="#trash"><i class="fa fa-trash-o"></i>&nbsp;&nbsp;Add to Trash</a>
                        </div>
                        <i class="fa fa-folder-o fa-5x" style="cursor: pointer;" onclick="openFolder(${res[i]["id"]})"></i>
                        <div class="container" style="cursor: pointer;" onclick="openFolder(${res[i]["id"]})">
                            <h5><b>${res[i]["name"]}</b></h5>
                        </div>
                    </div>
                </div>
                `
            }
    
            document.getElementById("my_folders").innerHTML = folder_str
        }
    });   
}

getUserFolders()

function openFolder(id) {
    console.log(id)
    window.localStorage.setItem("parent", id);
    window.location.replace("./folderContents.html")
}

function setCurrFolder(id) {
    console.log(id)
    window.localStorage.setItem("curr_folder", id);
    doCall(`http://localhost:8000/folders/folder/${id}`, (res) => {
        res = JSON.parse(res);
        document.getElementById("folder_name_trash").innerHTML = res["name"];
    })
}

function rename(){
    document.getElementById("rename_spinner").style.display = "block";
    new_name = document.getElementById("new_folder_name").value;
    if (new_name != "") {
        id = window.localStorage.getItem("curr_folder");
        created_by = JSON.parse(window.localStorage.getItem("user"))["id"];
        body = JSON.stringify({
            "id": id,
            "created_by": created_by,
            "new_name": new_name
        })

        console.log(body)

        doPatch("http://localhost:8000/folders/rename", body, (res, err) => {
            if (err) {
                console.err(err);
            }
            else {
                window.location.reload();
            }
        })
    }
}

function addToTrash() {
    document.getElementById("add_to_trash_spinner").style.display = "block";
    body = JSON.stringify({
        "id": window.localStorage.getItem("curr_folder"),
        "created_by": JSON.parse(window.localStorage.getItem("user"))["id"]
    })
    doPatch("http://localhost:8000/trash/add", body, (res, err) => {
        if (err) {
            console.err(err);
        }
        else {
            window.location.reload();
        }
    })
}