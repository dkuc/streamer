var express = require('express');
var rest = require('rest');
var _ = require('lodash');
var router = express.Router();
var parseString = require('xml2js').parseString;

var previousTime;
var previousBytes;


/* GET users listing. */
router.get('/', function (req, res) {
    res.status(200);
    var pathTokens = req.originalUrl.split('/');
    var streamKey = pathTokens[pathTokens.length - 1];

    rest('http://dankuc.com:1337').then(function (restResult) {

        parseString(restResult.entity, function (err, js) {

            if (err) {
                console.log(err);
                res.status(500).end();
            }

            try {
                //console.log(JSON.stringify(js));
                var allStreams = js.rtmp.server["0"].application["0"].live["0"].stream;
                var stream = _.find(allStreams, function (stream) {
                    return stream.name["0"] === streamKey;
                });


                var clients = stream.client;
                var clientCount = 0;
                var online = false;
                clients.forEach(function (client) {
                    if (client.publishing)
                        online = true;
                    else
                        clientCount++;
                });


                var video = stream.meta["0"].video["0"];

                var bytes = Number(stream.bytes_in["0"]);
                var time = Number(stream.time["0"]);
                var megaBitsPerSecond = 0;

                if(previousTime){
                    var elapsedSeconds = (time - previousTime) / 1000;
                    var bitsTransfered = (bytes - previousBytes) * 8
                    megaBitsPerSecond = (bitsTransfered / elapsedSeconds) / 1000000;
                }


                previousTime = time;
                previousBytes = bytes;


                res.json({
                    online: online, viewers: clientCount,
                    videoData: {
                        width: video.width["0"],
                        height: video.height["0"],
                        frameRate: video.frame_rate["0"],
                        bitRate: megaBitsPerSecond
                    }
                });

            } catch (err) {
                console.log("Could not parse stats XML" + err);
                res.json({online: false, viewers: 0});
            }

        });


    }).catch(function (err) {
        console.log(err);
        res.status(500).end();
    });


});

module.exports = router;
