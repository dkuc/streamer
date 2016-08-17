
var server;

exports.init = function (httpServer) {
    server = require('socket.io')(httpServer);
    server.on('connection', function(socket){
        console.log(socket.id + ' connected');
    });
};

exports.server = function () {
  return server;
};