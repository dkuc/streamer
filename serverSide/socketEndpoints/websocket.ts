import sockio = require('socket.io');
var server;

export function init(httpServer) {
    server = sockio(httpServer);
    server.on('connection', function(socket){

        const headers = socket.handshake.headers;
        socket.realConnection = headers["x-real-ip"];

        if(!headers["x-real-ip"]){
            socket.realConnection = socket.handshake.address;
        }
        console.log(socket.realConnection + ' connected');

    });
}

export function getServer() {
  return server;
}