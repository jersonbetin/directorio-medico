'use strict'


var models = require('../../../../models/models');
var helpers = require('../../../../helpers/helpers');
var isDefined = helpers.isDefined;
var encryptString = helpers.encryptString;
var mails = require("../libs/mails");
var validations = require("./doctors_validation_information");
var fs = require('fs');


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
      info:"The resource you want to get is not in our database"
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
      console.log(doctorPI);
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
  models.doctorsProfessionalInformation.findOne({idDAI:id}).populate("jobInformation").populate("professionalType").exec(function (err, doctorPI) {
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
var r;
function process1(doc, callback){
  if(doc.pri != null){    
    models.doctorsProfessionalInformation.findOne({_id:doc.pri._id}).populate("professionalType").populate("jobInformation")
    .exec(function(err, pri){
      if(err){
        console.log(err);
      }else if(pri){
        doc.pri  = pri;
      }
      if(doc.ti != null){
        models.doctorsTitlesInformation.find({idDAI: doc._id}).populate("idUniversity").exec(function(err, ti){
          if (err) {
            console.log(err);
          }else{
            doc.ti = ti;
            callback(null, doc);
          }
        });
      }else{
        callback(null, doc);
      }
    });
  }else{
    callback(null, doc);
  }
}

var personalCriteria = {};
var professionalCriteria = {};
function f1(err, docs){

  var newDocs = [];
  var len = docs.length;
  // personal information filtering
  if(personalCriteria.name_like){
    console.log("name: "+personalCriteria.name_like);
    for(var i=0; i<len; i++){
      if (docs[i].pei != null && docs[i].pei.names.toLowerCase().indexOf(personalCriteria.name_like.toLowerCase()) != -1) {
        newDocs.push(docs[i]);
      }
    }
    docs = newDocs;
  }

  if(personalCriteria.lastname_like){
    newDocs = [];
    len = docs.length;
    console.log("lastname: "+personalCriteria.lastname_like);
    for(var i=0; i<len; i++){
      if (docs[i].pei != null && docs[i].pei.lastnames.first.toLowerCase().indexOf(personalCriteria.lastname_like.toLowerCase()) != -1) {
        newDocs.push(docs[i]);
      }
    }
    docs = newDocs;
  }

  if(personalCriteria.identification){
    newDocs = [];
    len = docs.length;
    console.log("identification: "+personalCriteria.identification);
    for(var i=0; i<len; i++){
      if (docs[i].pei != null && docs[i].pei.identification.number == personalCriteria.identification) {
        newDocs.push(docs[i]);
      }
    }
    docs = newDocs;
  }

  if(personalCriteria.sex){
    newDocs = [];
    len = docs.length;
    console.log("sexo: "+personalCriteria.sex);
    for(var i=0; i<len; i++){
      if (docs[i].pei != null && docs[i].pei.sex == personalCriteria.sex) {
        newDocs.push(docs[i]);
      }
    }
    docs = newDocs;
  }

  // professional information filtering
  if(professionalCriteria.job_city){
    newDocs = [];
    len = docs.length;
    console.log("city of work: "+ professionalCriteria.job_city);
    for(var i=0; i<len; i++){
      if (docs[i].pri != null && docs[i].pri.jobInformation.clinic.location.city == professionalCriteria.job_city) {
        newDocs.push(docs[i]);
      }
    }
    docs = newDocs;
  }

  if(professionalCriteria.clinic_name){
    newDocs = [];
    len = docs.length;
    console.log("name of the clinic: "+ professionalCriteria.clinic_name);
    for(var i=0; i<len; i++){
      if (docs[i].pri != null && docs[i].pri.jobInformation.clinic.name.toLowerCase() == professionalCriteria.clinic_name.toLowerCase()) {
        newDocs.push(docs[i]);
      }
    }
    docs = newDocs;
  }

  if(professionalCriteria.profession_code){
    newDocs = [];
    len = docs.length;
    console.log("profession code: "+ professionalCriteria.profession_code);
    for(var i=0; i<len; i++){
      if (docs[i].pri != null && docs[i].pri.professionalType._id == professionalCriteria.profession_code) {
        newDocs.push(docs[i]);
      }
    }
    docs = newDocs;
  }

  if(professionalCriteria.professional_card){
    newDocs = [];
    len = docs.length;
    console.log("profession card: "+ professionalCriteria.professional_card);
    for(var i=0; i<len; i++){
      if (docs[i].pri != null && docs[i].pri.professionalCard.number == professionalCriteria.professional_card) {
        newDocs.push(docs[i]);
      }
    }
    docs = newDocs;
  }
  
  personalCriteria = {};
  professionalCriteria = {};
  r.send(docs);
}

exports.getDoctorsInformation = function (req, res){
  var criteria = {};
  if (req.query.register_state) {
    criteria.registerState = req.query.register_state;
  }else{
    criteria.registerState = 2;
  }

  personalCriteria = {};
  if(req.query.name_like){
    personalCriteria.name_like = req.query.name_like;
  }
  if(req.query.lastname_like){
    personalCriteria.lastname_like = req.query.lastname_like;
  }
  if(req.query.identification){
    personalCriteria.identification = req.query.identification;
  }
  if(req.query.sex){
    personalCriteria.sex = req.query.sex;
  }

  var professionCriteria = {};  
  if(req.query.job_city){
    professionalCriteria.job_city = req.query.job_city; 
  }
  if(req.query.clinic_name){
    professionalCriteria.clinic_name = req.query.clinic_name; 
  }
  if(req.query.profession_code){
    professionalCriteria.profession_code = req.query.profession_code; 
  }

  if(req.query.professional_card){
    professionalCriteria.professional_card = req.query.professional_card; 
  }

  // console.log(personalCriteria);

  var async = require("async");
  models.doctorsAccountInformation.find(criteria).populate("pei").populate("pri").populate("ti")
  .exec(function(err, doctors) {
    if (err) {
      console.log(err);
      res500Code(res);
    }else{
      r = res;
      async.map(doctors, process1, f1);
    }
  });
};  

exports.getDoctorsAccountInformation = function (req, res) {
  console.log("########## exports.getDoctorsAccountInformation  ##########");
  var criteria = {};
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
            html: "<h1>Te damos la bienvenida a consulting.</h1><h2>Consulting es nuestra plataforma para que administres todo lo relacionado con consultas medicas.</h2> <p>Hola <h3>"+doctorAI.username+".</h3>Es un placer ofrecerte nuestros servicios, esperamos que te sientas comodo. Por favor ingresa a nuestra plataforma <h3><a href='http://consulting-cordoba.herokuapp.com/'>consulting.com</a></h3>"
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
exports.updateDoctorRegisterStateById = function (req, res){
  if (req.body.registerState && (req.body.registerState==2 || req.body.registerState==3) && req.body.observation) {
    models.doctorsPersonalInformation.findOne({"identification.number": req.params.identification}, function(err, DPI){
      if(err){
        console.log(err);
        res500Code(res);
      }else if(DPI){
        models.doctorsAccountInformation.findOne({_id:DPI.idDAI}, function(err, DAI){
          if(err){
            console.log(err);
            res500Code(res);
          }else if(DAI){
            DAI.registerState = req.body.registerState;
            DAI.observation = req.body.observation;
            DAI.save(function(err, doc){
              var rs = "";
              if(req.body.registerState == 2){
                rs = "Registrado y aprobado"; // ojo ortografia
              }else{
                rs = "Registrado y noaprobado"; // ojo ortografia
              }
              // setup e-mail data with unicode symbols
              var mailOptions = {
                from: "<consulting.cordoba.service@gmail.com>", // sender address
                to: doc.email, // list of receivers
                subject: "Actualizacion del registro de estado", // Subject line
                text: "La secretaria de salud ha actualizado tu estado de registro. Ahora tu estado de registro es: "+rs+". Por favor ingrese a la plataforma y verifique su actualizacion", // plaintext body
                html: "<h2>La secretaria de salud ha actualizado tu estado de registro</h2>. Ahora tu estado de registro es: <strong>"+rs+"</strong>. <p>Por favor ingrese a la plataforma y verifique su actualizacion</p>"
              }

              mails.sendMail(mailOptions);
              
              console.log("se actualizo");
              res.send({error:null, status:"updted successfully", dai: doc});
            }); 
          }else{
            res404Code(res);
          }
        });
      }else{
        res404Code(res);
      }
    });
  }else{
    res.send({error: "You must to send a registerState field and its value must be 2 or 3, and you have to send a observation field, please fix the request"});
  }
};

/*Esta guarda la imagen del doctor*/
exports.saveProfileImageByUsername = function (req, res){
  if(req.body.files.image){
    doctors.findAccountInformationByUsername(req.params.username, res, function(doctorAI){  
      var tmp_path = req.files.image.path;//ruta del archivo
      var random = Math.floor((Math.random()*9999)+1);//Variable aleatoria
      var filename = random+"."+req.files.image.name;//nombre del archivo mas variable aleatoria
      
      var mongo = require('mongodb');
      var Grid = require('gridfs-stream');
      var fs  = require("fs");

      // create or use an existing mongodb-native db instance.
      // for this example we'll just create one:
      var MongoClient = mongo.MongoClient;
      MongoClient.connect('mongodb://consulting:1q2w3e4r@ds049568.mongolab.com:49568/consulting', function (err, db) {
        
        if (err){
          console.log("############ err #################");
          console.log(err);
          console.log("############ err #################");
        }else{
          var gfs = Grid(db, mongo);
          var writestream = gfs.createWriteStream({
            filename: filename
          });
          fs.createReadStream(tmp_path).pipe(writestream);
          console.log("Se guardo ("+filename+")");
          doctorAI.image = filename;
          doctorAI.save(function (err, doctorAI) {
            if(err){
              console.log(err);
              res500Code(res);
            }else{
              res.send({error:null, doctorAI: doctorAI, status:"AI updated successfully"});
            }
          });
        }
      });   
    });
  }
};


/*Doctors Personal Information*/
//get
exports.getDoctorPersonalInformationById = function (req, res){
  console.log("########## exports.getDoctorPersonalInformationById  ##########");
  doctors.findPersonalInformationById(req.session.DAI.id, res, function(doctorPI){
    console.log("datos personales:"+doctorPI);
    res.send({error: null, doctorPersonalInformation: doctorPI});
  });
};

exports.getDoctorPersonalInformationByUsername = function (req, res){  
  console.log("########## exports.getDoctorPersonalInformationByUsername  ##########");
  doctors.findAccountInformationByUsername(req.params.username, res, function(doctorAI){
    console.log(doctorAI);
    doctors.findPersonalInformationById(doctorAI._id, res, function(doctorPI){
      console.log("datos personales:"+doctorPI);
      res.send({error: null, doctorPersonalInformation: doctorPI});
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
      console.log(req.body);
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
              console.log(err);
              res500Code(res);
            }
          }else{
            doctorAI.pei = doctorPI._id;
            doctorAI.save();
            // console.log(doctorAI);
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
                doctorAI.ti.push(doctorTI._id);
                doctorAI.save();
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
                    url:"http://consulting-cordoba.herokuapp.com/api/v1/doctors/"+doctorAI.username+"/titles_data/"+req.params.title_id
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

exports.deleteDoctorTitleInformation = function(req, res) {
  console.log("########## exports.deleteDoctorTitleInformation  ##########");
  models.doctorsTitlesInformation.findOne({_id: req.params.title_id}, function (err, doctorTI) {
    if (err) {
      console.log(err);
      res500Code(res);
    }else if(doctorTI){
      doctorTI.remove();
      res.send({error:null, status:"Delete successfully"});
    }else{
      res404Code(res);
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
  console.log("isWorking: "+req.body.isWorking);
  var professionalInformation = {
    "professionalCard": {
      "number": req.body["professionalCard.number"] 
    },
    "professionalType": req.body.professionalType,
    "isWorking":req.body.isWorking,
    "evidence": req.files.evidence, 
    //If working is yes then
    "jobInformation":{
      "clinic": {
        "nit": req.body["clinic.nit"],
        "name": req.body["clinic.name"],
        "location": {
          "city": req.body["city_clinica"],
          "address": req.body["address_clinica"]
        },
        "phone":{
          "mobile": req.body["mobile_clinica"],
          "landline": req.body["landline_clinica"]
        }
      }
    }
  };
  validations.testDoctorProfessionalInformation(professionalInformation, function(testApproved,data){
    if (testApproved) {
      console.log("Test approved");
      var http = require('http');
      http.get("http://secretariadesalud-cordoba.herokuapp.com/tipoProfesional", function(response){
        var resp = "";
        response.on('data', function (d) {
          resp+=d;
          console.log(resp);
        });
        response.on('end', function() {
          console.log("Respuesta: "+resp);
          resp = JSON.parse(resp);
          var is = false;
          var type = {};
          for(var i=0; i<resp.profesionales.length;i++){
            console.log(resp.profesionales[i]._id);
            if(resp.profesionales[i]._id == professionalInformation.professionalType){
              is = true;
              type["_id"] = resp.profesionales[i]._id;
              type["type"] = resp.profesionales[i].tipo;
              type["description"] = resp.profesionales[i].descripcion;
              break;
            }
          }
          if(is){
            var tmp_path = req.files.evidence.path;//ruta del archivo
            var random = Math.floor((Math.random()*9999)+1);//Variable aleatoria
            var filename = random+"."+req.files.evidence.name;//nombre del archivo mas variable aleatoria
            
            var mongo = require('mongodb');
            var Grid = require('gridfs-stream');
            var fs  = require("fs");

            // create or use an existing mongodb-native db instance.
            // for this example we'll just create one:
            var MongoClient = mongo.MongoClient;
            MongoClient.connect('mongodb://consulting:1q2w3e4r@ds049568.mongolab.com:49568/consulting', function (err, db) {
              
              if (err){
                console.log("############ err #################");
                console.log(err);
                console.log("############ err #################");
              }

              var gfs = Grid(db, mongo);
              var writestream = gfs.createWriteStream({
                filename: filename
              });
              fs.createReadStream(tmp_path).pipe(writestream);
              console.log("Se guardo ("+filename+")");
              // all set!
            });

            professionalInformation.evidence = filename;
            
            console.log(type);
            models.professionalTypes.create(type);

            doctors.findAccountInformationByUsername(req.params.username, res, function(doctorAI){
              console.log("DoctorAI: "+doctorAI);
              professionalInformation.idDAI = doctorAI._id;
              console.log(professionalInformation.isWorking);
              professionalInformation.isWorking = professionalInformation.isWorking.toLowerCase();
              if(professionalInformation.isWorking == "si"){
                console.log("si esta trabajando");
                console.log(professionalInformation.jobInformation);
                models.jobInformation.create(professionalInformation.jobInformation, function(err, ji){
                  if (err) {
                    if (err.code == 11000) {
                      models.jobInformation.findOne({"clinic.nit": professionalInformation.jobInformation.clinic.nit}, function(err, ji){
                        if(err){
                          res500Code(res);
                        }else{
                          professionalInformation.jobInformation = ji._id;
                          models.doctorsProfessionalInformation.create(professionalInformation, function (err, doctorPI) {
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
                              doctorAI.pri = doctorPI._id;
                              doctorAI.save();
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
                    console.log("se guardo la informacion de trabajo");
                    professionalInformation.jobInformation = ji._id;
                    models.doctorsProfessionalInformation.create(professionalInformation, function (err, doctorPI) {
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
                        doctorAI.pri = doctorPI._id;
                        doctorAI.save();        
                        res.send({error: null, doctorProfessionalInformation: doctorPI});
                      }
                    });
                  }
                });          
              }else{
                console.log("no esta trabajando")
                professionalInformation.jobInformation = null;
                models.doctorsProfessionalInformation.create(professionalInformation, function (err, doctorPI) {
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
            res.send({error:"El tipo de professional no esta habilitado e la secretaria de salud"});
          }
        });
        response.on('error', function(e) {
          console.log(e);
          res.send(500);
        });
      });
    }else{
      validations.resToIncorrectStructure(req,res,"professionalInformation",data);    
    }
  });
};

//put
exports.updateDoctorProfessionalInformation = function(req, res) {
  console.log("########## exports.updateDoctorProfessionalInformation  ##########");
  var professionalInformation = {
    "professionalCard": {
      "number": req.body["professionalCard.number"] 
    },
    "professionalType": req.body.professionalType,
    "isWorking":req.body.isWorking,
    "evidence": req.files.evidence, 
    //If working is yes then
    "jobInformation":{
      "clinic": {
        "nit": req.body["clinic.nit"],
        "name": req.body["clinic.name"],
        "location": {
          "city": req.body["city_clinica"],
          "address": req.body["address_clinica"]
        },
        "phone":{
          "mobile": req.body["mobile_clinica"],
          "landline": req.body["landline_clinica"]
        }
      }
    }
  };
  validations.testDoctorProfessionalInformation(professionalInformation, function(testApproved,data){
    if (testApproved) {
      console.log("se aprovo el test");
      var http = require('http');
      http.get("http://secretariadesalud-cordoba.herokuapp.com//tipoProfesional", function(response){
        console.log("aqui 1");
        var resp = "";
        response.on('data', function (d) {
          resp+=d;
        });
        response.on('end', function() {
          console.log("end de los tipos de profesionales");
          resp = JSON.parse(resp);
          var is = false;
          var type = {};
          for(var i=0; i<resp.profesionales.length;i++){
            console.log(resp.profesionales[i]._id);
            if(resp.profesionales[i]._id == professionalInformation.professionalType){
              is = true;
              type["_id"] = resp.profesionales[i]._id;
              type["type"] = resp.profesionales[i].tipo;
              type["decription"] = resp.profesionales[i].decripcion;
              break;
            }
          }
          if (is) {
            console.log("si es un tipo admitido");
            doctors.findAccountInformationByUsername(req.params.username, res, function(doctorAI){
              professionalInformation.idDAI = doctorAI._id;
              var tmp_path = req.files.evidence.path;//ruta del archivo
              var random = Math.floor((Math.random()*9999)+1);//Variable aleatoria
              var filename = random+"."+req.files.evidence.name;//nombre del archivo mas variable aleatoria
              
              var mongo = require('mongodb');
              var Grid = require('gridfs-stream');
              var fs  = require("fs");

              // create or use an existing mongodb-native db instance.
              // for this example we'll just create one:
              var MongoClient = mongo.MongoClient;
              MongoClient.connect('mongodb://consulting:1q2w3e4r@ds049568.mongolab.com:49568/consulting', function (err, db) {
                
                if (err){
                  console.log("############ err #################");
                  console.log(err);
                  console.log("############ err #################");
                }

                var gfs = Grid(db, mongo);
                var writestream = gfs.createWriteStream({
                  filename: filename
                });
                fs.createReadStream(tmp_path).pipe(writestream);
                console.log("Se guardo ("+filename+")");
                // all set!
              });

              professionalInformation.evidence = filename;

              models.professionalTypes.create(type);
              if(professionalInformation.isWorking == "si"){
                console.log("Si esta trabajando");
                models.jobInformation.create(professionalInformation.jobInformation, function(err, ji){
                  if (err) {
                    console.log("#########################");
                    console.log(err);
                    if (err.code == 11000) {
                      models.jobInformation.findOne({"clinic.nit": professionalInformation.jobInformation.clinic.nit}, function(err, ji){
                        if(err){
                          res500Code(res);
                        }else{
                          console.log(ji);
                          professionalInformation.jobInformation = ji._id;
                          models.doctorsProfessionalInformation.update({idDAI:doctorAI._id}, professionalInformation, function (err, doctorPI) {
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
                    professionalInformation.jobInformation = ji._id;
                    models.doctorsProfessionalInformation.update({idDAI:doctorAI._id}, professionalInformation, function (err, doctorPI) {
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
                console.log("no esta trabajando");
                professionalInformation.jobInformation = null;
                console.log(professionalInformation); 
                models.doctorsProfessionalInformation.update({idDAI:doctorAI._id}, professionalInformation, function (err, doctorPI) {
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
            res.send({error:"El tipo de professional no esta habilitado e la secretaria de salud"});
          }
        });
        response.on('error', function(e) {
          console.log("###############################################################");
          console.log(e);
        });
      });
    }else{
      console.log("No se aprovo el test");
      validations.resToIncorrectStructure(req,res,"professionalInformation",data);    
    }
  });
};


var _ai = null;
var _pi = null;
var _pi2 = null;
var _ti = null;
function finalizar(res) {// error al cargar todos los datos del paciente porque se enviavan 4  send como respueta
  var data = [];
  if (_ai && _pi && _pi2 && _ti) {
    data.push({"doctorProfessionalInformation": _pi2});
    data.push({"doctorAccountInformation": _ai});
    data.push({"doctorPersonalInformation": _pi});
    data.push({"doctorTitlesInformation": _ti});
    res.send({error:null, information:data});
    _ai = null;
    _pi = null;
    _pi2 = null;
    _ti = null;
  }
}
exports.getDoctorInformationByUsername = function(req, res) {
  debugger;
  console.log("########## exports.getDoctorInformationByUsername  ##########");
  doctors.findAccountInformationByUsername(req.params.username, res, function(doctorAI){
    _ai = doctorAI;
    finalizar(res);
  });
  doctors.findAccountInformationByUsername(req.params.username, res, function(doctorAI){
    models.doctorsPersonalInformation.findOne({idDAI:doctorAI._id}, function (err, doctorPI) {
      if (err) {
        console.log(err);
        res500Code(res);
      }else if(doctorPI){
        _pi = doctorPI;
        finalizar(res);
      }else{
        _pi = {};
        finalizar(res);
      }
    });
  });
  doctors.findAccountInformationByUsername(req.params.username, res, function(doctorAI){
    models.doctorsTitlesInformation.find({idDAI:doctorAI.id}).populate("idUniversity").exec(function (err, doctorTI) {
      if (err) {
        console.log(err);
        res500Code(res);
      }else{
        _ti = doctorTI;
        finalizar(res);
      }
    });
  });
  doctors.findAccountInformationByUsername(req.params.username, res, function(doctorAI){
    models.doctorsProfessionalInformation.findOne({idDAI:doctorAI.id}).populate("jobInformation").exec(function (err, doctorPI) {
      if (err) {
        console.log(err);
        res500Code(res);
      }else if (doctorPI){
        _pi2=doctorPI;
        finalizar(res);
      }else{
        _pi2={};
        finalizar(res);
      }
    });
  });
};


/*Subir los datos deldoctor a la secretaria*/
var _ais = null;
var _pis = null;
var _pi2s = null;
var _tis = null;
function sendToSecretary(res) {
  console.log("########### sendToSecretary ###############");
  var data = [];
  if (_ais && _pis && _pi2s && _tis) {
    if(_ais != {} && _pis != {} && _pi2s != {} && _tis.length > 0){
      if (_pis.sex=='masculino') {
        _pis.sex='m';
      }else{
        _pis.sex='f';
      }
      var data = JSON.stringify({
        "tIdent": _pis.identification.type,
        "identif": _pis.identification.number,
        "correo":_ais.email,
        "nombre": _pis.names,
        "pApell": _pis.lastnames.first,
        "sApell": _pis.lastnames.second,
        "sexo": _pis.sex,
        "fechaNac": _pis.birthdate,
        "nacionalidad": _pis.nationality,
        "tel": _pis.contactData.phone.home,
        "cel": _pis.contactData.phone.mobile,
        "muncResid": _pis.contactData.home.city,
        "direccion": _pis.contactData.home.address,
        "titulos": _tis,
        "evidencias": _pi2s.evidence,
        "nTarj": _pi2s.professionalCard.number,
        "tipoProfe": _pi2s.professionalType,
        "labora": _pi2s.isWorking,
        "nit": _pi2s.jobInformation.clinic.nit,
        "nombEmpres": _pi2s.jobInformation.clinic.name,
        "municTrab": _pi2s.jobInformation.clinic.location.city,
        "dirEmpr": _pi2s.jobInformation.clinic.location.address,
        "telTrab": _pi2s.jobInformation.clinic.phone.landline
      });
      var options = {
        host: 'secretariadesalud-cordoba.herokuapp.com',
        path: '/doctor/directorio',
        method: 'POST',
        headers : {
          'Content-Type': 'application/json; charset=utf-8'
        }
      };
      var http = require("http");
      var httpreq = http.request(options, function (response) {
        response.on('data', function (chunk) {
          console.log("body: " + chunk);
        });
        response.on('end', function(e) {
          console.log(e);
          res.send({error:null, status:"ok", info: "Data sent to secretary successfully"});
          // _ais = null;
          // _pis = null;
          // _pi2s = null;
          // _tis = null;
        });
        response.on('error', function(e) {
          console.log("Ha ocurrido un error");
          console.log(e);
          res.send({error:e});
          // _ais = null;
          // _pis = null;
          // _pi2s = null;
          // _tis = null;
        });
      });
      httpreq.write(data);
      httpreq.end();
    }else{
      res.send({error:"emptyField", info:"You have some emmpty field in your information that you have to sent to secretary"});
    }
  }else{
    console.log("variables no completas");
  }
}

exports.uploadToSecretary = function(req, res) {
  console.log("########## exports.uploadToSecretary  ##########");
  doctors.findAccountInformationByUsername(req.params.username, res, function(doctorAI){
    _ais = doctorAI;
    sendToSecretary(res);
  });
  doctors.findAccountInformationByUsername(req.params.username, res, function(doctorAI){
    models.doctorsPersonalInformation.findOne({idDAI:doctorAI._id}, function (err, doctorPI) {
      if (err) {
        console.log(err);
        res500Code(res);
      }else if(doctorPI){
        _pis = doctorPI;
        sendToSecretary(res);
      }else{
        _pis = {};
        sendToSecretary(res);
      }
    });
  });
  doctors.findAccountInformationByUsername(req.params.username, res, function(doctorAI){
    models.doctorsTitlesInformation.find({idDAI:doctorAI.id}).populate("idUniversity").exec(function (err, doctorTI) {
      if (err) {
        console.log(err);
        res500Code(res);
      }else{
        _tis = doctorTI;
        sendToSecretary(res);
      }
    });
  });
  doctors.findAccountInformationByUsername(req.params.username, res, function(doctorAI){
    models.doctorsProfessionalInformation.findOne({idDAI:doctorAI.id}).populate("jobInformation").exec(function (err, doctorPI) {
      if (err) {
        console.log(err);
        res500Code(res);
      }else if (doctorPI){
        _pi2s=doctorPI;
        sendToSecretary(res);
      }else{
        _pi2s={};
        sendToSecretary(res);
      }
    });
  });
};
/* Doctor Calendar*/


exports.getDoctorsSpacesForAppointments = function(req, res){
  console.log("######### exports.getDoctorSpacesForAppointments ###########");
  var criteria = {};
  if(req.query.doctor_id){
    criteria["_id"] = req.query.doctor_id;
  }
  if(req.query.year){
    criteria["date.year"] = req.query.year;
  }
  if(req.query.month){
    criteria["date.month"] = req.query.month; 
  }
  if(req.query.day){
    criteria["date.day"] = req.query.day; 
  }
  if(req.query.start){
    criteria["time.start"] = req.query.start; 
  }
  if(req.query.isAvailable){
    criteria["isAvailable"] = req.query.isAvailable; 
  }
  if(req.query.day_start){
    criteria.day = {
      "$gte": req.query.day_start
    } 
  }
  if(req.query.day_end){
    criteria.day = {
      "$lte": req.query.day_end
    } 
  }
  console.log(criteria);
  
  console.log("POr aqui");
  models.doctorsCalendar.find(criteria).populate("appointment.idPatient").exec(function(err, dates){
    if (err) {
      res500Code(res);
    }else{
      res.send({error:null, dates: dates});
    }
  });
};

exports.getDoctorSpacesForAppointmentsByUsername = function(req, res){
  console.log("exports.getDoctorSpacesForAppointmentsByUsername");
  console.log(req.query);
  var criteria = {};
  if(req.query.year){
    criteria["date.year"] = req.query.year;
  }
  if(req.query.month){
    criteria["date.month"] = req.query.month; 
  }
  if(req.query.day){
    criteria["date.day"] = req.query.day; 
  }
  if(req.query.start){
    criteria["time.start"] = req.query.start; 
  }
  if(req.query.isAvailable){
    criteria["isAvailable"] = req.query.isAvailable; 
  }
  if(req.query.day_start){
    criteria["date.day"] = {
      "$gte": req.query.day_start
    }
  }
  if(req.query.day_end){
    criteria["date.day"] = {
      "$lte": req.query.day_end
    }
  }
  if(req.query.day_start && req.query.day_end){
    criteria["date.day"] = {
      "$gte": req.query.day_start,
      "$lte": req.query.day_end
    }
  }

  console.log(criteria);

  doctors.findAccountInformationByUsername(req.params.username, res, function(doctorAI){
    criteria.idDAI = doctorAI._id;
    models.doctorsCalendar.find(criteria).populate("appointment.idPatient").exec(function(err, dates){
      if (err) {
        res500Code(res);
      }else{
        console.log(dates);
        res.send({error:null, dates: dates});
      }
    });
  });
};

exports.getDoctorSpacesForAppointmentsById = function(req, res){
  console.log("exports.getDoctorSpacesForAppointmentsById");
  console.log(req.query);
  var criteria = {};
  if(req.query.year){
    criteria["date.year"] = req.query.year;
  }
  if(req.query.month){
    criteria["date.month"] = req.query.month; 
  }
  if(req.query.day){
    criteria["date.day"] = req.query.day; 
  }
  if(req.query.start){
    criteria["time.start"] = req.query.start; 
  }
  if(req.query.isAvailable){
    criteria["isAvailable"] = req.query.isAvailable; 
  }
  if(req.query.day_start){
    criteria["date.day"] = {
      "$gte": req.query.day_start
    }
  }
  if(req.query.day_end){
    criteria["date.day"] = {
      "$lte": req.query.day_end
    }
  }
  if(req.query.day_start && req.query.day_end){
    criteria["date.day"] = {
      "$gte": req.query.day_start,
      "$lte": req.query.day_end
    }
  }

  console.log(criteria);

  doctors.findAccountInformationById(req.params.doctorId, res, function(doctorAI){
    criteria.idDAI = doctorAI._id;
    models.doctorsCalendar.find(criteria).populate("appointment.idPatient").exec(function(err, dates){
      if (err) {
        res500Code(res);
      }else{
        console.log(dates);
        res.send({error:null, dates: dates});
      }
    });
  });
};

exports.addDoctorSpaceDateForAppointment = function(req, res) {
  doctors.findAccountInformationByUsername(req.params.username, res, function(doctorAI){
    console.log(req.body);
    if(req.body.date && req.body.time){
      var d = new Date(req.body.date);
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
        }else{
          if (date) {
            console.log(date);
            res.send("ya existe un espacio apartado ppor este doctor en esta fecha y a esta hora");
          }else{
            var end;
            if(req.body.time.start % 1 != 0 ){
              end = req.body.time.start - (req.body.time.start%1) + 1
            }else{
              end = parseFloat(req.body.time.start) + 0.3;
            }
            models.doctorsCalendar.create({
              idDAI: doctorAI._id, 
              date: {
                year: req.body.date.year, 
                month: req.body.date.month, 
                day: req.body.date.day
              },
              time: {
                start: req.body.time.start,
                end: end
              } 
            }, function(err, date){
              if (err) {
                console.log(err);
                res500Code(res);
              }else{
                console.log(date);
                res.send(date);
              }
            });
          }
        }
      });
    }else{
      res.send("you have to send a date, time");
    }
  });
};

