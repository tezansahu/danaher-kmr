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


function getFoldersContents() {
    curr_folder_id = window.localStorage.getItem("parent");
    url = `http://localhost:8000/folders/folder/${curr_folder_id}`;
    doCall(url, (res) => {
        res = JSON.parse(res)
        document.getElementById("folder_name").innerHTML = res["name"];

        displayUploadCreate(res["created_by"]);

        contents_str = ""

        if (res["contents"].length == 0) {
            document.getElementById("folders_contents").style.textAlign = "center";
            document.getElementById("folders_contents").innerHTML = `
            <div style="text-align: center">
                <h6>This folder is empty.</h6>
            </div>
            `
        }
        else{
            for (let i = 0; i < res["contents"].length; i++){
                if(res["contents"][i]["is_folder"]){
                    contents_str += `
                    <div class="column col-lg-3" style="cursor: pointer;" onclick="openFolder(${res["contents"][i]["id"]})">
                        <div class="card">
                        <i class="fa ${default_folder_icon} fa-5x"></i>
                        <div class="container">
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
                    <div class="column col-lg-3" style="cursor: pointer;">
                        <div class="card">
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