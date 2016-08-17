
var rest = require('rest');
var io = require('socket.io-client');
var _ = require('lodash');

var countText = document.getElementById('viewercount');
var statusText = document.getElementById('status');
//var videoPlayer = document.getElementById('videoPlayer');
var videoPlayer = videojs('videoPlayer');

var videoData;
var socket = io();
socket.on('stream', setViewerCount);
socket.on('alert', function (msg) {
    console.log(msg)
});

document.getElementById('halfres').onclick = function () {
    if (videoData) {
        videoPlayer.width(videoData.width / 2).height(videoData.height / 2);
    }
};

document.getElementById('fullres').onclick = function () {
    if (videoData) {
        videoPlayer.width(videoData.width).height(videoData.height);
    }

};

document.getElementById('watch').onclick = function () {
    socket.emit('watch request');
};
var resolutionSet = false;

function setViewerCount(streams){
    var result = _.find(streams, {name: window.streamKey});
    var viewers = result.viewers;
    countText.textContent = viewers;
    videoData = result.videoData;
    if (result.online) {
        statusText.textContent = "Online " + videoData.width + "x" + videoData.height + " @ " + videoData.frameRate + "fps - " + videoData.bitRate.toFixed(2) + " Mbps";
        if(resolutionSet === false){
            if(videoPlayer.isReady_){
                videoPlayer.width(videoData.width / 2).height(videoData.height / 2);
                resolutionSet = true;
            }
        }
    }
    else
        statusText.textContent = "Offline";
}

