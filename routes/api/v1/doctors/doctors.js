'use strict'

var models = require('../../../../models/models');
var helpers = require('../../../../helpers/helpers');
var isDefined = helpers.isDefined;
var encryptString = helpers.encryptString;
require("./doctors_validation_information");



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

var doctors = {}; 

doctors.getAccountInformationById = function (id, res, next){
  console.log("########## doctors.getAccountInformationById  ##########");
  models.doctorsAccountInformation.findOne({_id:id}, function (err, doctorAI) {
    if (err) {
      console.log(err);
      res500Code(res);
    }else if(doctorAI){
      next(doctorAI);
    }else{
      res404Code(res);
    }
  });
};

doctors.getAccountInformationByUsername = function (username, res, next){
  console.log("########## doctors.getAccountInformationByUsername  ##########");
  models.doctorsAccountInformation.findOne({username:username}, function (err, doctorAI) {
    if (err) {
      console.log(err);
      res500Code(res);
    }else if(doctorAI){
      next(doctorAI);
    }else{
      res404Code(res);
    }
  });
};

doctors.getPersonalInformationById = function (id, res, next){
  console.log("########## doctors.getPersonalInformationById  ##########");
  models.doctorsPersonalInformation.findOne({idDAI:id}, function (err, doctorPI) {
    if (err) {
      console.log(err);
      res500Code(res);
    }else if(doctorPI){
      next(doctorPI);
    }else{
      res404Code(res);
    }
  });
};

doctors.getTitlesInformationById = function(id, res, next) {
  console.log("########## doctors.getTitlesInformationById  ##########");
  models.titleInformationDoctors.find({idDAI:id}).populate("idUniversity").exec(function (err, doctorTI) {
    if (err) {
      console.log(err);
      res500Code(res);
    }else if (doctorTI){
      res.send(200, {error: null, doctorTitlesInformation: doctorTI});
      // models.universities.findOne({_id:titleInformation.idUniversity})
    }else{
      res404Code(res);
    }
  });
};



/*Doctors Account Information*/
//get
exports.getDoctorsAccountInformation = function (req, res) {
  console.log("########## exports.getDoctorsAccountInformation  ##########");
  var criteria = {};
  var projection = {};
  if(helpers.isDefined(req.query.registerState)) {
    if (req.query.registerState == 0 || req.query.registerState == 1 
      || req.query.registerState == 2 || req.query.registerState == 3) {
      criteria.registerState = req.query.registerState
      console.log(criteria);
    }
  }
  if(helpers.isDefined(req.query.email)) {
    criteria.email = req.query.email
    console.log(criteria);
  }

  console.log("fields: "+req.query.fields);
  models.DoctorsAccountInformation.find(criteria, function (err, doctors) {
    if (err) {
      res.send({
        error: {
          code:500,
          error:"SomethingWasWrongWithUs",
          info:"This erros happends in our servers, we will try to fix the soon as possible"
        }
      });
    }else{
      res.send(doctors);
    }
  });
};

exports.getDoctorAccountInformationById = function (req, res){
  console.log("########## exports.getDoctorAccountInformationById  ##########");
  doctors.getAccountInformationById(req.session.DAI.id,res, function(doctorAI){
    res.send({
      error:null,
      doctorAccountInformation:{
        email: doctorAI.email,
        username: doctorAI.username,
        registerState: doctorAI.registerState,
        registerDate: doctorAI.createdDate
      }
    });
  });
};

exports.getDoctorAccountInformationByUsername = function (req, res) {
  console.log("########## exports.getDoctorAccountInformationByUsername  ##########");
  doctors.getAccountInformationByUsername(req.params.username,res, function(doctorAI){
    res.send({
      error:null,
      doctorAccountInformation:{
        email: doctorAI.email,
        username: doctorAI.username,
        registerState: doctorAI.registerState,
        registerDate: doctorAI.createdDate
      }
    });
  });
};

