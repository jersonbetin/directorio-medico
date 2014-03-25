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
  if (isDefined(req.body.email) && isDefined(req.body.password)) {
    console.log("They do send email and password");
    userDataDoctorsModel.findOne({
      email:req.body.email,
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
                res.send({
                  accessToken:doctorsAccessToken.accessToken,
                  refreshToken:doctorsAccessToken.refreshToken,
                  expirationDate:doctorsAccessToken.expirationDate
                });
              }
            });
          });
        }else{
          res.send("no doctor");
        }
      }
    });
  }else{
    if (isDefined(req.header("accessToken")) && isDefined(req.header("refreshToken"))) {
      console.log("refresh and access tokens pased");
      doctorsAccessTokens.findOne({
        accessToken:req.header("accessToken"),
        refreshToken:req.header("refreshToken")
      }, function(err, accessTokenObject){
        if (err) {
          console.log(err);
          res.send(500);
        }else{
          if (accessTokenObject) {
            var oldAccessToken = accessTokenObject;
            console.log(oldAccessToken);
            generateAccessToken(accessTokenObject.idUserDataDoctor, function(accessToken, refreshToken, expirationDate) {
              accessTokenObject.accessToken = accessToken;
              accessTokenObject.refreshToken = refreshToken;
              accessTokenObject.expirationDate = expirationDate;
              accessTokenObject.save(function(err, newAccessToken) {
                console.log(newAccessToken);
                res.send(newAccessToken);
              });
            });
          }else{
            console.log("invalid access and refresh tokens");
            res.send("invalid access and refresh tokens");
          }
        }
      });
    }else{
      res.send(400);
    }
  }
}