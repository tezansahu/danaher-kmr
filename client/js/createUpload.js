function doPost(url, body, callback){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
          callback(xmlHttp.responseText);
        }    
    }
    xmlHttp.open("POST", url, true); // true for asynchronous 
    xmlHttp.send(body);
  }

function createFolder() {
    document.getElementById("create_folder_spinner").style.display = "block";
    user = JSON.parse(window.localStorage.getItem("user"));
    parent = window.localStorage.getItem("parent");

    folder_name = document.getElementById("folder_name").value
    if (folder_name != "") {
        if (parent == "null"){
            parent = 0;
        }

        body = JSON.stringify({
            "name": folder_name,
            "created_by": user["id"],
            "parent": parent
        })
        console.log(body)

        doPost("http://localhost:8000/folders/create", body, (res, err) => {
            if (err) {
                console.err(err);
            }
            else{
                res = JSON.parse(res);
                window.localStorage.setItem("parent", res["id"]);
                window.location.replace("./folderContents.html");
            }
        })
    }
    
}