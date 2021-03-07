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

        console.log(res)

        contents_str = ""

        if (res["contents"].length == 0) {
            document.getElementById("folders_contents").style.textAlign = "center";
            document.getElementById("folders_contents").innerHTML = `
            <div style="text-align: center;">
                <h5>This folder is empty.</h5>
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
                            <h4><b>${res["contents"][i]["name"]}</b></h4>
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
                        <i class="fa ${icon} fa-5x"></i>
                        <div class="container">
                            <h4><b>${res["contents"][i]["name"]}</b></h4>
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