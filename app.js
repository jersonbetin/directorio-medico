
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
var sessions = require('./routes/sessions.js');

function appLA(req, res, next){
  next = next || null;
  console.log(next); 
  console.log(req.header("Host"));
  if(req.header("Host") == "localhost:3000"){
    if (req.session) {
      if(req.session.csrf == req.header.csrf){
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
      });
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
}

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

function csrfValidation(req, res, next){
  console.log("#################### CSRF VALIDATION  ####################")
  if(req.header("Host") == "localhost:3000"){
    if (req.session) {
      console.log(req.session.csrf);
      console.log(req.header("csrfToken"));
      if(req.session.csrf == req.header("csrfToken")){
          console.log("Si se encontro un CSRF token")
          next();
      }else{
        console.log("Origen valido pero el csrf token no");
        res.send("Origen valido pero el csrf token no");
      }
    }else{
      res.send("No session");
    }
  }else if(req.header("applicationToken")){
    res.send("Se recibio el csrf token de la aplicacion");
  }else{
    res.send("Origen no valido");
  }
}

/*function getUserDataFromTokens(req, res, next){
  console.log("#################### getUserDataFromTokens ####################");
  if (req.session && (req.session.isLogged == true || req.session.isLogged == "true")) {
    if(req.session.username){
      next();
    }else{
      console.log("Geting data from session");
      console.log(req.session.accessToken);
      models.doctorsAccessTokens.findOne({accessToken:req.session.accessToken}, function(err, accessToken){
        if (err) {
          console.log(err);
          res.send(500);
        }else if(accessToken){
          console.log("Access token found");
          models.userDataDoctors.findOne({_id:accessToken.idUserDataDoctor}, function(err, userDataDoctor){
            if (err) {
              console.log(err);
              res.send(500);
            }else if(userDataDoctor){
              console.log("userDataDoctor found: "+userDataDoctor.username);
              console.log("Saving userDataDoctor username in session");
              req.session.username = userDataDoctor.username;
              console.log("Username saved");
              next();
            }else{
              console.log("Can't found a userDataDoctor with this id");
              res.send(401);
            }
          })
        }else{
          console.log("Access Token not found");
          res.send(401);
        }
      });
    }
  }else if(req.cookies && (req.cookies.isLogged == true || req.cookies.isLogged == "true")){
    if(req.cookies.username){
      next();
    }else{
      console.log("Geting data from cookie");
      console.log(req.cookies.accessToken);
      models.doctorsAccessTokens.findOne({accessToken:req.cookies.accessToken}, function(err, accessToken){
        if (err) {
          console.log(err);
          res.send(500);
        }else if(accessToken){
          console.log("Access token found");
          models.userDataDoctors.findOne({_id:accessToken.idUserDataDoctor}, function(err, userDataDoctor){
            if (err) {
              console.log(err);
              res.send(500);
            }else if(userDataDoctor){
              console.log("userDataDoctor found: "+userDataDoctor.username);
              console.log("Saving userDataDoctor username in cookie");
              res.cookie("username", userDataDoctor.username);
              console.log("Username saved");
              next();
            }else{
              console.log("Can't found a userDataDoctor with this id");
              res.send(401);
            }
          })
        }else{
          console.log("Access Token not found");
          res.clearCookie("isLogged");
          res.clearCookie("accessToken");
          res.clearCookie("refreshToken");
          res.send(401);
        }
      });
    }
  }else{
    next();
  }
}*/

function credentialsVerification(req, res, next){
  console.log("#################### CREDENTIALS VERIFICATION  ####################")
  if (req.header("accessToken")) {
    models.doctorsAccessTokens.findOne({accessToken:req.header("accessToken")}, function(err, doctorAccessToken){
      if (err) {
        console.log(err);
        res.send({error:500});
      }else if(doctorAccessToken){
        console.log("Access token found");
        if (Date.now() <= doctorAccessToken.expirationDate) {
          if(req.params.username == "me"){
            console.log("Se paso el me");
            models.doctorsAccountInformation.findOne({_id: doctorAccessToken.idDAI}, function(err, doctorAI){
              if(err){
                console.log("err");
                res.send(500);
              }else if(doctorAI){
                console.log(doctorAI.username);
                req.params.username = doctorAI.username;
                next();
              }else{
                console.log("MEdoctorAccountInformation not fount")
                res.send(404);
              }
            });
          }else{
            if(req.method == "GET"){
              next();
            }else{
              models.doctorsAccountInformation.findOne({username: username}, function(err, doctorAI){
                if (err) {
                  console.log(err);
                  res.send(500);
                }else if(doctorAI){
                  console.log("DAT: "+doctorsAccessToken.idDAI);
                  if(doctorAccessToken.idDAI == doctorAI.id){
                    next();
                  }else{
                    res.send({
                      error: {
                        code:401,
                        error:"InvalidAccessToken",
                        info:"The access token have you sent is not related to the user that you want to modify"
                      }    
                    });
                  }
                }else{
                  res.send({
                    error: {
                      code:401,
                      error:"Username not found",
                      info:"Username not found"
                    }    
                  });
                }
              });
            }
          }
        }else{
          res.send({
          error: {
            code:401,
            error:"AccessTokenExpired",
            info:"The accessToken have you sent have expired, please get a new accessToken"
          }
        });
        }
      }else{
        console.log("Access token not valid");
        res.send({
          error: {
            code:401,
            error:"AccessTokenNoValid",
            info:"The accessToken have you sent doesn't exist in our database, please send another"
          }
        });
      }
    });  
  }else{
    console.log("Access token not sent");
    res.send({
      error: {
        code:401,
        error:"AccessTokenNotSent",
        info:"You don't sent an accessToken"
      }
    });
  }
}


// Render Templates
app.get('/', routes.index);
app.get('/signup/doctors', renderTemplates.renderSigupDoctorTemplate);
app.post('/signup/doctors', csrfValidation, api.doctors.saveDoctorAccountInformation);

app.get('/login/doctors', renderTemplates.renderLoginDoctorTemplate);
app.post('/login/doctors', csrfValidation, sessions.newDoctorSession);
app.delete('/login/doctors', csrfValidation, sessions.destroyDoctorSession);

app.get('/:username/personal_information', renderTemplates.renderPersonalInformation)


// API v1 

/*User Data Doctors*/


// app.get('/api/v1/doctors/me/personal_information', credentialsVerification, api.doctors.getDoctorPersonalDataById);


// app.get('/api/v1/doctors/me', credentialsVerification, api.doctors.getDoctorAccountInformationById);
app.get("/api/v1/doctors/:username", credentialsVerification, api.doctors.getDoctorAccountInformationByUsername);

// app.get("/api/v1/doctors", appLA, api.doctors.getUserDataDoctors);
// app.post("/api/v1/doctors", api.doctors.saveUserDataDoctor);

/*Personal Data Doctors*/
// app.get("/api/v1/doctors/me/personal_information", credentialsVerification, api.doctors.getDoctorPersonalInformationById);
app.get("/api/v1/doctors/:username/personal_information", credentialsVerification, api.doctors.getDoctorPersonalInformationByUsername);
app.post("/api/v1/doctors/:username/personal_information", credentialsVerification, api.doctors.saveDoctorPersonalInformation);
app.put("/api/v1/doctors/:username/personal_information", credentialsVerification, api.doctors.updateDoctorPersonalInformation);

/*Titles Data Doctors*/
// app.get("/api/v1/doctors/:username/titles_data", api.doctors.getTitlesDataDoctor);
// app.get("/api/v1/doctors/:username/titles_data/:title_id", api.doctors.getTitleDataDoctorById);
// app.post("/api/v1/doctors/:username/titles_data", api.doctors.saveTitlesDataDoctor);
// app.put("/api/v1/doctors/:username/titles_data/:title_id", api.doctors.updateTitleDataDoctor);


app.post("/api/v1/authentication/doctors/access-token/", csrfValidation, api.authentication.generateDoctorAccessToken);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});