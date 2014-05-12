var middleware = require("./app_middleware");
var models = require('./models/models');
var api = {};
api.version = 'v1';
api.doctors = require('./routes/api/'+api.version+'/doctors/doctors');
api.patients = require('./routes/api/'+api.version+'/patients/patients');
api.authentication = require('./routes/api/'+api.version+'/authentication');
//console.log(api);

var routes = require('./routes');
var renderTemplates = require('./routes/render_templates');
var sessions = require('./routes/sessions.js');
var test = require('./routes/test');

module.exports = function (app) {
  /*PRUEBA*/
  app.get('/secretary/verify/:identification', function (req, res) {
    debugger;
    var http = require('http');
    var options = {
      host: "http://secretariadesalud-cordoba.herokuapp.com/",
      path: "/SWMedicos/"+req.params.identification,
      method: 'GET',
    };
    var data = "";
    http.request(options, function (response) {
      response.on('data', function (d) {
         data+=d;
      });
      response.on('end', function() {
        data = JSON.parse(data);
        console.log(data);
        res.send({error:null, data: data});
      });
      response.on('error', function(e) {
        res.send({error:e});
      });
    }).end();
  });

  app.get("/pdf", function(req, res){
    var fs = require('fs');
    var http = require('http');
    var data = "";
    http.get("http://localhost:3000/doctors/PDFs/7847.registro extendido.pdf", function (response) {
      console.log("dentro de get");
      response.setEncoding('binary')
      response.on('data', function (d) {
        data+=d;
      });
      response.on('end', function() {
        // data = JSON.parse(data);
        fs.writeFile("prueba.pdf", data, 'binary', function(err){
          if (err){
            throw err;
            console.log(err);
          } else{
            console.log('File saved.')
            res.send("FIle Saved");
          }
        })
      });
      response.on('error', function(e) {
        res.send(e);
      });
    });
  });


  // Render Templates
  app.get('/', routes.index);
  app.get('/signup/doctors', renderTemplates.renderSigupDoctorTemplate);
  app.post('/signup/doctors', middleware.csrfValidation, api.doctors.saveDoctorAccountInformation);
  
  app.get('/search/doctors', renderTemplates.renderSearchDoctorTemplate);
  app.get('/search/idoneidad', renderTemplates.renderSearchIdoneidadTemplate);

  app.get('/login/doctors', renderTemplates.renderLoginDoctorTemplate);
  app.post('/login/doctors', middleware.csrfValidation, sessions.newDoctorSession);
  app.delete('/login/doctors', middleware.csrfValidation, sessions.destroyDoctorSession);
  
  //- informacion de los pacientes
  app.get('/signup/patients', renderTemplates.renderSigupPatientTemplate);
  app.post('/signup/patients', middleware.csrfValidation, api.patients.savePatientAccountInformation);
  app.get('/login/patients', renderTemplates.renderLoginPatientTemplate);
  app.post('/login/patients', middleware.csrfValidation, sessions.newPatientSession);
  app.delete('/login/patients', middleware.csrfValidation, sessions.destroyPatientSession);

  app.get('/:username/patient_information', renderTemplates.renderInformationPatient);
  //********************

  app.get('/:username/personal_information', renderTemplates.renderPersonalInformation)
  app.get('/:username/professional_information', renderTemplates.renderProfessionalInformation)
  app.get('/:username/titles_information', renderTemplates.renderTitlesInformation)
  app.get('/:username/register_end', renderTemplates.renderRegisterEnd)


  // API v1 

  /*Doctors Account Information*/
  
  app.get("/api/v1/doctors", api.doctors.getDoctorsInformation);
  app.get("/api/v1/doctors/:username/account_information", middleware.doctorsCredentialsVerification, api.doctors.getDoctorAccountInformationByUsername);

  // url qu permite que la secretaria cambie el estado de registro de un doctor
  function validateSecreatryToken (req, res, next){
    if(req.header("secretaryToken")){
      if ( req.header("secretaryToken") == "healthSecretrySecretToken") {
        next();
      }else{
        res.send({error: "secrataryToken not valid"});
      }
    }else{
      res.send({error:"You don't sent a secretaryToken"});
    }  
  }

  // app.put('/api/v1/doctors/:username/account_information/register_state', validateSecreatryToken, api.doctors.updateDoctorRegisterStateByUsernameFromSecretary);

  /* Arreglar esto para que funcione desde secretaria */
  app.put('/api/v1/doctors/:identification/account_information/register_state', validateSecreatryToken, api.doctors.updateDoctorRegisterStateById);

  /*Calendary*/
  app.post("/api/v1/doctors/:username/spaceDateForAppointment", middleware.doctorsCredentialsVerification, api.doctors.addDoctorSpaceDateForAppointment);
  app.get("/api/v1/doctors/:username/spacesDateForAppointments", middleware.doctorsCredentialsVerification, api.doctors.getDoctorSpacesForAppointmentsByUsername);
  app.get("/api/v1/doctors/:doctorId/spacesDateForAppointments2", middleware.patientsCredentialsVerification, api.doctors.getDoctorSpacesForAppointmentsById);
  app.get("/api/v1/doctors/spacesDateForAppointments", middleware.doctorsCredentialsVerification, api.doctors.getDoctorSpacesForAppointments);

  /*Doctors Personal Information*/

  // Con esta url obtienes toda la informacion de un doctor
  app.get("/api/v1/doctors/:username/all_information", middleware.doctorsCredentialsVerification, api.doctors.getDoctorInformationByUsername);
  // Con esta url envias toda la info del doctor a secretaria
  app.post("/api/v1/doctors/:username/all_information/to_secretary", middleware.doctorsCredentialsVerification, api.doctors.uploadToSecretary);

  app.get("/api/v1/doctors/:username/personal_information", middleware.doctorsCredentialsVerification, api.doctors.getDoctorPersonalInformationByUsername);
  app.post("/api/v1/doctors/:username/personal_information", middleware.doctorsCredentialsVerification, api.doctors.saveDoctorPersonalInformation);
  app.put("/api/v1/doctors/:username/personal_information", middleware.doctorsCredentialsVerification, api.doctors.updateDoctorPersonalInformation);

  /*Doctor Titles Information*/
  app.get("/api/v1/doctors/:username/titles_information", middleware.doctorsCredentialsVerification, api.doctors.getDoctorsTitlesInformationByUsername);
  // app.get("/api/v1/doctors/:username/titles_data/:title_id", api.doctors.getTitleDataDoctorById);
  app.post("/api/v1/doctors/:username/titles_information", middleware.doctorsCredentialsVerification, api.doctors.saveDoctorTitleInformation);
  app.put("/api/v1/doctors/:username/titles_information/:title_id", middleware.doctorsCredentialsVerification, api.doctors.updateDoctorTitleInformation);

  /*Doctor Professional Information*/
  app.get("/api/v1/doctors/:username/professional_information", middleware.doctorsCredentialsVerification, api.doctors.getDoctorProfessionalInformationByUsername);
  app.post("/api/v1/doctors/:username/professional_information", middleware.doctorsCredentialsVerification, api.doctors.saveDoctorProfessionalInformation);
  app.put("/api/v1/doctors/:username/professional_information", middleware.doctorsCredentialsVerification, api.doctors.updateDoctorProfessionalInformation);


  /* Patient Account Information */
  app.get("/api/v1/patients", api.patients.getPatientsAccountInformation);
  app.get("/api/v1/patients/:username/account_information", middleware.patientsCredentialsVerification, api.patients.getPatientAccountInformationByUsername);

  /* Patient Personal Information */
  app.get("/api/v1/patients/:username/personal_information", middleware.patientsCredentialsVerification, api.patients.getPatientPersonalInformationByUsername);
  app.post("/api/v1/patients/:username/personal_information", middleware.patientsCredentialsVerification, api.patients.savePatientPersonalInformation);
  app.put("/api/v1/patients/:username/personal_information", middleware.patientsCredentialsVerification, api.patients.updatePatientPersonalInformation);
  app.post("/api/v1/patients/:username/addAppointmentToDoctor", middleware.patientsCredentialsVerification, api.patients.addAppointmentToDoctorByUsername);


  app.post("/api/v1/authentication/doctors/access-token/", middleware.csrfValidation, api.authentication.generateDoctorAccessToken);
  app.post("/api/v1/authentication/patients/access-token/", middleware.csrfValidation, api.authentication.generatePatientAccessToken);
  // app.get('/universidad', test.universidades);
  // app.get('/municipios', test.municipios);
  
  // agrege consultas para hacer pruebas sobre las univerdades y tipos de profesion
  app.get('/universidades', function(req,res){
    models.universities.find().sort({name:1}).exec(function(err, universidades){
      if (err) {
        console.log(err);
        res.send({err:500});
      }else{
        res.send({err:null, universidades:universidades});
      }
    });
  });

  app.get('/municipios', function(req,res){
    models.cities.find(function(err, municipios){
      if (err) {
        console.log(err);
        res.send({err:500});
      }else{
        res.send({err:null, municipios:municipios});
      }
    });
  });

  // app.get("/pdf", function(req, res){
  //   var fs = require('fs');
  //   var http = require('http');
  //   var options = {
  //     host: "localhost",
  //     port: 3000,
  //     path: "/doctors/PDFs/8131.Certificate-MongoDB-NodejsDevelopers.pdf",
  //     method: 'GET',
  //   };
  //   var data = "";
  //   http.request(options, function (response) {
  //     response.setEncoding('binary')
  //     response.on('data', function (d) {
  //       data+=d;
  //     });
  //     response.on('end', function() {
  //       // data = JSON.parse(data);
  //       fs.writeFile('/home/pedro/prueba.pdf', data, 'binary', function(err){
  //         if (err) throw err
  //         console.log('File saved.')
  //         res.send("FIle Saved");
  //       })
  //     });
  //     response.on('error', function(e) {
  //       res.send(e);
  //     });
  //   }).end();
  // });
};