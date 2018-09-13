var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



var streamIndex = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/s/static/',express.static(path.join(__dirname, 'public')));
app.use('/static/',express.static(path.join(__dirname, 'public')));

app.use('/s/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/s/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/s/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/s/js', express.static(__dirname + '/node_modules/videojs-flvjs/dist'));
app.use('/s/js', express.static(__dirname + '/node_modules/flv.js/dist'));

app.use('/s/:id', streamIndex);
app.use('/s', streamIndex);



// catch 404 and forward to error handler
app.use(notFound);
function notFound(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
}

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


const { NodeMediaServer } = require('node-media-server');

const config = {
    rtmp: {
        port: 1935,
        chunk_size: 30000,
        gop_cache: true,
        ping: 60,
        ping_timeout: 30
    },
    http: {
        port: 8000,
        allow_origin: '*'
    }
};

var nms = new NodeMediaServer(config);
nms.run();


module.exports = app;
