icons = {
    "pdf": "fa-file-pdf-o",
    "png": "fa-file-image-o",
    "jpg": "fa-file-image-o",
    "jpeg": "fa-file-image-o",
    "mp3": "fa-file-audio-o",
    "mp4": "fa-file-video-o",
    "doc": "fa-file-word-o",
    "docx": "fa-file-word-o",
    "ppt": "fa-file-powerpoint-o",
    "pptx": "fa-file-powerpoint-o",
    "xls": "fa-file-excel-o",
    "xlsx": "fa-file-excel-o"
}

default_file_icon = "fa-file-o";
default_folder_icon = "fa-folder-o";


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


function getFoldersContents() {
    curr_folder_id = window.localStorage.getItem("parent");
    user = JSON.parse(window.localStorage.getItem("user"));
    url = `http://localhost:8000/folders/folder/${curr_folder_id}`;
    doCall(url, (res) => {
        res = JSON.parse(res)
        document.getElementById("folder_name_head").innerHTML = res["name"];

        displayUploadCreate(res["created_by"]);

        contents_str = ""

        if (res["contents"].length == 0) {
            document.getElementById("folders_contents").style.textAlign = "center";
            document.getElementById("folders_contents").innerHTML = `
            <div class="column col-lg-12 mt-5" > 
            <div class="card empty-msg">
                <i class="fa fa-frown-o fa-5x"></i>
                <div class="container">
                    <h4><b>Oops!!</b></h4>
                    <h6>This folder is empty. Upload new files or create new folders. </h6>
                </div>
            </div>
          </div>
            `
        }
        else{
            for (let i = 0; i < res["contents"].length; i++){

                delete_rename_str = "";
                if (res["contents"][i]["created_by"] == user["id"]) {
                    delete_rename_str = `
                    <div class="dropdown fa fa-ellipsis-v" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" style="position: absolute; top: 8px; right: 8px;" onclick='setCurrId(${res["contents"][i]["id"]}, ${res["contents"][i]["is_folder"]})'></div>
                    <div class="dropdown-menu dropdown-primary">
                        <a class="dropdown-item" href="#" data-toggle="modal" data-target="#rename"><i class="fa fa-pencil-square-o"></i>&nbsp;&nbsp;Rename</a>
                        <a class="dropdown-item" href="#" data-toggle="modal" data-target="#trash"><i class="fa fa-trash-o"></i>&nbsp;&nbsp;Add to Trash</a>
                    </div>
                    `
                }

                if(res["contents"][i]["is_folder"]){
                    contents_str += `
                    <div class="column col-lg-3 mt-4" style="cursor: pointer;">
                        <div class="card" style="position: relative;">
                        ${delete_rename_str}
                        <i class="fa ${default_folder_icon} fa-5x" onclick="openFolder(${res["contents"][i]["id"]})"></i>
                        <div class="container" onclick="openFolder(${res["contents"][i]["id"]})">
                            <h5><b>${res["contents"][i]["name"]}</b></h5>
                        </div>
                        </div>
                    </div>
                    `
                }
                else{
                    if (icons[res["contents"][i]["file_type"]] != null){
                        icon = icons[res["contents"][i]["file_type"]];
                    }
                    else {
                        icon = default_file_icon;
                    }
                    contents_str += `
                    <div class="column col-lg-3 mt-4" style="cursor: pointer;">
                        <div class="card" style="position: relative;">
                        ${delete_rename_str}
                        <i class="fa ${icon} fa-5x" data-toggle="modal" data-target="#fileDetails" onclick="getFileDetails(${res["contents"][i]["id"]})"></i>
                        <div class="container" data-toggle="modal" data-target="#fileDetails" onclick="getFileDetails(${res["contents"][i]["id"]})">
                            <h5><b>${res["contents"][i]["name"]}</b></h5>
                        </div>
                        </div>
                    </div>
                    `
                }
            }
    
            document.getElementById("folders_contents").innerHTML = contents_str;
        }
    });   
}

getFoldersContents()

function openFolder(id) {
    console.log(id)
    window.localStorage.setItem("parent", id);
    window.location.replace("./folderContents.html")
}

function displayUploadCreate(created_by) {
    user = JSON.parse(window.localStorage.getItem("user"));
    // console.log(created_by)
    if (created_by == user["id"] || created_by == null) {
        document.getElementById("upload_create").style.display = "block";
        if (created_by == null) {
            document.getElementById("upload_files").style.display = "none";
        }
    }
    else {
        document.getElementById("upload_create").style.display = "none";
    }
}

function setCurrId(id, is_folder) {
    console.log(id)
    window.localStorage.setItem("curr_id", id);
    window.localStorage.setItem("curr_id_is_folder", is_folder);

    if (is_folder){
        doCall(`http://localhost:8000/folders/folder/${id}`, (res) => {
            res = JSON.parse(res);
            document.getElementById("folder_name_trash").innerHTML = res["name"];
        })
    }
    else {
        doCall(`http://localhost:8000/files/file/${id}`, (res) => {
            res = JSON.parse(res);
            document.getElementById("folder_name_trash").innerHTML = res["name"];
        })
    }  
}


function getSize(size) {
    if (size < 1024) {
        return `${size} B`
    }
    else if (size < 1024*1024) {
        return `${(size/1024).toFixed(2)} KB`
    }
    else if (size < 1024*1024*1024) {
        return `${(size/1024/1024).toFixed(2)} MB`
    }
    else {
        return `${(size/1024/1024/1024).toFixed(2)} GB`
    }
}

function getFileDetails(id) {
    window.localStorage.setItem("curr_file", id);
    doCall(`http://localhost:8000/files/file/${id}`, (res) => {
        res = JSON.parse(res);

        if (icons[res["file_type"]] != null){
            icon = icons[res["file_type"]];
        }
        else {
            icon = default_file_icon;
        }
        document.getElementById("file_icon").innerHTML = ` <i class="fa ${icon} fa-5x"></i>`;
        document.getElementById("file_name").innerHTML = res["name"];
        document.getElementById("file_size").innerHTML = getSize(res["size"]);
        document.getElementById("file_created_on").innerHTML = res["created_on"];

        doCall(`http://localhost:8000/users/user/${res["created_by"]}`, (res) => {
            res = JSON.parse(res);
            document.getElementById("file_creator").innerHTML = res["name"];
        })
    })
}

function downloadFile() {
    file_id = window.localStorage.getItem("curr_file");
    doCall(`http://localhost:8000/files/download/${file_id}`, (download_res) => {
        download_res = JSON.parse(download_res)
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        url = `data:${download_res["mime"]};base64,${download_res["file"]}`;
        a.href = url;
        a.download = download_res["name"];
        a.click();
        window.URL.revokeObjectURL(url);
    })
}

function rename(){
    document.getElementById("rename_spinner").style.display = "block";
    new_name = document.getElementById("new_folder_name").value;
    if (new_name != "") {
        id = window.localStorage.getItem("curr_id");
        created_by = JSON.parse(window.localStorage.getItem("user"))["id"];
        body = JSON.stringify({
            "id": id,
            "created_by": created_by,
            "new_name": new_name
        })

        console.log(body)
        is_folder = window.localStorage.getItem("curr_id_is_folder")
        console.log(is_folder)
        if (is_folder == "true") {
            url = "http://localhost:8000/folders/rename"
        }
        else {
            url = "http://localhost:8000/files/rename"
        }
        doPatch(url, body, (res, err) => {
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
        "id": window.localStorage.getItem("curr_id"),
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