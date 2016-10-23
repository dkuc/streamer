import ws = require('./websocket');
import _ = require('lodash');

const server = ws.getServer();
const storedNames = {'192.168.1.65': 'Dan'};
const sockets = [];

server.on('connection', function (userSocket) {
    userSocket.on('chat message', onChatMessage);
    userSocket.on('disconnect', onDisconnect);
    userSocket.on('setname', onSetName);


    userSocket.chatName = userSocket.id.substr(2, 5);
    var storedName = storedNames[userSocket.realConnection];
    if (storedName) {
        userSocket.chatName = storedName;
    }
    storedNames[userSocket.realConnection] = userSocket.chatName;
    sockets.push(userSocket);

    userSocket.emit('name', userSocket.chatName);


    emitUsers();


    function onChatMessage(msg) {
        server.emit("chat", {message: msg, sender: userSocket.chatName});
    }

    function onDisconnect() {
        console.log('removing: ' + userSocket.realConnection);
        _.remove(sockets, userSocket);
        emitUsers();
    }

    function onSetName(name) {
        if (name.length > 10)
            return;

        if (_.some(sockets, (socket) => socket.chatName === name))
            return;

        userSocket.chatName = name;

        storedNames[userSocket.realConnection] = name;

        userSocket.emit('name', name);
        emitUsers();
    }

});


function emitUsers() {

    const usersWithIps = _.map(sockets, function (socket) {
        return `${socket.chatName} (${socket.realConnection})`;
    });

    const users = _.map(sockets, 'chatName');

    for (var socket of sockets) {
        if (isLocal(socket))
            socket.emit('users', usersWithIps);
        else
            socket.emit('users', users);
    }

}

function isLocal(socket) {
    return socket.realConnection.includes('192.168.') ||
        socket.realConnection.includes('::1');
}



