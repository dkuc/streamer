import *  as ws from './websocket';

import statParser= require('../streamStatParser');
import P = require('bluebird');

const server = ws.getServer();


broadcastStreamInfo();
async function broadcastStreamInfo(){

    while(true){

        try {
            const streamStats = await statParser();
            server.emit('stream', streamStats);
        }catch (err){
            console.log(err);
        }


        await P.delay(2000);
    }

}