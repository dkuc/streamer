import ws = require('./websocket');

const server = ws.getServer();

server.on('connection', function(socket){
    console.log('connection event');
    console.log(JSON.stringify(socket.handshake.address));
    console.log('---------------------');
    console.log(JSON.stringify(socket.request.connection.remoteAddress));
    socket.on('watch request', function(msg){
        server.emit("alert", socket.handshake.address);
    });

    socket.on('chat message', function(msg){
        server.emit("chat", {message:msg, sender:socket.id.substr(2,5)});
    });
});


