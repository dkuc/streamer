import ws = require('./websocket');
import _ = require('lodash');

const server = ws.getServer();
const storedNames = {'::1': 'Rack'};
const sockets = [];

//ToDo: Stop duplicate names, name length limits
server.on('connection', function(socket){
    socket.on('chat message', function(msg){
        server.emit("chat", {message:msg, sender:socket.chatName});
    });

    socket.on('disconnect', function(){
       console.log('removing: ' +socket.realConnection);
        _.remove(sockets, socket);
    });

    socket.on('setname', function(name){
        socket.chatName = name

        storedNames[socket.realConnection] = name

        socket.emit('name', name);

    });


    socket.chatName = socket.id.substr(2,5);
    var storedName = storedNames[socket.realConnection];
    if(storedName) {
        socket.chatName = storedName;
    }
    sockets.push(socket);

    socket.emit('name', socket.chatName);


});
