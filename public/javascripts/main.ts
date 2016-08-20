/// <reference path="../../node_modules/@types/videojs/index.d.ts" />
import rest = require('rest');
import io = require('socket.io-client');
import _ = require('lodash');

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
if(document !== null){
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
}

interface Window{
    streamKey: string;
}
var resolutionSet = false;

function setViewerCount(streams : StreamInfo[]){
    var result = _.find(streams, {name: window['streamKey']});
    var viewers = result.viewers;
    countText.textContent = String(viewers);
    videoData = result.videoData;
    if (result.online) {
        statusText.textContent = "Online " + videoData.width + "x" + videoData.height + " @ " + videoData.frameRate + "fps - " + videoData.bitRate.toFixed(2) + " Mbps";
        if(resolutionSet === false){
            if((<any>videoPlayer).isReady_){ //GET RID OF THIS ANY
                videoPlayer.width(videoData.width / 2).height(videoData.height / 2);
                resolutionSet = true;
            }
        }
    }
    else
        statusText.textContent = "Offline";
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


