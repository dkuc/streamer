/// <reference path="../../node_modules/@types/videojs/index.d.ts" />
import io = require('socket.io-client');
import _ = require('lodash');
import $ = require("jquery");

var countText = document.getElementById('viewercount');
var statusText = document.getElementById('status');
//var videoPlayer = document.getElementById('videoPlayer');
var videoPlayer = videojs('videoPlayer', {
    autoplay: true,
    html5: {
        flvjsConfig: {
            isLive: true,
            enableStashBuffer: false
        }
    }
});

var videoData;
var socket = io();
socket.on('stream', setViewerCount);
socket.on('chat', onChatMessage);
socket.on('name', onNewName);
socket.on('users', onUsers);
function onNewName(name) {
    $('#username').text(name);
}

function onChatMessage(msg: ChatData) {

    var listbox = $("#messages");
    var listBoxItems = $("#messages li");

    listbox.append(`<li>${msg.sender}:  ${msg.message}</li>`);


    if(listBoxItems.length > 100){
        listBoxItems.first().remove();
    }

    listbox.animate({scrollTop: listbox.prop("scrollHeight")}, 500);
}
function onUsers(users: string[]) {

    var listbox = $("#users");

    listbox.empty();

    users.forEach((user)=>{
        listbox.append(`<li>${user}</li>`);
    });

}
if(document !== null){


    document.getElementById('halfres').onclick = function () {
        if (videoData) {
            videoPlayer.width(videoData.width / 2);
            videoPlayer.height(videoData.height / 2);
        }
    };

    document.getElementById('fullres').onclick = function () {
        if (videoData) {
            videoPlayer.width(videoData.width);
            videoPlayer.height(videoData.height);
        }

    };

    // document.getElementById('watch').onclick = function () {
    //     socket.emit('watch request');
    // };


    var textBox = $("#messageInput");

    textBox.keyup(function(event){
        if(event.keyCode == 13){
            socket.emit('chat message', textBox.val());
            textBox.val('')
        }
    });

    $("#setname").click(function(){
        promptPromise('What is your name?')
            .then(function(name) {
                socket.emit('setname',name)
            });

    });
}
function promptPromise(message) {
    return new Promise(function(resolve, reject) {
        var result = window.prompt(message);
        if (result != null) {
            resolve(result);
        } else {
            reject();
        }
    });
}

var resolutionSet = false;

function setViewerCount(streams : StreamInfo[]){
    var result = <StreamInfo> _.find(streams, {name: window['streamKey']});
    if(!result){
        statusText.textContent = "Offline";
        return;
    }

    var viewers = result.viewers;
    countText.textContent = String(viewers);
    videoData = result.videoData;

    statusText.textContent = "Online " + videoData.width + "x" + videoData.height + " @ " + videoData.frameRate + "fps - " + videoData.bitRate.toFixed(2) + " Mbps";
    if (resolutionSet === false) {
        if ((<any>videoPlayer).isReady_) { //GET RID OF THIS ANY
            videoPlayer.width(videoData.width / 2);
            videoPlayer.height(videoData.height / 2);
            resolutionSet = true;
        }
    }

}

interface StreamInfo {
    online: boolean;

    viewers: number;

    name: string,
    videoData: VideoData

}
interface VideoData {

    width: number
    height: number
    frameRate: number
    bitRate: number
}

interface ChatData {

    message: string
    sender: string

}


