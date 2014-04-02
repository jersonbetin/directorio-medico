'use strict'

var models = require('../../../models/models');
var userDataDoctorsModel = models.userDataDoctors;
var doctorsAccessTokens = models.doctorsAccessTokens;

var helpers = require('../../../helpers/helpers');
var isDefined = helpers.isDefined;
var encryptString = helpers.encryptString;

var generateAccessToken = function(id, next){
  
  var accessToken = encryptString(Math.random().toString(),id+"accesstoken-secret-key");
  var refreshToken = encryptString(Math.random().toString(),id+"refresh-secret-key");
  var expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 1);

  next(accessToken, refreshToken, expirationDate);
};

exports.generateDoctorAccessToken = function (req, res) {
  if (req.body.email && req.body.password && req.body.clientType) {
    console.log("They do send email, password and clientType");
    userDataDoctorsModel.findOne({
      email:req.body.email,
      password: encryptString(req.body.password,"secret-password-for-doctor-user-passwords")
    }, function (err, userDataDoctor) {
      if (err) {
        console.log(err);
        res.send({error:500});
      }else{
        if (userDataDoctor) {
          generateAccessToken(userDataDoctor.id, function(accessToken, refreshToken, expirationDate){
            doctorsAccessTokens.create({
              idUserDataDoctor: userDataDoctor._id,
              accessToken: accessToken,
              refreshToken: refreshToken,
              expirationDate: expirationDate
            }, function(err, doctorsAccessToken) {
              if (err) {
                console.log(err);
                res.send({error:500});
              }else{
                if (req.body.clientType=="browser"){
                  if(req.body.rememberMe == 'true' || req.body.rememberMe == true) {
                    console.log("Guardado en la cookie");
                    res.cookie("isLogged", true);
                    res.cookie("accessToken", doctorsAccessToken.accessToken);
                    res.cookie("refreshToken", doctorsAccessToken.refreshToken);
                  }else{
                    console.log("Guardado en la session")
                    req.session.isLogged = true;
                    req.session.accessToken = doctorsAccessToken.accessToken;
                    req.session.refreshToken = doctorsAccessToken.refreshToken;
                    console.log(req.session);
                  }
                  console.log(doctorsAccessToken);
                  res.send({
                    error:null,
                    accessToken:{
                      accessToken:doctorsAccessToken.accessToken,
                      refreshToken:doctorsAccessToken.refreshToken,
                    }
                  });
                }else if(req.body.clientType=="nativeApp"){
                  console.log(doctorsAccessToken);
                  res.send({
                    error:null,
                    accessToken:{
                      accessToken:doctorsAccessToken.accessToken,
                      refreshToken:doctorsAccessToken.refreshToken,
                    }
                  });
                }else{
                  res.send({
                    error: {
                      code:400,
                      error:"BadRequest",
                      info:"The clientType value you have sent is wrong, please send a [browser | nativeApp]"
                    }
                  });
                }
              }
            });
          });
        }else{
          res.send({
            error: {
              code:200,
              error:"WrongEmailOrPassword",
              info:"The Email or Password you have sent are wrong"
            }
          });
        }
      }
    });
  }
  /*else if (isDefined(req.body.username) && isDefined(req.body.password)) {
    console.log("They do send email and password");
    userDataDoctorsModel.findOne({
      username:req.body.username,
      password: encryptString(req.body.password,"secret-password-for-doctor-user-passwords")
    }, function (err, userDataDoctor) {
      if (err) {
        console.log(err);
        res.send(500);
      }else{
        if (userDataDoctor) {
          generateAccessToken(userDataDoctor.id, function(accessToken, refreshToken, expirationDate){
            doctorsAccessTokens.create({
              idUserDataDoctor: userDataDoctor._id,
              accessToken: accessToken,
              refreshToken: refreshToken,
              expirationDate: expirationDate
            }, function(err, doctorsAccessToken) {
              if (err) {
                console.log(err);
                res.send(500);
              }else{
                console.log(doctorsAccessToken);
                res.send(200,{
                  mdStatus:{
                    code:2100,
                    info:"Doctor access token successfully created"
                  },
                  accessTokensInfo:{
                    accessToken:doctorsAccessToken.accessToken,
                    refreshToken:doctorsAccessToken.refreshToken,
                    expirationDate:doctorsAccessToken.expirationDate
                  }
                });
              }
            });
          });
        }else{
          res.send(200,{
            mdStatus:{
              code:4100,
              info:"Incorrect Email or Password"
            }
          });
        }
      }
    });
  }else if (isDefined(req.header("accessToken")) && isDefined(req.header("refreshToken"))) {
    console.log("refresh and access tokens pased");
    doctorsAccessTokens.findOne({
      accessToken:req.header("accessToken"),
      refreshToken:req.header("refreshToken")
    }, function(err, doctorAccessToken){
      if (err) {
        console.log(err);
        res.send(500);
      }else{
        if (doctorAccessToken) {
          // var oldAccessToken = doctorAccessToken;
          // console.log(oldAccessToken);
          generateAccessToken(doctorAccessToken.idUserDataDoctor, function(accessToken, refreshToken, expirationDate) {
            doctorAccessToken.accessToken = accessToken;
            doctorAccessToken.refreshToken = refreshToken;
            doctorAccessToken.expirationDate = expirationDate;
            doctorAccessToken.save(function(err, updatedDoctorAccessToken) {
              console.log(updatedDoctorAccessToken);
              res.send(201,{
                mdStatus:{
                  code:2101,
                  info:"Doctor access token successfully update",
                },
                accessTokenInfo:{
                  accessToken:updatedDoctorAccessToken.accessToken,
                  refreshToken:updatedDoctorAccessToken.refreshToken,
                  expirationDate:updatedDoctorAccessToken.expirationDate
                }
              });
            });
          });
        }else{
          console.log("Invalid access and refresh tokens");
          res.send(401,{
            mdStatus:{
              code:4101,
              info:"Invalid access or refresh tokens"
            }
          });
        }
      }
    });
  }*/
  else{
    res.send({
      error: {
        code:400,
        error:"MissingValues",
        info:"You must to send a email, password and clientType values"
      }
    });
  }
}