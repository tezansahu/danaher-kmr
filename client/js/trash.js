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

function doDelete(url, body, callback){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
          callback(xmlHttp.responseText);
        }    
    }
    xmlHttp.open("DELETE", url, true); // true for asynchronous 
    xmlHttp.send(body);
}

function getUserTrashFolders() {
    window.localStorage.setItem("parent", null);

    user = JSON.parse(window.localStorage.getItem("user"));
    url = `http://localhost:8000/trash/?user_id=${user["id"]}`;
    doCall(url, (res) => {
        res = JSON.parse(res)
        console.log(res)

        contents_str = ""

        if (res.length == 0) {
            document.getElementById("trash_folders").style.textAlign = "center";
            document.getElementById("trash_folders").innerHTML = `
            <div class="column col-lg-12 mt-5" > 
            <div class="card empty-msg">
                <i class="fa fa-smile-o fa-5x"></i>
                <div class="container">
                    <h4><b>Great!!</b></h4>
                    <h6>The trash is empty. Move files or folders you don't need anymore to the <b>Trash</b></h6>
                </div>
            </div>
          </div>
            `
        }
        else{
            for (let i = 0; i < res.length; i++){
                if(res[i]["is_folder"]){
                    contents_str += `
                    <div class="column col-lg-3 mt-3" style="cursor: pointer;")">
                        <div class="card" style="position: relative;">
                        <div class="dropdown fa fa-ellipsis-v" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" style="position: absolute; top: 8px; right: 8px;" onclick='setCurrId(${res[i]["id"]})'></div>
                        <div class="dropdown-menu dropdown-primary">
                            <a class="dropdown-item" href="#" onclick="restore(${res[i]["id"]})"><i class="fa fa-undo"></i>&nbsp;&nbsp;Restore</a>
                            <a class="dropdown-item" href="#" data-toggle="modal" data-target="#delete"><i class="fa fa-trash-o"></i>&nbsp;&nbsp;Delete Permanently</a>
                        </div>
                        <i class="fa ${default_folder_icon} fa-5x"></i>
                        <div class="container">
                            <h5><b>${res[i]["name"]}</b></h5>
                        </div>
                        </div>
                    </div>
                    `
                }
                else{
                    if (icons[res[i]["file_type"]] != null){
                        icon = icons[res[i]["file_type"]];
                    }
                    else {
                        icon = default_file_icon;
                    }
                    contents_str += `
                    <div class="column col-lg-3 mt-3" style="cursor: pointer;">
                        <div class="card" style="position: relative;">
                        <div class="dropdown fa fa-ellipsis-v" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" style="position: absolute; top: 8px; right: 8px;" onclick='setCurrId(${res[i]["id"]})'></div>
                        <div class="dropdown-menu dropdown-primary">
                            <a class="dropdown-item" href="#" onclick="restore(${res[i]["id"]})"><i class="fa fa-undo"></i>&nbsp;&nbsp;Restore</a>
                            <a class="dropdown-item" href="#" data-toggle="modal" data-target="#delete"><i class="fa fa-trash-o"></i>&nbsp;&nbsp;Delete Permanently</a>
                        </div>
                        <i class="fa ${icon} fa-5x"></i>
                        <div class="container">
                            <h5><b>${res[i]["name"]}</b></h5>
                        </div>
                        </div>
                    </div>
                    `
                }
            }
    
            document.getElementById("trash_folders").innerHTML = contents_str;
            }
    });   
}

getUserTrashFolders()

function setCurrId(id) {
    console.log(id)
    window.localStorage.setItem("curr_id", id);
}

function restore(id) {
    body = JSON.stringify({
        "id": id,
        "created_by": JSON.parse(window.localStorage.getItem("user"))["id"]
    })

    doPatch("http://localhost:8000/trash/restore", body, (res, err) => {
        if (err) {
            console.err(err);
        }
        res = JSON.parse(res);
        window.location.reload();
    })
}

function permanentDelete() {
    body = JSON.stringify({
        "id": window.localStorage.getItem("curr_id"),
        "created_by": JSON.parse(window.localStorage.getItem("user"))["id"]
    })

    doDelete("http://localhost:8000/trash/delete", body, (res, err) => {
        if (err) {
            console.err(err);
        }
        res = JSON.parse(res);
        window.location.reload();
    })
}