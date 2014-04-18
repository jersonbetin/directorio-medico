
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
              models.doctorsAccountInformation.findOne({username: req.params.username}, function(err, doctorAI){
                if (err) {
                  console.log(err);
                  res.send(500);
                }else if(doctorAI){
                  console.log("DAT: " + doctorAccessToken.idDAI);
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

/*PRUEBA*/
app.get('/secretary/verify/:identification', function (req, res) {
  var options = {
    host: 'localhost',
    port: '4000',
    path: '/SWMedicos/'+req.params.identification,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  };

  var request = http.request(options, function(response) {
    var msg = '';

    response.setEncoding('utf8');
    response.on('data', function(chunk) {
      msg += chunk;
    });
    response.on('end', function() {
      res.send(JSON.parse(msg));
    });
  });
  request.end();
});







// Render Templates
app.get('/', routes.index);
app.get('/signup/doctors', renderTemplates.renderSigupDoctorTemplate);
app.post('/signup/doctors', csrfValidation, api.doctors.saveDoctorAccountInformation);

app.get('/login/doctors', renderTemplates.renderLoginDoctorTemplate);
app.post('/login/doctors', csrfValidation, sessions.newDoctorSession);
app.delete('/login/doctors', csrfValidation, sessions.destroyDoctorSession);

app.get('/:username/personal_information', renderTemplates.renderPersonalInformation)
app.get('/:username/professional_information', renderTemplates.renderProfessionalInformation)
app.get('/:username/titles_information', renderTemplates.renderTitlesInformation)


// API v1 

/*Doctors Account Information*/


// app.get('/api/v1/doctors/me/personal_information', credentialsVerification, api.doctors.getDoctorPersonalDataById);


app.get("/api/v1/doctors/:username/account_information", credentialsVerification, api.doctors.getDoctorAccountInformationByUsername);

// app.get("/api/v1/doctors", appLA, api.doctors.getUserDataDoctors);
// app.post("/api/v1/doctors", api.doctors.saveUserDataDoctor);

/*Doctors Personal Information*/
app.get("/api/v1/doctors/:username/personal_information", credentialsVerification, api.doctors.getDoctorPersonalInformationByUsername);
app.post("/api/v1/doctors/:username/personal_information", credentialsVerification, api.doctors.saveDoctorPersonalInformation);
app.put("/api/v1/doctors/:username/personal_information", credentialsVerification, api.doctors.updateDoctorPersonalInformation);

/*Doctor Titles Information*/
app.get("/api/v1/doctors/:username/titles_information", credentialsVerification, api.doctors.getDoctorsTitlesInformationByUsername);
// app.get("/api/v1/doctors/:username/titles_data/:title_id", api.doctors.getTitleDataDoctorById);
app.post("/api/v1/doctors/:username/titles_information", credentialsVerification, api.doctors.saveDoctorTitleInformation);
app.put("/api/v1/doctors/:username/titles_information/:title_id", credentialsVerification, api.doctors.updateDoctorTitleInformation);

/*Doctor Professional Information*/
app.get("/api/v1/doctors/:username/professional_information", credentialsVerification, api.doctors.getDoctorProfessionalInformationByUsername);
app.post("/api/v1/doctors/:username/professional_information", credentialsVerification, api.doctors.saveDoctorProfessionalInformation);
app.put("/api/v1/doctors/:username/professional_information", credentialsVerification, api.doctors.updateDoctorProfessionalInformation);



app.post("/api/v1/authentication/doctors/access-token/", csrfValidation, api.authentication.generateDoctorAccessToken);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});