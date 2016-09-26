import ws = require('./websocket');

const server = ws.getServer();

server.on('connection', function(socket){
    socket.on('chat message', function(msg){
        server.emit("chat", {message:msg, sender:socket.id.substr(2,5)});
    });

    socket.emit('name', socket.realConnection);
});
