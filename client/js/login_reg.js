function login(){
    // document.getElementById("login_err").style.display = "none";
    // document.getElementById("login_spin").style.display = "block";
    let email = document.getElementById("email").value;
    let passwd = document.getElementById("pass").value;
    console.log(email)
    url =  "http://localhost:8000/users/login"
    async function postData(url = '', data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

    ans = {
        "email_id": email,
        "passwd_hashed": passwd
      }      
    console.log(ans)
    res = postData(url, ans)
    console.log(res)

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
    async function postData(url = '', data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
           // include, *same-origin, omit
           credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }
    postData(Url, data)


}