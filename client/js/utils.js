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


function checkLoggedIn() {
    user = JSON.parse(window.localStorage.getItem("user"));
    if (! user) {
        window.location.replace("../index.html")
    }
}

function onPageLoad() {
    checkLoggedIn();
    showNameInHeader();
}

onPageLoad()

function searchFilesFolders() {
    keyword = document.getElementById("search_keyword").value;
    if (keyword != "") {
        username = document.getElementById("search_user_name").value;
        file_type = document.getElementById("search_file_type").value;

        doCall(`http://localhost:8000/search?keyword=${keyword}&username=${username}&file_type=${file_type}`, (res, err) => {
            if (err) {
                console.err(err);
            }
            else {
                res = JSON.parse(res);
                console.log(res)
                window.localStorage.setItem("search_results", JSON.stringify(res));
                window.location.replace("./searchResults.html");
            }
        })
    }
    else {
        alert("Please enter a file/folder name to search")
    }
}