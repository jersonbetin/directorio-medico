'use strict'


var models = require('../../../../models/models');
var helpers = require('../../../../helpers/helpers');
var isDefined = helpers.isDefined;
var encryptString = helpers.encryptString;
var mails = require("../libs/mails");
var validations = require("./doctors_validation_information");



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

doctors.findAccountInformationById = function (id, res, next){
  console.log("########## doctors.findAccountInformationById  ##########");
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

doctors.findAccountInformationByUsername = function (username, res, next){
  console.log("########## doctors.findAccountInformationByUsername  ##########");
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

doctors.findPersonalInformationById = function (id, res, next){
  console.log("########## doctors.findPersonalInformationById  ##########");
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

doctors.findTitlesInformationById = function(id, res, next) {
  console.log("########## doctors.findTitlesInformationById  ##########");
  models.doctorsTitlesInformation.find({idDAI:id}).populate("idUniversity").exec(function (err, doctorTI) {
    if (err) {
      console.log(err);
      res500Code(res);
    }else if (doctorTI){
      next(doctorTI);
    }else{
      res404Code(res);
    }
  });
};

doctors.findProfessionalInformationById = function (id, res, next){
  console.log("########## doctors.findProfessionalInformationById  ##########");
  models.doctorsProfessionalInformation.findOne({idDAI:id}).populate("jobInformation").exec(function (err, doctorPI) {
    if (err) {
      console.log(err);
      res500Code(res);
    }else if (doctorPI){
      next(doctorPI);
    }else{
      res404Code(res);
    }
  });
}


/*Doctors Account Information*/
//get
exports.getDoctorsAccountInformation = function (req, res) {
  console.log("########## exports.getDoctorsAccountInformation  ##########");
  var criteria = {};
  var projection = {};
  if(req.query.registerState) {
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

  // console.log("fields: "+req.query.fields);
  console.log("Por aqui");
  models.doctorsAccountInformation.find(criteria, function (err, doctors) {
    if (err) {
      res500Code(res);
    }else{
      res.send(doctors);
    }
  });
};

exports.getDoctorAccountInformationById = function (req, res){
  console.log("########## exports.getDoctorAccountInformationById  ##########");
  doctors.findAccountInformationById(req.session.DAI.id,res, function(doctorAI){
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
  doctors.findAccountInformationByUsername(req.params.username,res, function(doctorAI){
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
        var mailOptions = {
            from: "<consulting.cordoba.service@gmail.com>", // sender address
            to: doctorAI.email, // list of receivers
            subject: "Bienvenido a Cosulting", // Subject line
            text: "Te damos la bienvenida a consulting, nuestra plataforma para que administres todo lo relacionado con consultas medicas. Hola"+doctorAI.username+". Es un placer ofrecerte nuestros servicios, esperamos que te sientas comodo. Por favor ingresa a nuestra plataforma consultinn.com", // plaintext body
            html: "<h1>Te damos la bienvenida a consulting.</h1><h2>Consulting es nuestra plataforma para que administres todo lo relacionado con consultas medicas.</h2> <p>Hola <h3>"+doctorAI.username+".</h3>Es un placer ofrecerte nuestros servicios, esperamos que te sientas comodo. Por favor ingresa a nuestra plataforma <h3><a href='http://localhost:3000'>consulting.com</a></h3>"
          }

        mails.sendMail(mailOptions);
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

//put
exports.updateDoctorRegisterStateByUsernameFromSecretary = function (req, res){
  if (req.body.registerState && (req.body.registerState == 0 || req.body.registerState==1 || req.body.registerState==2 || req.body.registerState==3)) {
    doctors.findAccountInformationByUsername(req.params.username, res, function(doctorAI){
      doctorAI.registerState = req.body.registerState;
      doctorAI.save(function(err, doctorAI){
        if(err){
          res500Code(res);
        }else{
          var rs = "";
          if(doctorAI.registerState == 0){
            rs = "Registrado pero no en estudio";
          }else if(doctorAI.registerState == 1){
            rs = "Registrado y en estudio";
          }else if(doctorAI.registerState == 2){
            rs = "Registrado y aprovado";
          }else{
            rs = "Registrado y no aprovado";
          }
          // setup e-mail data with unicode symbols
          var mailOptions = {
            from: "<consulting.cordoba.service@gmail.com>", // sender address
            to: doctorAI.email, // list of receivers
            subject: "Actualizacion del registro de estado", // Subject line
            text: "La secretaria de salud ha actualizado tu estado de registro. Ahora tu estado de registro es: "+rs+". Por favor ingrese a la plataforma y verifique su actualizacion", // plaintext body
            html: "<h2>La secretaria de salud ha actualizado tu estado de registro</h2>. Ahora tu estado de registro es: <strong>"+rs+"</strong>. <p>Por favor ingrese a la plataforma y verifique su actualizacion</p>"
          }

          mails.sendMail(mailOptions);
          res.send(200);
        }
      });
    });
  }else{
    res.send({error: "You must to send a registerState field and its value must be 0, 1, 2 or 3, please fix the request"});
  }
};


/*Doctors Personal Information*/
//get
exports.getDoctorPersonalInformationById = function (req, res){
  console.log("########## exports.getDoctorPersonalInformationById  ##########");
  doctors.findPersonalInformationById(req.session.DAI.id, res, function(doctorPI){
    console.log("datos personales:"+doctorPI);
    res.send(200, {error: null, doctorPersonalInformation: doctorPI});
  });
};

exports.getDoctorPersonalInformationByUsername = function (req, res){  
  console.log("########## exports.getDoctorPersonalInformationByUsername  ##########");
  doctors.findAccountInformationByUsername(req.params.username, res, function(doctorAI){
    console.log(doctorAI);
    doctors.findPersonalInformationById(doctorAI._id, res, function(doctorPI){
      console.log("datos personales:"+doctorPI);
      res.send(200, {error: null, doctorPersonalInformation: doctorPI});
    });
  });
};

//post
exports.saveDoctorPersonalInformation = function (req, res){
  console.log("########## exports.saveDoctorPersonalInformation  ##########");
  validations.testDoctorPersonalInformation(req.body.personalInformation, function(testApproved,data){
    if (testApproved) {
      console.log("Test approved");
      console.log(req.params.username);
      doctors.findAccountInformationByUsername(req.params.username, res, function(doctorAI){
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
      validations.resToIncorrectStructure(req,res,"personalInformation",data);    
    }
  });
};

//put
exports.updateDoctorPersonalInformation = function(req, res) {
  console.log("########## exports.updateDoctorPersonalInformation  ##########");
  validations.testDoctorPersonalInformation(req.body.personalInformation, function(testApproved,data){
    if (testApproved) {
      doctors.findAccountInformationByUsername(req.params.username, res, function(doctorAI){
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
      validations.resToIncorrectStructure(req,res,"personalInformation",data);    
    }
  });
};


/*Doctors TItles Information*/
//get
exports.getDoctorTitlesInformationById = function(req, res) {
  console.log("########## exports.getDoctorTitlesInformationById  ##########");
  doctors.findTitlesInformationById(req.session.DAI.id, res, function(doctorTI){
    res.send(200, {error: null, doctorTitlesInformation: doctorTI});
  });
};

exports.getDoctorsTitlesInformationByUsername = function(req, res) {
  console.log("########## exports.getDoctorsTitlesInformationByUsername  ##########");
  criteria.username=req.params.username;
  doctors.findAccountInformationByUsername(req.params.username, res, function(doctorAI){
    doctors.findTitlesInformationById(doctorAI.id, res, function(doctorTI){
      res.send(200, {error: null, doctorTitlesInformation: doctorTI});
    });
  });
};

//post
exports.saveDoctorTitleInformation = function (req, res){
  console.log("########## exports.saveDoctorTitleInformation  ##########");
  validations.testDoctorTitleInformation(req.body.titleInformation, function(testApproved,data){
    if (testApproved) {
      console.log(req.params.username);
      doctors.findAccountInformationByUsername(req.params.username, res, function(doctorAI){
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
      validations.resToIncorrectStructure(req,res,"titleInformation", data);    
    }
  });
};

//put
exports.updateDoctorTitleInformation = function(req, res) {
  console.log("########## exports.updateDoctorTitleInformation  ##########");
  validations.testDoctorTitleInformation(req.body.titleInformation, function(testApproved,data){
    if (testApproved) {
      doctors.findAccountInformationByUsername(req.params.username, res, function(doctorAI){
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
                res500Code(res);
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
      validations.resToIncorrectStructure(req,res,"titleInformation",data);    
    }
  });
};


/*Doctors Professional Information*/
//get
exports.getDoctorProfessionalInformationById = function (req, res){
  console.log("########## exports.getDoctorProfessionalInformationById  ##########");
  doctors.findProfessionalInformationById(req.session.DAI.id, res, function(doctorPI){
    res.send(200, {error: null, doctorProfessionalInformation: doctorPI});
  });
}

exports.getDoctorProfessionalInformationByUsername = function (req, res){
  console.log("########## exports.getDoctorProfessionalInformationByUsername  ##########");
  doctors.findAccountInformationByUsername(req.params.username, res, function(doctorAI){
    doctors.findProfessionalInformationById(doctorAI._id, res, function(doctorPI){
      res.send(200, {error: null, doctorProfessionalInformation: doctorPI});
    });
  });
}

//post
exports.saveDoctorProfessionalInformation = function (req, res){
  console.log("########## exports.saveDoctorProfessionalInformation  ##########");
  console.log(req.body.professionalInformation);
  validations.testDoctorProfessionalInformation(req.body.professionalInformation, function(testApproved,data){
    if (testApproved) {
      console.log("Test approved");
      doctors.findAccountInformationByUsername(req.params.username, res, function(doctorAI){
        req.body.professionalInformation.idDAI = doctorAI._id;
        if(req.body.professionalInformation.isWorking == "si"){
          models.jobInformation.create(req.body.professionalInformation.jobInformation, function(err, ji){
            if (err) {
              if (err.code == 11000) {
                models.jobInformation.findOne({"clinic.nit": req.body.professionalInformation.jobInformation.clinic.nit}, function(err, ji){
                  if(err){
                    res500Code(res);
                  }else{
                    req.body.professionalInformation.jobInformation = ji._id;
                    models.doctorsProfessionalInformation.create(req.body.professionalInformation, function (err, doctorPI) {
                      if (err) {
                        if (err.code == 11000) {
                          res.send({
                            error: {
                              code:200,
                              error:"ProfessionalInformationAlreadySaved",
                              info:"This username already has an asociated personalInformation for udate use PUT instead POST"
                            }
                          });
                        }else{  
                          console.log(err);
                          res500Code(res);
                        }
                      }else{
                        res.send({error: null, doctorProfessionalInformation: doctorPI});
                      }
                    });
                  }
                });
              }else{  
                console.log(err);
                res500Code(res);
              }
            }else{
              req.body.professionalInformation.jobInformation = ji._id;
              models.doctorsProfessionalInformation.create(req.body.professionalInformation, function (err, doctorPI) {
                if (err) {
                  if (err.code == 11000) {
                    res.send({
                      error: {
                        code:200,
                        error:"ProfessionalInformationAlreadySaved",
                        info:"This username already has an asociated personalInformation for udate use PUT instead POST"
                      }
                    });
                  }else{  
                    console.log(err);
                    res500Code(res);
                  }
                }else{
                  res.send({error: null, doctorProfessionalInformation: doctorPI});
                }
              });
            }
          })          
        }else{
          req.body.personalInformation.jobInformation = null;
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
                res500Code(res);
              }
            }else{
              res.send({error: null, doctorProfessionalInformation: doctorPI});
            }
          });
        }
      });
    }else{
      validations.resToIncorrectStructure(req,res,"professionalInformation",data);    
    }
  });
};

//put
exports.updateDoctorProfessionalInformation = function(req, res) {
  console.log("########## exports.updateDoctorProfessionalInformation  ##########");
  validations.testDoctorProfessionalInformation(req.body.professionalInformation, function(testApproved,data){
    if (testApproved) {
      doctors.findAccountInformationByUsername(req.params.username, res, function(doctorAI){
        req.body.professionalInformation.idDAI = doctorAI._id;
        if(req.body.professionalInformation.isWorking == "si"){
          models.jobInformation.create(req.body.professionalInformation.jobInformation, function(err, ji){
            if (err) {
              console.log("#########################");
              console.log(err);
              if (err.code == 11000) {
                models.jobInformation.findOne({"clinic.nit": req.body.professionalInformation.jobInformation.clinic.nit}, function(err, ji){
                  if(err){
                    res500Code(res);
                  }else{
                    console.log(ji);
                    req.body.professionalInformation.jobInformation = ji._id;
                    models.doctorsProfessionalInformation.update({idDAI:doctorAI._id}, req.body.professionalInformation, function (err, doctorPI) {
                      if (err) {
                        console.log(err);
                        res500Code(res);
                      }else{
                        res.send({error: null, doctorProfessionalInformation: "updated successfully" });
                      }
                    });
                  }
                });
              }else{  
                console.log(err);
                res500Code(res);
              }
            }else{
              req.body.professionalInformation.jobInformation = ji._id;
              models.doctorsProfessionalInformation.update({idDAI:doctorAI._id}, req.body.professionalInformation, function (err, doctorPI) {
                if (err) {
                  console.log(err);
                  res500Code(res);
                }else{
                  res.send({error: null, doctorProfessionalInformation: "updated successfully" });
                }
              });
            }
          })           
        }else{
          req.body.professionalInformation.jobInformation = null;
          models.doctorsProfessionalInformation.update({idDAI:doctorAI._id}, req.body.professionalInformation, function (err, doctorPI) {
            if (err) {
              console.log(err);
              res500Code(res);
            }else{
              res.send({error: null, doctorProfessionalInformation: "updated successfully"});
            }
          });
        }
      });
    }else{
      validations.resToIncorrectStructure(req,res,"professionalInformation",data);    
    }
  });
};


var _pi = null;
var _pi2 = null;
var _ti = null;
function finalizar(res) {
  if (_accountInformation && _personalInformation && _professionalInformation && _titlesInformation) {
    var data = querystring.stringify({
      "tIdent": _pi.identification.type,
      "ident": _pi.identification.number,
      "nombre": _pi.names,
      "pApell": _pi.lastnames.first,
      "sApell": _pi.lastnames.second,
      "sexo": _pi.sex,
      "fechaNac": _pi.birthdate,
      "nacionalidad": _pi.nationality,
      "tel": _pi.contactData.phone.home,
      "cel": _pi.contactData.phone.mobile,
      "muncResid": _pi.contactData.home.city,
      "direccion": _pi.contactData.home.address,
      "titulos": ti,
      "nTarj": _pi2.professionalCard.number,
      "tipoProfe": _pi2.professionalType,
      "labora": _pi2.isWorking,
      "nit": _pi2.jobInformation.clinic.nit,
      "nombEmpresa": _pi2.jobInformation.clinic.name,
      "municTrab": _pi2.jobInformation.location.city,
      "dirEmpr": _pi2.jobInformation.location.address,
      "telTrab": _pi2.jobInformation.phone.landline
    });

    var options = {
      host: 'localhost',
      port: '4000',
      path: '/medicos',
      method: 'POST',
      headers : {
        'Content-Type': 'application/json; charset=utf-8'
      }
    };

    var httpreq = http.request(options, function (response) {
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        console.log("body: " + chunk);
      });
      response.on('end', function() {
        res.send(200);
      })
    });
    httpreq.write(data);
    httpreq.end();
  }
}
/*Subir los datos deldoctor a la secretaria*/
exports.uploadToSecretary = function(req, res) {
  
};

/* Doctor Calendar*/
exports.addDoctorSpaceDateForAppointment = function(req, res) {
  console.log(req.body);
  if(req.body.date && req.body.startTime && req.body.endTime){
    
  }
  res.send(200);
};