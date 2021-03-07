function doPost(url, body, callback){
  var xmlHttp = new XMLHttpRequest();
  console.log("a")
  xmlHttp.onreadystatechange = function() { 
    console.log("b")
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
        console.log("e")
        callback(xmlHttp.responseText);
      }
          
  }
  console.log("c")
  xmlHttp.open("POST", url, true); // true for asynchronous 
  // xmlHttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  // xmlHttp.setRequestHeader('Access-Control-Allow-Headers', '*');
  // xmlHttp.setRequestHeader('Access-Control-Allow-Origin', '*');
  // xmlHttp.setRequestHeader('Access-Control-Allow-Methods', 'POST');
  console.log("d")
  xmlHttp.send(body);
}


async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    // mode: 'cors', // no-cors, *cors, same-origin
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    // // credentials: 'same-origin', // include, *same-origin, omit
    // headers: {
    //   'Content-Type': 'application/json'
    //   // 'Content-Type': 'application/x-www-form-urlencoded',
    // },
    // redirect: 'follow', // manual, *follow, error
    // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

async function login(){
    // document.getElementById("login_err").style.display = "none";
    // document.getElementById("login_spin").style.display = "block";
    let email = document.getElementById("email").value;
    let passwd = document.getElementById("pass").value;
    url =  "http://localhost:8000/users/login"
    

    ans = JSON.stringify({
        "email_id": email,
        "passwd_hashed": passwd
      })      
    console.log(ans)
    // res = await postData(url, ans)

    // doPost(url, ans, (res, err) => {
    //   if (err) {
    //     console.err(err);
    //   }
    //   res = JSON.parse(res);
    //   console.log("user", res)
    //   window.localStorage.setItem("user", JSON.stringify(res))
    // });
    user = await postData(url, ans);
    if (user["id"] != null) {
      window.localStorage.setItem("user", JSON.stringify(user))
      // window.location.replace("./pages/home.html");
      console.log("Hi there")
    }

}

async function register() {
    // document.getElementById("reg_err").style.display = "none";
    // document.getElementById("reg_spin").style.display = "block";
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
    // let addr = document.getElementById("reg_eth_addr").value;
    Url = "http://localhost:8000/users/register"
    // async function postData(url = '', data = {}) {
    //     // Default options are marked with *
    //     const response = await fetch(url, {
    //       method: 'POST', // *GET, POST, PUT, DELETE, etc.
    //       mode: 'cors', // no-cors, *cors, same-origin
    //       cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //        // include, *same-origin, omit
    //        credentials: 'same-origin',
    //       headers: {
    //         'Content-Type': 'application/json'
    //         // 'Content-Type': 'application/x-www-form-urlencoded',
    //       },
    //       redirect: 'follow', // manual, *follow, error
    //       referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //       body: JSON.stringify(data) // body data type must match "Content-Type" header
    //     });
    //     return response.json(); // parses JSON response into native JavaScript objects
    // }
    user = await postData(Url, data);
    if (user["id"] != null) {
      window.localStorage.setItem("user", JSON.stringify(user))
      window.location.replace("./pages/home.html");
    }
}

function loadUser(){
  user = JSON.parse(window.localStorage.getItem('user'));
  console.log(user);
  console.log("abc")
  if(user != null){
    window.location.replace("./pages/home.html");
  }
}

// loadUser()