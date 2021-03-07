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


function login(){
    let email = document.getElementById("email").value;
    let passwd = document.getElementById("pass").value;
    url =  "http://localhost:8000/users/login"

    ans = JSON.stringify({
        "email_id": email,
        "passwd_hashed": passwd
      })      
    console.log(ans)

    doPost(url, ans, (res, err) => {
      if (err) {
        console.err(err);
      }
      res = JSON.parse(res);
      console.log("user", res)
      window.localStorage.setItem("user", JSON.stringify(res))
      loadUser()
    });
}

function register() {
    let name = document.getElementById("username").value;
    console.log(name)
    let email = document.getElementById("emailid").value;
    let opco = document.getElementById("opco").value;
    let contact = document.getElementById("contact").value;
    let pswd = document.getElementById("pass").value;
    let data = {"email_id": email,
                "passwd_hashed": pswd,
                "name": name,
                "op_co": opco,
                "contact_no": contact
                };
    console.log(data);

    Url = "http://localhost:8000/users/register"
    doPost(Url, ans, (res, err) => {
      if (err) {
        console.err(err);
      }
      res = JSON.parse(res);
      console.log("user", res)
      window.localStorage.setItem("user", JSON.stringify(res))
      loadUser()
    });
}

function loadUser(){
  user = JSON.parse(window.localStorage.getItem('user'));
  console.log(user);
  console.log("abc")
  if(user != null){
    window.location.replace("./pages/home.html");
  }
}

loadUser()