function doCall(url, callback){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
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
            <div style="text-align: center;">
                <h5>You do not have any folders yet.</h5>
            </div>
            `
        }
        else{
            for (let i = 0; i < res.length; i++){
                folder_str += `
                <div class="column col-lg-3">
                    <div class="card" style="position: relative; cursor: pointer;">
                        <div class="dropdown fa fa-ellipsis-v" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" style="position: absolute; top: 8px; right: 8px;"></div>
                        <div class="dropdown-menu dropdown-primary">
                            <a class="dropdown-item" href="#" data-toggle="modal" data-target="#rename"><i class="fa fa-pencil-square-o"></i>&nbsp;&nbsp;Rename</a>
                            <a class="dropdown-item" href="#"><i class="fa fa-trash-o"></i>&nbsp;&nbsp;Add to Trash</a>
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