//post
exports.saveDoctorAccountInformation = function (req, res){
  console.log("########## exports.saveDoctorAccountInformation  ##########");
  if(isDefined(req.body.email) && isDefined(req.body.username) && isDefined(req.body.password)){
    models.doctorsAccountInformation.create({
      email: req.body.email,
      username: req.body.username,
      password: encryptString(req.body.password,"secret-key")
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
        console.log(doctorAI);
        var data = {
          _id: doctorAI._id,
          email: doctorAI.email,
          username: doctorAI.username,
          registerState: doctorAI.registerState
        };
        res.send({
          error:null,
          doctorAccountInformation:data
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
exports.getDoctorPersonalInformationById = function (req, res){
  console.log("########## exports.getDoctorPersonalInformationById  ##########");
  doctors.getPersonalInformationById(req.session.DAI.id, res, function(doctorPI){
    console.log("datos personales:"+doctorPI);
    res.send(200, {error: null, doctorPersonalInformation: doctorPI});
  });
};

exports.getDoctorPersonalInformationByUsername = function (req, res){  
  console.log("########## exports.getDoctorPersonalInformationByUsername  ##########");
  doctors.getAccountInformationByUsername(req.params.username, res, function(doctorAI){
    console.log(doctorAI);
    doctors.getPersonalInformationById(doctorAI._id, res, function(doctorPI){
      console.log("datos personales:"+doctorPI);
      res.send(200, {error: null, doctorPersonalInformation: doctorPI});
    });
  });
};

//post
exports.saveDoctorPersonalInformation = function (req, res){
  console.log("########## exports.saveDoctorPersonalInformation  ##########");
  testDoctorPersonalInformation(req.body.personalInformation, function(testApproved,data){
    if (testApproved) {
      console.log("Test approved");
      console.log(req.params.username);
      doctors.getAccountInformationByUsername(req.params.username, res, function(doctorAI){
        req.body.personalInformation.idDAI = doctorAI._id;
        models.doctorsPersonalInformation.create(req.body.personalInformation, function (err, doctorPI) {
          if (err) {
            if (err.code == 11000) {
              res.send({
                error: {
                  code:200,
                  error:"PersonalInformationAlreadySaved",
                  info:"This username already has an asociated personalInformation"
                }
              });
            }else{  
              res500Code(res);
            }
          }else{
            res.send({
              error: null,
              doctorPersonalInformation: doctorPI
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
exports.updateDoctorPersonalInformation = function(req, res) {
  console.log("########## exports.updateDoctorPersonalInformation  ##########");
  testDoctorPersonalInformation(req.body.personalInformation, function(testApproved,data){
    if (testApproved) {
      doctors.getAccountInformationByUsername(req.params.username, res, function(doctorAI){
        req.body.personalInformation.idDAI = doctorAI._id;
        models.doctorsPersonalInformation.update(
          {idDAI:doctorAI._id},
          req.body.personalInformation,
          function (err, doctorPI) {
            if (err) {
              console.log(err);
              res500Code(res);
            }else{
              res.send({
                error: null,
                doctorPersonalInformation: doctorPI
              });
            }
          }
        );
      });
    }else{
      resToIncorrectStructure(req,res,"personalInformation",data);    
    }
  });
};


/*Doctors TItles Information*/
//get
exports.getDoctorTitlesInformationById = function(req, res) {
  console.log("########## exports.getDoctorTitlesInformationById  ##########");
  doctors.getTitlesInformationById(req.session.DAI.id, res, function(doctorTI){
    res.send(200, {error: null, doctorTitlesInformation: doctorTI});
  });
};

exports.getDoctorsTitlesInformationByUsername = function(req, res) {
  console.log("########## exports.getDoctorsTitlesInformationByUsername  ##########");
  criteria.username=req.params.username;
  doctors.getAccountInformationByUsername(req.params.username, res, function(doctorAI){
    doctors.getTitlesInformationById(doctorAI.id, res, function(doctorTI){
      res.send(200, {error: null, doctorTitlesInformation: doctorTI});
    });
  });
};

//post
exports.saveDoctorTitleInformation = function (req, res){
  console.log("########## exports.saveDoctorTitleInformation  ##########");
  testDoctorTitleInformation(req.body.titleInformation, function(testApproved,data){
    if (testApproved) {
      console.log(req.params.username);
      doctors.getAccountInformationByUsername(req.params.username, res, function(doctorAI){
        req.body.titleInformation.idDAI = doctorAI._id;
        models.universities.findOne({_id:req.body.titleInformation.university}, function(err, university){
          if (err) {
            console.log(err);
            res500Code(res);
          }else if(isDefined(university)){
            console.log("se encontro la U");
            req.body.titleInformation.idUniversity = university._id;
            models.doctorsTitlesInformation.create(req.body.titleInformation, function (err, doctorTI) {
              if (err) {
                if (err.code == 11000) {
                  res.send({
                    error: {
                      code: 400,
                      error: "titleInformationAlreadyRegistered"
                    }
                  });
                }else{  
                  console.log(err);
                  res.send({
                  error: {
                    code:500,
                    error:"SomethingWasWrongWithUs",
                    info:"This erros happends in our servers, we will try to fix the soon as possible"
                  }
                });
                }
              }else{
                res.send({
                  error: null,
                  doctorTitleInformation: doctorTI
                });
              }
            });
          }else{
            console.log("no se encontro la U");
            res.send("esta universidad no existe y por eso no se va a guardar esta informacion");
          }
        });
      });
    }else{
      resToIncorrectStructure(req,res,"titleInformation", data);    
    }
  });
};

//put
exports.updateDoctorTitleInformation = function(req, res) {
  console.log("########## exports.updateDoctorTitleInformation  ##########");
  testDoctorTitleInformation(req.body.titleInformation, function(testApproved,data){
    if (testApproved) {
      doctors.getAccountInformationByUsername(req.params.username, res, function(doctorAI){
        models.universities.findOne({_id:req.body.titleInformation.university}, function(err, university){
          if (err) {
            console.log(err);
            res500Code(res);
          }else if(isDefined(university)){
            console.log("se encontro la U");
            req.body.titleInformation.idUniversity = university._id;
            req.body.titleInformation.idDAI = doctorAI._id;
            models.doctorsTitlesInformation.update({idDAI: doctorAI._id, _id: req.params.title_id}, req.body.titleInformation, function (err, doctorTI) {
              if (err) {
                console.log(err);
                res.send({
                  error: {
                    code:500,
                    error:"SomethingWasWrongWithUs",
                    info:"This erros happends in our servers, we will try to fix the soon as possible"
                  }
                });
              }else{
                res.send(200,{
                  mdStatus:{
                    code:2000,
                    info: "title data doctor successfully updated",
                    url:"localhost:3000/api/v1/doctors/"+doctorAI.username+"/titles_data/"+req.params.title_id
                  }
                });
              }
            });
          }else{
            console.log("no se encontro la U");
            res.send("esta universidad no existe y por eso no se va a guardar esta informacion");
          }
        });
      });
    }else{
      resToIncorrectStructure(req,res,"titleInformation",data);    
    }
  });
};


/*Doctors Professional Information*/
//get
exports.getDoctorProfessionalInformationByUsername = function (req, res){
  console.log("#################### getDoctorProfessionalInformationByUsername  ####################");
  var criteria = {};
  var projection = {};
  criteria.username=req.params.username;
  models.doctorsProfessionalInformation.findOne()
  .populate({path: "doctorsAccountInformation", match: { username: req.params.username}})
  .exec(function (err, doctorPI) {
    console.log("doctor personal information"+doctorPI);
    if (err) {
      console.log(err);
      res.send({
        error: {
          code:500,
          error:"SomethingWasWrongWithUs",
          info:"This erros happends in our servers, we will try to fix the soon as possible"
        }
      });
    }else if (doctorPI){
      console.log("datos professionales:"+doctorPI);
      res.send(200, {error: null, doctorProfessionalInformation: doctorPI});
    }else{
      res.send(200, {error: null, doctorProfessionalInformation: null});
    }
  });
}
//post
exports.saveDoctorProfessionalInformation = function (req, res){
  console.log("#################### saveDoctorProfessionalInformation  ####################");
  testDoctorProfessionalInformation(req.body.professionalInformation, function(testApproved,data){
    if (testApproved) {
      console.log("Test approved");
      console.log(req.params.username);
      models.doctorsAccountInformation.findOne({username:req.params.username}, function(err, doctorAI) {
        if (err) {
          console.log(err);
          res.send({
            error: {
              code:500,
              error:"SomethingWasWrongWithUs",
              info:"This erros happends in our servers, we will try to fix the soon as possible"
            }
          });
        }else if(doctorAI){
          req.body.professionalInformation.idDAI = doctorAI._id;
          models.doctorsProfessionalInformation.create(req.body.professionalInformation, function (err, doctorPI) {
            if (err) {
              if (err.code == 11000) {
                res.send({
                  error: {
                    code:200,
                    error:"ProfessionalInformationAlreadySaved",
                    info:"This username already has an asociated personalInformation"
                  }
                });
              }else{  
                console.log(err);
                res.send({
                  error: {
                    code:500,
                    error:"SomethingWasWrongWithUs",
                    info:"This erros happends in our servers, we will try to fix the soon as possible"
                  }
                });
              }
            }else{
              res.send({
                error: null,
                doctorProfessionalInformation: doctorPI
              });
            }
          });
        }else{
          res.send(200,{
            mdStatus:{
              code:2000,
              info: "This username doesn't exist in our  database"
            }
          });
        }
      });
    }else{
      resToIncorrectStructure(req,res,"professionalInformation",data);    
    }
  });
};
//put
exports.updateDoctorProfessionalInformation = function(req, res) {
  testDoctorProfessionalInformation(req.body.professionalInformation, function(testApproved,data){
    if (testApproved) {
      models.doctorsAccountInformation.findOne({username:req.params.username}, function(err, doctorAI) {
        if (err) {
          console.log(err);
          res.send({
            error: {
              code:500,
              error:"SomethingWasWrongWithUs",
              info:"This erros happends in our servers, we will try to fix the soon as possible"
            }
          });
        }else if(helpers.isDefined(doctorAI)){
          req.body.professionalInformation.idDAI = doctorAI._id;
          models.doctorsProfessionalInformation.update(
            {idDAI:doctorAI._id},
            req.body.professionalInformation,
            function (err, doctorPI) {
              if (err) {
                console.log(err);
                res.send({
                  error: {
                    code:500,
                    error:"SomethingWasWrongWithUs",
                    info:"This erros happends in our servers, we will try to fix the soon as possible"
                  }
                });
              }else{
                res.send({
                  error: null,
                  doctorProfessionalInformation: doctorPI
                });
              }
            });
        }else{
          res.send({
            error: {
              code:404,
              error:"UsernameNotFound",
              info: "This username doesn't exist in our  database"
            }
          });
        }
      });
    }else{
      resToIncorrectStructure(req,res,"professionalInformation",data);    
    }
  });
};