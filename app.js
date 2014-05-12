/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var app = express();

var allowCrossDomain = function (req, res, next) {
    res.header ('Access-Control-Allow-Origin', '*');
    res.header ('Access-Control-Allow-Methods', 'GET');
    res.header ('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
// app.use(express.bodyParser());
app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + "/public/doctors/PDFs" }));

app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(allowCrossDomain);
/*app.use(function (req, res, next) {
  console.log(req.method);
  console.log(req.url);
  console.log(req.ip);
  console.log(req.path);
  console.log(req.host);
  console.log(req.protocol);
  next();
});*/
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  app.use(app.locals.pretty = true);
}

require("./app_urls")(app);

var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// http.createServer(app);

// var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket) {
  // socket.emit('news', { hello: 'world' });
  // socket.on('event', function (data) {
  //   console.log(data);
  // });
  socket.on("connect", function(data){
    console.log("Conectado: "+data);
  });

  socket.on("calendarUpdated", function(){
    console.log("Se ha actualizado algun calendario");
    socket.broadcast.emit('calendarUpdated', "the caledar has changed");
  });

  socket.emit("news", {status:"You are conected :D"});
});
