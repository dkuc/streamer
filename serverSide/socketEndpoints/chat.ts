import ws = require('./websocket');
import _ = require('lodash');

const server = ws.getServer();
const storedNames = {'::1': 'Rack'};
const sockets = [];

//ToDo: Stop duplicate names, name length limits
server.on('connection', function(userSocket){
    userSocket.on('chat message', function(msg){
        server.emit("chat", {message:msg, sender:userSocket.chatName});
    });

    userSocket.on('disconnect', function(){
       console.log('removing: ' +userSocket.realConnection);
        _.remove(sockets, userSocket);
        emitUsers();
    });



    userSocket.on('setname', function(name){
        userSocket.chatName = name;

        storedNames[userSocket.realConnection] = name;

        userSocket.emit('name', name);
        emitUsers();

    });


    userSocket.chatName = userSocket.id.substr(2,5);
    var storedName = storedNames[userSocket.realConnection];
    if(storedName) {
        userSocket.chatName = storedName;
    }
    storedNames[userSocket.realConnection] = userSocket.chatName;
    sockets.push(userSocket);

    userSocket.emit('name', userSocket.chatName);


    emitUsers();


    function emitUsers() {
        server.emit('users', _.map(sockets, function (socket) {
            if(userSocket.realConnection.contains('192.168.'))
                return `${socket.chatName} (${socket.realConnection})`
            return socket.chatName;
        }));
    }
});


