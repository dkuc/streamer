import ws = require('./websocket');

const server = ws.getServer();

server.on('connection', function(socket){
    console.log('connection event');
    socket.on('watch request', function(msg){
        server.emit("alert", socket.handshake.address);
    });

    socket.on('chat message', function(msg){
        server.emit("chat", {message:msg, sender:socket.id.substr(2,5)});
    });
});


