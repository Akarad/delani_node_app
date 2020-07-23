let fs = require('fs');

class Logger {
   // Create a constructor for the Logger class and pass in the name of the module that each log will belong to
   constructor(module){

       this.module = module
      
       // Create a write stream so that we'll be able to write the log messages into the log file
       let logStream  = fs.createWriteStream('./logs', {flags: 'a'});
      
       // Create function that logs info level messages
       let info = function (msg){
           // Define the log level
           var level = 'info'.toUpperCase();
          
           // Format the message into the desired format
           let message = `${new Date()} | ${level} | ${module} | ${msg} \n`;
          
           // Write the formatted message logged into the log file
           logStream.write(message);
       }
       // Initialize the info function
       this.info =info;

       // Create a function that logs error level messages
       let error = function (msg){
           // Define the log level
           var level = 'error'.toUpperCase();
           // Format the message into the desired format
           let message = `${new Date()} | ${level} | ${module} | ${msg} \n`;
          
           // Write the formatted message logged into the log file
           logStream.write(message);
       }
       // initialize the error function
       this.error =error;
   }
}

module.exports = Logger;
Here, we create a Logger class. Inside the class, we pass module as a parameter for our constructor.  We are going to use this module parameter to get the name of the module where the log came from, this will make it easier for the person reading the logs to know where an event happened.

Next, we create a write stream so that we can be able to write our logs into a file. You will notice that inside the createStream() function we are passing two parameters. The first parameter is the path to the file in which we’ll be saving the logs and the second parameter is a flag. This flag (‘a’) allows us to append the logs into the file. If we were to exclude that flag, the logs written in the file would be deleted every time the server is restarted.

We then go-ahead to create the functions for the different log levels, in our case we only have two log levels; info and error. Inside each function, we define the respective level and create a format for our message. After that, we then write the message into the log file.

After all this is done, we export the Logger class to be used by the other modules.

Now, let's modify the other modules. We’ll start with the server module

Modify the server.js file to include the following;

let http = require('http');
let url = require('url');
let Logger = require('./logger');
let logger = new Logger('Server');

// A function to wrap our server functionality so that we can export it
let start = function(route, handle){

   function onRequest(request, response){
       // Extracting the pathname from the url requested
       let pathname = url.parse(request.url).pathname
      
       console.log("Request for " + pathname + " has been received.")
       logger.info("Request for " + pathname + " has been received with the request method " + request.method)
      
       // Inject the response object into the route function
       route(handle, pathname, response);

   }
  
   let PORT = process.env.PORT || 8000;

   http.createServer(onRequest).listen(PORT);
   logger.info(`Server has started on Port: ${PORT}`)
   console.log(`Server has started on Port: ${PORT}`);
}

exports.start = start;
We start with requiring the Logger class from the logger module. Then we create an instance of the class Logger where we pass in the name of the module we are in. we finish up by putting this instance in a variable called logger (with a lowercase l). So now we are ready to use the functions inside the Logger class.

Since the messages that we want to log in the server are just to let us know when we receive requests and which port our server is listening to, we are using the info level to log these messages.

Let’s move to the router module. Modify it the same way we did the server module

let path = require('path');
let fs = require('fs');
let Logger = require('./logger');
let logger = new Logger('Router');

function route(handle, pathname, response, request){
   logger.info("About to route a request for " + pathname);
   console.log("About to route a request for " + pathname);
   // Check if the request url is a function. since we mapped the our expected request urls to a function in request handlers
   if (typeof handle[pathname]==='function'){
        handle[pathname](response)
   }else if (pathname.match("\.css$")){
       let cssPath = path.join(__dirname, 'public', pathname);
       let cssStream = fs.createReadStream(cssPath);
       response.writeHead(200, {"Content-Type": "text/css"})
       cssStream.pipe(response)
   }else if (pathname.match('\.png$') || pathname.match('\.jpg$')){
       let imagePath = path.join(__dirname, 'public', pathname);
       let imageStream = fs.createReadStream(imagePath);
       response.writeHead(200, {"Content-Type": "text/png"});
       imageStream.pipe(response);
   }else if (pathname.match('\.js$')){
       let jsPath = path.join(__dirname, 'public', pathname);
       let jsStream = fs.createReadStream(jsPath)
       response.writeHead(200, {"Content-Type": "application/js"});
       jsStream.pipe(response);

   }else{
       logger.info("No request handler found for " + pathname);
       response.writeHead(404, {"Content-Type": "text/html"});
       response.write("<h1>404 Not found</h1>");
       response.end();
   }
}

exports.route = route;