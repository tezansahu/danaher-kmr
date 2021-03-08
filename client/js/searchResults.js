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


function getFoldersContents() {
    // curr_folder_id = window.localStorage.getItem("parent");
    // url = `http://localhost:8000/folders/folder/${curr_folder_id}`;
    // doCall(url, (res) => {
        res = JSON.parse(window.localStorage.getItem("search_results"))

        contents_str = ""

        if (res.length == 0) {
            document.getElementById("search_results").style.textAlign = "center";
            document.getElementById("search_results").innerHTML = `
            <div class="mt-4" style="text-align: center">
                <h6>Sorry! The search yielded no results...</h6>
            </div>
            `
        }
        else{
            for (let i = 0; i < res.length; i++){

                if(res[i]["is_folder"]){
                    contents_str += `
                    <div class="column col-lg-3 mt-4" style="cursor: pointer;">
                        <div class="card" style="position: relative;">
                        <i class="fa ${default_folder_icon} fa-5x" onclick="openFolder(${res[i]["id"]})"></i>
                        <div class="container" onclick="openFolder(${res[i]["id"]})">
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
                    <div class="column col-lg-3 mt-4" style="cursor: pointer;">
                        <div class="card" style="position: relative;">
                        <i class="fa ${icon} fa-5x" data-toggle="modal" data-target="#fileDetails" onclick="getFileDetails(${res[i]["id"]})"></i>
                        <div class="container" data-toggle="modal" data-target="#fileDetails" onclick="getFileDetails(${res[i]["id"]})">
                            <h5><b>${res[i]["name"]}</b></h5>
                        </div>
                        </div>
                    </div>
                    `
                }
            }
    
            document.getElementById("search_results").innerHTML = contents_str;
        }
    // });   
}

getFoldersContents()