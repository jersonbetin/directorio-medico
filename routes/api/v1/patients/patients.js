'use strict'

var models = require('../../../../models/models');
var helpers = require('../../../../helpers/helpers');
var mails = require("../libs/mails");

var validations=require("./patients_validation_information");



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
  console.log("########## patients.findByUsername  ##########");
  models.patients.findOne({"accountInformation.username":username}, function (err, patient) {
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
  patients.findByUsername(req.params.username, res, function(patient){
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
  console.log(req.body);
  if(req.body.email && req.body.username && req.body.password){
    models.patients.create({
      accountInformation: {
        email: req.body.email,
        username: req.body.username,
        password: helpers.encryptString(req.body.password,"secret-key")
      }
    }, function (err, patient) {
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
        var mailOptions = {
          from: "<consulting.cordoba.service@gmail.com>", // sender address
          to: patient.accountInformation.email, // list of receivers
          subject: "Bienvenido a Cosulting", // Subject line
          text: "Te damos la bienvenida a consulting, nuestra plataforma para que administres todo lo relacionado con consultas medicas. Hola "+patient.accountInformation.username+", es un placer ofrecerte nuestros servicios, esperamos que te sientas comodo. Por favor ingresa a nuestra plataforma consultinn.com", // plaintext body
          html: "<h1>Te damos la bienvenida a consulting.</h1><h2>Consulting es nuestra plataforma para que administres todo lo relacionado con consultas medicas.</h2> <p>Hola <h3>"+patient.accountInformation.username+".</h3>Es un placer ofrecerte nuestros servicios, esperamos que te sientas comodo. Por favor ingresa a nuestra plataforma <h3><a href='http://localhost:3000'>consulting.com</a></h3>"
        }

        mails.sendMail(mailOptions);
        res.send({
          error:null,
          patientAccountInformation: data
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


/*Patient Personal Information*/
//get
exports.getPatientPersonalInformationById = function (req, res){
  console.log("########## exports.getPatientPersonalInformationById  ##########");
  patients.findById(req.session.patient.id, res, function(patientPI){
    console.log("datos personales:"+ patientPI);
    res.send(200, {error: null, patientPersonalInformation: patientPI});
  });
};

exports.getPatientPersonalInformationByUsername = function (req, res){ 
  debugger;
  console.log("########## exports.getPatientPersonalInformationByUsername  ##########");
  patients.findByUsername(req.params.username, res, function(patientPI){
    console.log("datos personales:"+patientPI);
    res.send(200, {error: null, patientPersonalInformation: patientPI});
  });
};

//post
exports.savePatientPersonalInformation = function (req, res){
  debugger;
  console.log("########## exports.savePatientPersonalInformation  ##########");
  validations.testPatientPersonalInformation(req.body.personalInformation, function(testApproved,data){
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
  validations.testPatientPersonalInformation(req.body.personalInformation, function(testApproved,data){
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

exports.addAppointmentToDoctorByUsername = function(req, res) {
  console.log("########## exports.addAppointmentToDoctorByUsername ##########");
  patients.findByUsername(req.params.username, res, function(patient){
    if(req.body.idDoctor && req.body.date.year && req.body.date.month && req.body.date.day && req.body.time.start && req.body.appointment.description){
      console.log("Se pasaron todos los parametros");
      models.doctorsAccountInformation.findOne({_id:req.body.idDoctor}, function(err, doctorAI){
        if (err) {
          console.log(err);
          res500Code(res);
        }else if(doctorAI){
          console.log("Se encontro el doctor");
          models.doctorsCalendar.findOne({
            idDAI: doctorAI._id, 
            "date.year" : req.body.date.year, 
            "date.month" : req.body.date.month, 
            "date.day" : req.body.date.day, 
            "time.start": {$lte: req.body.time.start},
            "time.end": {$gt: req.body.time.start}
          }, function(err, date){
            if (err) {
              console.log(err);
              res500Code(res);
            }else if (date) {
              console.log("Se encontro un lugar");
              // console.log(date);
              if (date.isAvailable == true) {
                console.log("El lugar esta disponible");
                var appointment = {};

                appointment.idPatient = patient._id;
                appointment.description = req.body.appointment.description;
                date.appointment = appointment;
                date.isAvailable = false;
                date.save(function(err, date){
                  if (err) {
                    console.log(err);
                    res500Code(res);
                  }else{
                    console.log(date);
                    res.send(date);
                  }
                });
              }else{
                console.log(date);
                res.send("ya existe una cita apartada con este doctor en esta fecha y a esta hora");
              }
            }else{
              console.log(date);
              res.send("Este doctor no tiene un espacio disponible para una cita en esta fecha y hora");
            }
          });
        }else{
          console.log("Este idDoctor no esta asociado a ningun doctor de la base de datos");
          res.send("Este idDoctor no esta asociado a ningun doctor de la base de datos");
        }
      });
    }else{
      res.send("you have to send a date, time and appointment object");
    }
  });
};

