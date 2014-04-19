'use strict'

var models = require('../../../models/models');

var helpers = require('../../../helpers/helpers');
var isDefined = helpers.isDefined;
var encryptString = helpers.encryptString;

var generateAccessToken = function(id, next){
  
  var accessToken = encryptString(Math.random().toString(),id+"accesstoken-secret-key");
  var refreshToken = encryptString(Math.random().toString(),id+"refreshToken-secret-key");
  var expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 1);

  next(accessToken, refreshToken, expirationDate);
};

function processCredentialsGrant (req, res){
  if (req.body.email && req.body.password && req.body.clientType) {
    console.log(req.body.email);
    console.log(req.body.password);
    models.doctorsAccountInformation.findOne({
      email:req.body.email,
      password: encryptString(req.body.password,"secret-key")
    }, function (err, doctorAI) {
      if (err) {
        console.log(err);
        res.send({error:500});
      }else if (doctorAI) {
        generateAccessToken(doctorAI.id, function(accessToken, refreshToken, expirationDate){
          models.doctorsAccessTokens.create({
            idDAI: doctorAI._id,
            accessToken: accessToken,
            refreshToken: refreshToken,
            expirationDate: expirationDate
          }, function(err, doctorsAccessToken) {
            if (err) {
              console.log(err);
              res.send({error:500});
            }else{
              if (req.body.clientType=="browser" || req.body.clientType=="nativeApp"){
                if (req.body.clientType=="browser"){
                  if(req.body.rememberMe == 'true' || req.body.rememberMe == true) {
                    console.log("Guardado en la cookie");
                    res.cookie("isLogged", true);
                  }else{
                    console.log("Guardado en la session")
                    req.session.isLogged = true;
                  }
                }
                res.send({
                  error:null,
                  accessToken:{
                    accessToken: doctorsAccessToken.accessToken,
                    refreshToken: doctorsAccessToken.refreshToken,
                    tokenType: doctorsAccessToken.tokenType,
                    expirationDate: doctorsAccessToken.expirationDate
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
    });
  }else{
    res.send({
      error: {
        code:400,
        error:"MissingValues",
        info:"You have to send a email, password and clientType"
      }
    });
  }
}

exports.generateDoctorAccessToken = function (req, res) {
  console.log("#################### generateDoctorAccessToken  ####################")
  if (req.header("grantType")){
    if (req.header("grantType") == "credentials"){
      processCredentialsGrant(req, res);
    }else{
      console.log("grantType != credentials");
      res.send({
        error: {
          code:400,
          error:"WrongGrantType",
          info:"You must to send a grantType with 'credentials' string in the request header"
        }
      });  
    }
  }else{
    console.log("grantType header not found");
    res.send({
      error: {
        code:400,
        error:"MissingValues",
        info:"You must to send a grantType in the request header"
      }
    });
  }
}