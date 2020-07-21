let http = require('http');

let start = function (){

    function onRequest (request,response){
        console.log("Request received!")
        response.writeHead(200, {"Content-type": "text/plain"});
        response.write("Hello World");
        response.end();
    }
    
    http.createServer(onRequest).listen(8000);
    
    console.log("Server has started.")
}

exports.start = start;

