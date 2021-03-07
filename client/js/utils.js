function doCall(url, callback){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}

function logout(){
    console.log("Logout");
    window.localStorage.removeItem("user");
    location.reload();
}

function displayCreateUpload(){
    user = JSON.parse(window.localStorage.getItem('user'));

    if(user != null){
        parent = window.localStorage.getItem('parent');
        doCall(`http://localhost/folders/folder/${parent}`, (res) => {
            
        })
    }
}