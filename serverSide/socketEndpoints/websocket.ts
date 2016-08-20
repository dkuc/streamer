import sockio = require('socket.io');
var server;

export function init(httpServer) {
    server = sockio(httpServer);
    server.on('connection', function(socket){
        console.log(socket.id + ' connected');
    });
}

export function getServer() {
  return server;
}