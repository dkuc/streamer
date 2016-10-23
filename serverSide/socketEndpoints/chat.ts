import ws = require('./websocket');
import _ = require('lodash');
import fs = require('fs');
import P = require('bluebird');


const filename = 'names.json';
const server = ws.getServer();
let copyOfStoredNames = {};
let storedNames = {'192.168.1.65': 'Dan'};
const sockets = [];


initStoredNames();
writeStoredNames();


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

function initStoredNames() {

    if(fs.existsSync(filename)){
        const data = fs.readFileSync(filename,'utf8');
        storedNames = JSON.parse(data);
        copyOfStoredNames = _.cloneDeep(storedNames);
    }
}

async function writeStoredNames() {

    while(true) {
        await P.delay(1000 * 2);

        if(_.isEqual(storedNames, copyOfStoredNames) === false){
            fs.writeFileSync(filename,JSON.stringify(storedNames));

            console.log('successfull write');

            copyOfStoredNames = _.cloneDeep(storedNames);
        }
    }
}

function isLocal(socket) {
    return socket.realConnection.includes('192.168.') ||
        socket.realConnection.includes('::1');
}





