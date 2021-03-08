function doCall(url, callback){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}


function getRootFolders(){
    window.localStorage.setItem("parent", null);
    url = "http://localhost:8000/folders/";
    doCall(url, (res) => {
        res = JSON.parse(res)
        console.log(res)

        folder_str = ""

        for (let i = 0; i < res.length; i++){
            folder_str += `
            <div class="column col-lg-3 mt-3">
                <div class="card" style="cursor: pointer;" onclick="openFolder(${res[i]["id"]})">
                    <i class="fa fa-folder fa-5x"></i>
                    <div class="container">
                        <h5><b>${res[i]["name"]}</b></h5>
                    </div>
                </div>
            </div>
            `
        }

        document.getElementById("home_folders").innerHTML = folder_str
    })

    
}

getRootFolders()


function openFolder(id) {
    console.log(id)
    window.localStorage.setItem("parent", id);
    window.location.replace("./folderContents.html")
}