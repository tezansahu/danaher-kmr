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
    window.localStorage.removeItem("parent");
    window.location.replace("../index.html");
}

function showNameInHeader() {
    user = JSON.parse(window.localStorage.getItem("user"));
    document.getElementById("navbarDropdown").innerHTML = user["name"]
}

showNameInHeader()