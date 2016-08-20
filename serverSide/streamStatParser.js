"use strict";
const rest = require('rest');
const xmlParser = require('xml2js');
const P = require('bluebird');
var xml2js = P.promisify(xmlParser.parseString);
var previousTime;
var previousBytes = {};
function statParser() {
    return rest('http://dankuc.com:1337').then(function (restResult) {
        return xml2js(restResult.entity).then(function (js) {
            var streams = [];
            var allStreams = js.rtmp.server["0"].application["0"].live["0"].stream;
            if (!allStreams)
                return streams;
            allStreams.forEach(function (stream) {
                var streamName = stream.name["0"];
                var clients = stream.client;
                var clientCount = 0;
                var online = false;
                clients.forEach(function (client) {
                    if (client.publishing)
                        online = true;
                    else
                        clientCount++;
                });
                var streamInfo = {
                    online: online,
                    viewers: clientCount,
                    name: streamName,
                    videoData: {
                        width: 0,
                        height: 0,
                        frameRate: 0,
                        bitRate: 0
                    }
                };
                if (online) {
                    var video = stream.meta["0"].video["0"];
                    streamInfo.videoData.width = video.width["0"];
                    streamInfo.videoData.height = video.height["0"];
                    streamInfo.videoData.frameRate = video.frame_rate["0"];
                    var bytes = Number(stream.bytes_in["0"]);
                    var time = Number(stream.time["0"]);
                    var megaBitsPerSecond = 0;
                    if (previousTime && previousBytes[streamName]) {
                        var elapsedSeconds = (time - previousTime) / 1000;
                        var bitsTransfered = (bytes - previousBytes[streamName]) * 8;
                        megaBitsPerSecond = (bitsTransfered / elapsedSeconds) / 1000000;
                    }
                    streamInfo.videoData.bitRate = megaBitsPerSecond;
                    previousTime = time;
                    previousBytes[streamName] = bytes;
                }
                streams.push(streamInfo);
            });
            return streams;
        });
    });
}
module.exports = statParser;
//# sourceMappingURL=streamStatParser.js.map