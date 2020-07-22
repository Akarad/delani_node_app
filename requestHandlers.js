let exec = require("child_process").exec;

// function for handling the business logic for index.html
function index (){
   console.log("Request handler for index was called.")
   // Function that will delay for 10 seconds before returning the text.
   var content = "empty";

   exec("ls -lah", function(error, stdout, stderr){
       content = stdout;
   })
  
   return content
}

// function for handling the business logic for  portfolio.html
function portfolio(){
   console.log("Request for handler for portfolio was called.")
   return "These are some of our portfolio projects"
}


exports.index = index;
exports.portfolio = portfolio;