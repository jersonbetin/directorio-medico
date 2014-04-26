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

function processDoctorsCredentialsGrant (req, res){
  console.log("Process DCG");
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
                    res.cookie("userType", "doctor");
                  }else{
                    console.log("Guardado en la session")
                    req.session.isLogged = true;
                    req.session.userType = "doctor";
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
  }else if(req.body.accessToken && req.body.refreshToken){
    if (req.body.clientType=="browser" || req.body.clientType=="nativeApp"){
      models.doctorsAccessTokens.findOne({accessToken:req.body.accessToken}, function(err, accessToken){
        if(err){
          res.send(500);
        }else if(accessToken){
          if (accessToken.refreshToken == req.body.refreshToken) {
            generateAccessToken(accessToken.idDAI, function(at, rt, ed){
              accessToken.accessToken = at;
              accessToken.refreshToken = rt;
              accessToken.expirationDate = ed;
              accessToken.save(function(err, doctorsAccessToken) {
                if (err) {
                  console.log(err);
                  res.send({error:500});
                }else{
                  if (req.body.clientType=="browser"){
                    if(req.body.rememberMe == 'true' || req.body.rememberMe == true) {
                      console.log("Guardado en la cookie");
                      res.cookie("isLogged", true);
                      res.cookie("userType", "doctor");
                    }else{
                      console.log("Guardado en la session")
                      req.session.isLogged = true;
                      req.session.userType = "doctor";
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
                }
              });
            });
          }else{
            res.send("refreshToken not valid")
          }
        }else{
          res.send("accessToken not found");
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
  }else{
    res.send({
      error: {
        code:400,
        error:"MissingValues",
        info:"You have to send a email, password and clientType or you have to send a accessToken and refreshToken in the body of request"
      }
    });
  }
}

function processPatientsCredentialsGrant (req, res){
  if (req.body.email && req.body.password && req.body.clientType) {
    console.log(req.body.email);
    console.log(req.body.password);
    models.patients.findOne({
      "accountInformation.email":req.body.email,
      "accountInformation.password": encryptString(req.body.password,"secret-key")
    }, function (err, patient) {
      if (err) {
        console.log(err);
        res.send({error:500});
      }else if (patient) {
        generateAccessToken(patient.id, function(accessToken, refreshToken, expirationDate){
          models.patientsAccessTokens.create({
            idDAI: patient._id,
            accessToken: accessToken,
            refreshToken: refreshToken,
            expirationDate: expirationDate
          }, function(err, patientAccessToken) {
            if (err) {
              console.log(err);
              res.send({error:500});
            }else{
              if (req.body.clientType=="browser" || req.body.clientType=="nativeApp"){
                if (req.body.clientType=="browser"){
                  if(req.body.rememberMe == 'true' || req.body.rememberMe == true) {
                    console.log("Guardado en la cookie");
                    res.cookie("isLogged", true);
                    res.cookie("userType", "patient");
                  }else{
                    console.log("Guardado en la session")
                    req.session.isLogged = true;
                    req.session.userType = "patient";
                  }
                }
                res.send({
                  error:null,
                  accessToken:{
                    accessToken: patientAccessToken.accessToken,
                    refreshToken: patientAccessToken.refreshToken,
                    tokenType: patientAccessToken.tokenType,
                    expirationDate: patientAccessToken.expirationDate
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
    if (req.header("grantType") == "credentials" || req.header("grantType") == "refreshToken"){
      processDoctorsCredentialsGrant(req, res);
    }else{
      console.log("grantType != credentials");
      res.send({
        error: {
          code:400,
          error:"WrongGrantType",
          info:"You must to send a grantType with 'credentials or refreshToken' string in the request header"
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
};

exports.generatePatientAccessToken = function (req, res) {
  console.log("#################### generatePatientAccessToken  ####################")
  if (req.header("grantType")){
    if (req.header("grantType") == "credentials"){
      processPatientsCredentialsGrant(req, res);
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