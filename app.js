
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
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

// var options = {
//   host: 'localhost',
//   port: '4000',
//   path: '/universidades',
//   method: 'GET',
//   headers: {
//     'Content-Type': 'application/json; charset=utf-8'
//   }
// };

// var request = http.request(options, function(response) {
//   var msg = '';

//   response.setEncoding('utf8');
//   response.on('data', function(chunk) {
//     msg += chunk;
//   });
//   response.on('end', function() {
//     console.log(JSON.parse(msg));
//   });
// });
// request.end();
require("./app_urls")(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});