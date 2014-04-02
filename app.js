
/**
 * Module dependencies.
 */

var express = require('express');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var app = express();

var helpers = require('./helpers/helpers');
var isDefined = helpers.isDefined;

var models = require('./models/models');

var api = {};
api.version = 'v1';
api.doctors = require('./routes/api/'+api.version+'/doctors');
api.authentication = require('./routes/api/'+api.version+'/authentication');
//console.log(api);

var routes = require('./routes');
var renderTemplates = require('./routes/render_templates');

function appLA(req, res, next){
  next = next || null;
  console.log(next); 
  console.log(req.header("Host"));
  if(req.header("Host") == "localhost:3000"){
    if (req.session) {
      if(req.session.crfs == req.header.crfs){
        if (next) {
          next();
        }else{
          return true;
        }
      }else{
        if (next) {
          res.send("Origen valido pero el token no");
        }else{
          return false;
        }
      }
    }else{

    }
  }else if(req.header("applicationToken")){
    if (next) {
      res.send("Origen no valido");
    }else{
      return false;
    }
  }else{
    console.log("Estoy aqui ####################")
  }
}

function accessLA (req, res, next) {
  
}

function authenticationMiddleware (req, res, next) {
  apiV1Url = /^\/api\/v1/;
  console.log(req.path);
  if (apiV1Url.test(req.path)) {
    if(isDefined(req.get("Authorization"))){
      console.log(req.get("Authorization"));
      var accessToken = req.get("Authorization");
      // console.log(at);
      models.doctorsAccessTokens.findOne({accessToken:accessToken}, function (err, doctorAccessToken) {
        if(err){
          res.send(500);
        }else{
          if(helpers.isDefined(doctorAccessToken)){
            var now = Date.now();
            if(now <= doctorAccessToken.expirationDate){
              console.log("El token es valido y no ha expirado");
              console.log(doctorAccessToken.idUserDataDoctor);
              req.idUserDataDoctor = accessToken.idUserDataDoctor;
              next();  
            }else{
              res.send(401,{
                mdStatus:{
                  code:4102,
                  info:"Token access expired"
                }
              });
            }
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
      console.log("400 Authorization")
      res.send({
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
// app.use(authenticationMiddleware);
app.use(express.cookieParser('1q2w3e4r'));
app.use(express.session({secret:'1q2w3e4r'}));
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

function crfsValidation(req, res, next){
  if(req.header("Host") == "localhost:3000"){
    if (req.session) {
      if(req.session.crfs == req.header("crfs")){
          next();
      }else{
        res.send("Origen valido pero el token no");
      }
    }else{
      res.send("No session");
    }
  }else if(req.header("applicationToken")){
    res.send("Se recibio el token de la aplicacion");
  }else{
    res.send("Origen no valido");
  }
}

// Render Templates
app.get('/', routes.index);
app.get('/signup/doctors', renderTemplates.renderSigupDoctorTemplate);
app.post('/signup/doctors', crfsValidation, api.doctors.saveUserDataDoctor);
app.get('/users', user.list);

// API v1 

/*User Data Doctors*/
app.get("/api/v1/doctors", appLA, api.doctors.getUserDataDoctors);
app.get("/api/v1/doctors/:username", api.doctors.getUserDataDoctorByUsername);
app.post("/api/v1/doctors", api.doctors.saveUserDataDoctor);

/*Personal Data Doctors*/
app.get("/api/v1/doctors/:username/personal_data", api.doctors.getPersonalDataDoctor);
app.post("/api/v1/doctors/:username/personal_data", api.doctors.savePersonalDataDoctor);
app.put("/api/v1/doctors/:username/personal_data", api.doctors.updatePersonalDataDoctor);

/*Titles Data Doctors*/
app.get("/api/v1/doctors/:username/titles_data", api.doctors.getTitlesDataDoctor);
app.get("/api/v1/doctors/:username/titles_data/:title_id", api.doctors.getTitleDataDoctorById);
app.post("/api/v1/doctors/:username/titles_data", api.doctors.saveTitlesDataDoctor);
app.put("/api/v1/doctors/:username/titles_data/:title_id", api.doctors.updateTitleDataDoctor);


app.post("/api/v1/authentication/doctors/access-token/", api.authentication.generateDoctorAccessToken);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});