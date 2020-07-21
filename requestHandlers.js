// function for handling index.html business logic
function index (){
    console.log("Request handler for index was called.")
 }
 
 // function for handling portfolio.html business logic
 function portfolio(){
    console.log("Request for handler for portfolio was called.")
 }
 
 
 exports.index = index;
 exports.portfolio = portfolio;