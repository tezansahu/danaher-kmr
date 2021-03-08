function doPost(url, body, callback){
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() { 
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
        callback(xmlHttp.responseText);
      }
      if(xmlHttp.status == 400){
        callback(xmlHttp.status);
      }
      if(xmlHttp.status == 401){
        callback(xmlHttp.status);
      }
          
  }
  xmlHttp.open("POST", url, true); // true for asynchronous 
  xmlHttp.send(body);
}


function login(){
    document.getElementById("loginInvalid").style.display = 'none';
    let email = document.getElementById("email").value;
    let passwd = document.getElementById("pass").value;

    var hashObj = new jsSHA("SHA-256", "TEXT", {numRounds: 1});
    hashObj.update(passwd);
    var hash = hashObj.getHash("HEX");

    ans = JSON.stringify({
        "email_id": email,
        "passwd_hashed": hash
      })      
    console.log(ans)

    doPost("http://localhost:8000/users/login", ans, (res, err) => {
      if (err) {
        console.err(err);
      }
      else{
      console.log(res);
      
      if(res == 400){
        document.getElementById("loginInvalid").innerHTML = "Invalid User. Enter correct username.";
        document.getElementById("loginInvalid").style.display = 'block';
      }
      else if (res==401){
        document.getElementById("loginInvalid").innerHTML = "Invalid password. Please try again.";
        document.getElementById("loginInvalid").style.display = 'block';
      }
      else {
      res = JSON.parse(res);
      console.log("user", res)
      window.localStorage.setItem("user", JSON.stringify(res))
      loadUser()
      }
    }
    });
}

function register() {
    document.getElementById("registerInvalid").style.display = 'none';
    let name = document.getElementById("name").value;
    console.log(name)
    let email = document.getElementById("emailid").value;
    let opco = document.getElementById("opco").value;
    let contact = document.getElementById("contact").value;
    let pswd = document.getElementById("passwd").value;

    var hashObj = new jsSHA("SHA-256", "TEXT", {numRounds: 1});
    hashObj.update(pswd);
    var hash = hashObj.getHash("HEX");

    let data = JSON.stringify({
      "email_id": email,
      "passwd_hashed": hash,
      "name": name,
      "op_co": opco,
      "contact_no": contact
    });
    console.log(data);

    doPost("http://localhost:8000/users/register", data, (res, err) => {
      if (err) {
        console.err(err);
      }
      else{
        console.log(res);
        
        if(res == 400){
          document.getElementById("registerInvalid").innerHTML = "User with same Email ID already exists.";
          document.getElementById("registerInvalid").style.display = 'block';
        }
        else{
      res = JSON.parse(res);
      console.log("user", res)
      window.localStorage.setItem("user", JSON.stringify(res))
      user = JSON.parse(window.localStorage.getItem('user'));
      if(user != null){
        window.location.replace("./home.html");
      }
    }
  }
    });
}

function loadUser(){
  user = JSON.parse(window.localStorage.getItem('user'));
  if(user != null){
    window.location.replace("./pages/home.html");
  }
}

loadUser()