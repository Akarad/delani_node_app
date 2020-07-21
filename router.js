function route(handle, pathname){
    console.log("About to route a request for " + pathname);
    //check if the request url is a function. Since we mapped our expected request urls to a function in request handlers.
    if (typeof handle[pathname]=== 'function'){
        handle[pathname]()
    }else{
        console.log("No request handler found for " + pathname);
    }
 }
 
 exports.route = route;