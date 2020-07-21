let server = require('./server');
let router = require('./router');
let requestHandlers = require("./requestHandler");

let handle = {};
handle["/"] = requestHandlers.index;
handle["/index.html"] = requestHandlers.index;
handle["/portfolio.html"] = requestHandlers.portfolio;

server.start(router.route, handle);