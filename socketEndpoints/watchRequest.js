var server = require('../websocket').server();


server.on('connection', function(socket){
    socket.on('watch request', function(msg){
        server.emit("alert", socket.handshake.address);
    });
});
