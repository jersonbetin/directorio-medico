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


module.exports = function (app) {
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
  app.post('/signup/doctors', middleware.csrfValidation, api.doctors.saveDoctorAccountInformation);
  app.post('/signup/patients', middleware.csrfValidation, api.patients.savePatientAccountInformation);

  app.get('/login/doctors', renderTemplates.renderLoginDoctorTemplate);
  app.post('/login/doctors', middleware.csrfValidation, sessions.newDoctorSession);
  app.delete('/login/doctors', middleware.csrfValidation, sessions.destroyDoctorSession);

  app.get('/:username/personal_information', renderTemplates.renderPersonalInformation)
  app.get('/:username/professional_information', renderTemplates.renderProfessionalInformation)
  app.get('/:username/titles_information', renderTemplates.renderTitlesInformation)


  // API v1 

  /*Doctors Account Information*/
  
  app.get("/api/v1/doctors", api.doctors.getDoctorsAccountInformation);
  app.get("/api/v1/doctors/:username/account_information", middleware.credentialsVerification, api.doctors.getDoctorAccountInformationByUsername);

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

  app.put('/api/v1/doctors/:username/account_information/register_state', validateSecreatryToken, api.doctors.updateDoctorRegisterStateByUsernameFromSecretary);

  /*Doctors Personal Information*/
  app.get("/api/v1/doctors/:username/personal_information", middleware.credentialsVerification, api.doctors.getDoctorPersonalInformationByUsername);
  app.post("/api/v1/doctors/:username/personal_information", middleware.credentialsVerification, api.doctors.saveDoctorPersonalInformation);
  app.put("/api/v1/doctors/:username/personal_information", middleware.credentialsVerification, api.doctors.updateDoctorPersonalInformation);

  /*Doctor Titles Information*/
  app.get("/api/v1/doctors/:username/titles_information", middleware.credentialsVerification, api.doctors.getDoctorsTitlesInformationByUsername);
  // app.get("/api/v1/doctors/:username/titles_data/:title_id", api.doctors.getTitleDataDoctorById);
  app.post("/api/v1/doctors/:username/titles_information", middleware.credentialsVerification, api.doctors.saveDoctorTitleInformation);
  app.put("/api/v1/doctors/:username/titles_information/:title_id", middleware.credentialsVerification, api.doctors.updateDoctorTitleInformation);

  /*Doctor Professional Information*/
  app.get("/api/v1/doctors/:username/professional_information", middleware.credentialsVerification, api.doctors.getDoctorProfessionalInformationByUsername);
  app.post("/api/v1/doctors/:username/professional_information", middleware.credentialsVerification, api.doctors.saveDoctorProfessionalInformation);
  app.put("/api/v1/doctors/:username/professional_information", middleware.credentialsVerification, api.doctors.updateDoctorProfessionalInformation);


  /* Patient Account Information */
  app.get("/api/v1/patients", api.patients.getPatientsAccountInformation);
  app.get("/api/v1/patients/:username/account_information", middleware.credentialsVerification, api.patients.getPatientAccountInformationByUsername);

  /* Patient Personal Information */
  app.get("/api/v1/patients/:username/personal_information", middleware.credentialsVerification, api.patients.getPatientPersonalInformationByUsername);
  app.post("/api/v1/patients/:username/personal_information", middleware.credentialsVerification, api.patients.savePatientPersonalInformation);
  app.put("/api/v1/patients/:username/personal_information", middleware.credentialsVerification, api.patients.updatePatientPersonalInformation);


  app.post("/api/v1/authentication/doctors/access-token/", middleware.csrfValidation, api.authentication.generateDoctorAccessToken);

};