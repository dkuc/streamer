import _ = require('lodash');
import request = require('request-promise');


let previousTime;
const previousBytes = {};

export = statParser;

async function statParser(): Promise<StreamInfo[]> {

    const statsJs = await request.get('http://localhost:8000/api/streams', {json: true});


    const streams: StreamInfo[] = [];



    for(const stream  of _.values(statsJs.live)) {
        const publisher = stream.publisher;
        if(!publisher){
            return;
        }
        const streamName = publisher.stream;
        const clientCount = stream.subscribers.length;
        const streamInfo: StreamInfo = {
            viewers: clientCount,
            name: streamName,
            videoData: {
                width: publisher.video.width,
                height: publisher.video.height,
                frameRate: publisher.video.fps,
                bitRate: 0
            }
        };



        const bytes = publisher.bytes;
        const time = new Date().getTime();
        let megaBitsPerSecond = 0;

        if (previousTime && previousBytes[streamName]) {
            const elapsedSeconds = (time - previousTime) / 1000;
            const bitsTransfered = (bytes - previousBytes[streamName]) * 8;
            megaBitsPerSecond = (bitsTransfered / elapsedSeconds) / 1000000;
        }

        streamInfo.videoData.bitRate = megaBitsPerSecond;


        previousTime = time;
        previousBytes[streamName] = bytes;


        streams.push(streamInfo);
    }


    return streams;


}

interface StreamInfo {
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




