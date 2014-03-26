
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');

var helpers = require('./helpers/helpers');
var isDefined = helpers.isDefined;

var models = require('./models/models');

var api = {};

api.version = 'v1';
api.doctors = require('./routes/api/'+api.version+'/doctors');
api.authentication = require('./routes/api/'+api.version+'/authentication');
console.log(api);

var http = require('http');
var path = require('path');

var app = express();

var authenticationMiddleware = function(req, res, next) {
  console.log("middleware activado");
  apiV1Url = /^\/api\/v1\/doctors/;
  console.log(req.url);
  if (apiV1Url.test(req.url)) {
    if(isDefined(req.get("Authorization"))){
      console.log(req.get("Authorization"));
      var accessToken = req.get("Authorization");
      // console.log(at);
      models.doctorsAccessTokens.findOne({accessToken:accessToken}, function (err, doctorAccessToken) {
        if(err){
          res.send(500);
        }else{
          if(helpers.isDefined(doctorAccessToken)){
            console.log(doctorAccessToken.idUserDataDoctor);
            req.idUserDataDoctor = accessToken.idUserDataDoctor;
            next();  
          }else{
            res.send(401,{
              mdStatus:{
                code:4101,
                info:"Invalid access token"
              }
            });
          }
        }
      })
    }else{
      res.send(400,{
        mdStatus:{
          code:4000,
          info:"No access token sent",
          description:"You must to send an access token to access this resource"
        }
      });
    }
  }else{
    next();
  }
};

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(authenticationMiddleware);
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

// API v1 
app.get("/api/v1/doctors", api.doctors.getDoctors);
app.post("/api/v1/doctors", api.doctors.saveUserDataDoctor);


app.get("/api/v1/doctors/:username", api.doctors.getDoctorByUsername);


app.get("/api/v1/doctors/:username/personal_data", api.doctors.getPersonalDataDoctor);
app.post("/api/v1/doctors/:username/personal_data", api.doctors.savePersonalDataDoctor);


app.post("/api/v1/authentication/doctors/access-token/", api.authentication.generateDoctorAccessToken);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});