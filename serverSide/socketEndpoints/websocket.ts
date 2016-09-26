import sockio = require('socket.io');
var server;

export function init(httpServer) {
    server = sockio(httpServer);
    server.on('connection', function(socket){
        console.log(socket.id + ' connected');
        const headers = socket.handshake.headers;
        socket.realConnection = {ip:headers["x-real-ip"],port:headers["x-real-port"]}

    });
}

export function getServer() {
  return server;
}