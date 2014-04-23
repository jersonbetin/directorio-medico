'use strict'

var models = require('../../../../models/models');
var encryptString = helpers.encryptString;
require("./patients_validation_information");



/* respons code function */
function res500Code(res){
  res.send({
    error: {
      code:500,
      error:"SomethingWasWrongWithUs",
      info:"This erros happends in our servers, we will try to fix the soon as possible"
    }
  });
}

function res404Code(res){
  res.send({
    error: {
      code:404,
      error:"ResourceNotFound",
      info:""
    }
  });
}

var patients = {}; 

patients.findById = function (id, res, next){
  console.log("########## patients.findById  ##########");
  models.patients.findOne({_id:id}, function (err, patient) {
    if (err) {
      console.log(err);
      res500Code(res);
    }else if(patient){
      next(patient);
    }else{
      res404Code(res);
    }
  });
};

patients.findByUsername = function (username, res, next){
  console.log("########## atinets.findByUsername  ##########");
  models.patient.findOne({"accountInformation.username":username}, function (err, patient) {
    if (err) {
      console.log(err);
      res500Code(res);
    }else if(patient){
      next(patient);
    }else{
      res404Code(res);
    }
  });
};


/*Patient Account Information*/
//get
exports.getPatientsAccountInformation = function (req, res) {
  console.log("########## exports.getPatientsAccountInformation  ##########");
  var criteria = {};
  var projection = {};
  
  if(req.query.email) {
    criteria.accountInformation.email = req.query.email;
    console.log(criteria);
  }

  if(req.query.username) {
    criteria.accountInformation.username = req.query.username;
    console.log(criteria);
  }

  console.log("fields: "+req.query.fields);
  models.patients.find(criteria, function (err, patients) {
    if (err) {
      res500Code(res);
    }else{
      res.send(patients.accountInformation);
    }
  });
};

exports.getPatientAccountInformationById = function (req, res){
  console.log("########## exports.getPatientAccountInformationById  ##########");
  patients.findById(req.session.patient.id, res, function(patient){
    res.send({
      error:null,
      patientAccountInformation:{
        email: patient.accountInformation.email,
        username: patient.accountInformation.username,
        registerDate: patient.accountInformation.createdDate
      }
    });
  });
};

exports.getPatientAccountInformationByUsername = function (req, res) {
  console.log("########## exports.getPatientAccountInformationByUsername  ##########");
  doctors.findByUsername(req.params.username, res, function(patient.accountInformation){
    res.send({
      error:null,
      patientAccountInformation:{
        email: patient.accountInformation.email,
        username: patient.accountInformation.username,
        registerDate: patient.accountInformation.createdDate
      }
    });
  });
};

//post
exports.savePatientAccountInformation = function (req, res){
  console.log("########## exports.savePatientAccountInformation  ##########");
  if(req.body.email && req.body.username && req.body.password){
    models.patient.create({
      accountInformation: {
        email: req.body.email,
        username: req.body.username,
        password: encryptString(req.body.password,"secret-key")
      }
    }, function (err, doctorAI) {
      if (err) {
        console.log(err);
        if (err.code==11000) {
          console.log(err.err);
          if(err.err.indexOf(req.body.email)!=-1){
            res.send({
              error:{
                code: 1,
                error: "EmailAlreadyExist",
                info: "The email you have sent are already registered in our database"
              }
            });
          }else if(err.err.indexOf(req.body.username)!=-1){
            res.send({
              error: {
                code: 2,
                error: "UsernameAlreadyExist",
                info: "The username you have sent are already registered in our database"
              }
            });
          }
        }else{
          res500Code(res);
        }
      }else{
        console.log(patient);
        var data = {
          _id: patient.accountInformation._id,
          email: patient.accountInformation.email,
          username: patient.accountInformation.username,
          createdDate: patient.accountInformation.createdDate
        };
        res.send({
          error:null,
          patient.accountInformation: data
        });
      }
    });
  }else{
    res.send({
      error:{
        code: 400,
        error: "BadRequest", 
        info: "You must to pass a email, username and password values for make this query"
      }
    });
  }
};


/*Doctors Personal Information*/
//get
exports.getPatientPersonalInformationById = function (req, res){
  console.log("########## exports.getPatientPersonalInformationById  ##########");
  patients.findById(req.session.patient.id, res, function(patientPI){
    console.log("datos personales:"+ patientPI);
    res.send(200, {error: null, patientPersonalInformation: patientPI});
  });
};

exports.getPatientPersonalInformationByUsername = function (req, res){  
  console.log("########## exports.getPatientPersonalInformationByUsername  ##########");
  patients.findByUsername(req.params.username, res, function(PatientPI){
    console.log("datos personales:"+patientPI);
    res.send(200, {error: null, patientPersonalInformation: doctorPI});
  });
};

//post
exports.savePatientPersonalInformation = function (req, res){
  console.log("########## exports.savePatientPersonalInformation  ##########");
  testPatientPersonalInformation(req.body.personalInformation, function(testApproved,data){
    if (testApproved) {
      console.log("Test approved");
      console.log(req.params.username);
      patients.findByUsername(req.params.username, res, function(patient){
        patient.personalInformation = req.body.personalInformation;
        patient.save(function (err, patient) {
          if (err) {  
            res500Code(res);
          }else{
            res.send({
              error: null,
              patientPersonalInformation: patient.personalInformation
            });
          }
        });
      });
    }else{
      resToIncorrectStructure(req,res,"personalInformation",data);    
    }
  });
};

//put
exports.updatePatientPersonalInformation = function(req, res) {
  console.log("########## exports.updatePatientPersonalInformation  ##########");
  testPatientPersonalInformation(req.body.personalInformation, function(testApproved,data){
    if (testApproved) {
      console.log("Test approved");
      console.log(req.params.username);
      patients.findByUsername(req.params.username, res, function(patient){
        patient.personalInformation = req.body.personalInformation;
        patient.save(function (err, patient) {
          if (err) {  
            res500Code(res);
          }else{
            res.send({
              error: null,
              patientPersonalInformation: patient.personalInformation
            });
          }
        });
      });
    }else{
      resToIncorrectStructure(req,res,"personalInformation",data);    
    }
  });
};

