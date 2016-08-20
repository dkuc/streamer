var server = require('../websocket').server();
var statParser= require('../serverSide/streamStatParser');
var P = require('bluebird');


broadcastStreamInfo();
function broadcastStreamInfo(){


    P.resolve(statParser()).then(function (streamStats) {
        server.emit('stream', streamStats);
    }).catch(function (err) {
        console.log(err);
    }).finally(function () {
        setTimeout(broadcastStreamInfo, 5000);
    });



}