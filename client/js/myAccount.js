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

function populateProfile() {
    user = JSON.parse(window.localStorage.getItem("user"));

    document.getElementById("name").value = user["name"];
    document.getElementById("email").value = user["email_id"];
    document.getElementById("opco").value = user["op_co"];
    document.getElementById("contact").value = user["contact_no"];
}

populateProfile()

function updateProfile() {
    user = JSON.parse(window.localStorage.getItem("user"));
    user["op_co"] = document.getElementById("opco").value;
    user["contact_no"] = document.getElementById("contact").value;

    doPatch("http://localhost:8000/users/update/info", JSON.stringify(user), (res) => {
        res = JSON.parse(res);
        window.localStorage.setItem("user", JSON.stringify(res));
        window.location.reload()
    })
}


function updatePassword() {
    old_passwd = document.getElementById("passwd_old").value;
    new_passwd = document.getElementById("passwd_new").value;

    console.log(old_passwd, new_passwd)
    if (old_passwd != "" && new_passwd != "") {
        
        var hashObj = new jsSHA("SHA-256", "TEXT", {numRounds: 1});
        hashObj.update(old_passwd);
        var old_passwd_hash = hashObj.getHash("HEX");

        var hashObj = new jsSHA("SHA-256", "TEXT", {numRounds: 1});
        hashObj.update(new_passwd);
        var new_passwd_hash = hashObj.getHash("HEX");


        body = JSON.stringify({
            "email_id": document.getElementById("email").value,
            "old_passwd_hashed": old_passwd_hash,
            "new_passwd_hashed": new_passwd_hash
        })

        doPatch("http://localhost:8000/users/update/passwd", body, (res, err) => {
            if (err) {
                console.err(err);
            }
            else{
                res = JSON.parse(res);
                window.localStorage.setItem("user", JSON.stringify(res));
                window.location.reload()
            }
        })
    }
    
}