var httpProxy = require('http-proxy');

var proxy =  httpProxy.createProxyServer({target:'http://localhost:8000'})

console.log("listening on port 9000")
proxy.listen(9000)