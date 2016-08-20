import ws = require('./websocket');

const server = ws.getServer();

server.on('connection', function(socket){
    socket.on('watch request', function(msg){
        server.emit("alert", socket.handshake.address);
    });
});
