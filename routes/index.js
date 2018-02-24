var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.setHeader('Access-Control-Allow-Origin', '*');
  var pathTokens = req.originalUrl.split('/');
  var streamKey = 'rack';
  if(pathTokens.length === 3){
    streamKey = pathTokens[2];
  }
  //const videoSource = "ws://localhost:8000/live/" + streamKey + ".flv";
  const videoSource = "wss://shadowclip.net/live/" + streamKey + ".flv";

  res.render('index', { title: streamKey + ' Stream', videoSource: videoSource, streamKey: streamKey });
});

module.exports = router;
