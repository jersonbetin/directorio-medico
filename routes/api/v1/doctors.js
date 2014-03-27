'use strict'

var models = require('../../../models/models');
var helpers = require('../../../helpers/helpers');
var isDefined = helpers.isDefined;
var encryptString = helpers.encryptString;

var userDataDoctorsModel = models.userDataDoctors;

var personalDataDoctorStructure = {
  "personalDataDoctor" :{
    "identification": {
      "type" : "",
      "number" : ""
    },
    "names" : {
      "first": "",
      "second": ""
    },
    "lastnames" : {
      "first" : "",
      "second" : ""
    },
    "sex": "",
    "birthdate": "",
    "contactData":{
      "home" : {
        "city": "",
        "address": ""
      },
      "phone":{
        "mobile" : "",
        "home": ""
      }
    },
    "nationality": ""
  }
};

var professionalDataDoctorStructure = {
  "profesionalDataDoctor": {
    "professinalCard": {
      "number": "",
      "expeditionDate": ""
    },
    "professionalType": "",
    "isWorking":"",
    "evidence": ""
  }
}

var jobDataDoctorStruture = {
  "jobData":{
    "nit": "",
    "clinic": {
      "name": "",
      "location": {
        "city": "",
        "address": ""
      },
      "phone":{
        "mobile": "",
        "landline": ""
      }
    }
  }
}

var titlesDataDoctorStructure = {
  "titlesData": {
    "title" : "",
    "description" :"" ,
    "university" : "",
    "graduationDate" : ""
  }
}


/* Function that verify is all data necesary for save a doctor has been send correctly*/
var testDoctorData = function(doctorData, contentType, next) {
  contentType = contentType || "application/json";
  if (contentType == "application/json") {
    var data = [];
    var testApproved = true;
    console.log("json");
    if (isDefined(doctorData)) {
      if (isDefined(doctorData.professionalData)) {
        if (isDefined(doctorData.professionalData.professionalCard)) {
          if (isDefined(doctorData.professionalData.professionalCard.number)) {
            data.push({
              "doctorData.professionalData.professionalCard.number":{
                "status": "ok",
                "value": doctorData.professionalData.professionalCard.number
              }
            });
          }else{
            data.push({
              "doctorData.professionaData.professionalCard.number":{
                "status": "error",
                "info": "You must to send a value for this field"
              }
            });
            testApproved=false;
          } 

          if (isDefined(doctorData.professionalData.professionalCard.expeditionDate)) {
            data.push({
              "doctorData.professionalData.professionalCard.expeditionDate":{
                "status": "ok",
                "value": doctorData.professionalData.professionalCard.expeditionDate
              }
            });
          }else{
            data.push({
              "doctorData.professionaData.professionalCard.expeditionDate":{
                "status": "error",
                "info": "You must to send a value for this field"
              }
            });
            testApproved=false;
          }
        }else{
          data.push({
            "doctorData.professionalData.professionalCard":{
              "status": "error",
              "info": "You must to send a professionalCard object"
            }
          });
          testApproved = false;
        }

        if (isDefined(doctorData.professionalData.professionalType)) {
          data.push({
            "doctorData.professionalData.professionalType":{
              "status": "ok",
              "value": doctorData.professionalData.professionalType
            }
          });
        }else{
          data.push({
            "doctorData.professionalData.professionalType":{
              "status": "error",
              "info": "You must to send a value for this field"
            }
          });
          testApproved=false;
        }

        if (isDefined(doctorData.professionalData.isWorking)) {
          data.push({
            "doctorData.professionalData.isWorking":{
              "status": "ok",
              "value": doctorData.professionalData.isWorking
            }
          });
        }else{
          data.push({
            "doctorData.professionalData.isWorking":{
              "status": "error",
              "info": "You must to send a value for this field"
            }
          });
          testApproved=false;
        }

        if (isDefined(doctorData.professionalData.evidence)) {
          data.push({
            "doctorData.professionalData.evidence":{
              "status": "ok",
              "value": doctorData.professionalData.evidence
            }
          });
        }else{
          data.push({
            "doctorData.professionalData.evidence":{
              "status": "error",
              "info": "You must to send a value for this field"
            }
          });
          testApproved=false;
        } 
      }else{
        data.push({
          "doctorData.professionalData":{
            "status": "error",
            "info": "You must to send a professionalData object"
          }
        });
        testApproved = false;
      } 

      if (isDefined(doctorData.jobData)) {
        if (isDefined(doctorData.jobData.nit)) {
          data.push({
            "doctorData.jobData.nit":{
              "status": "ok",
              "value": doctorData.jobData.nit
            }
          });
        }else{
          data.push({
            "doctorData.jobData.nit":{
              "status": "error",
              "info": "You must to send a value for this field"
            }
          });
          testApproved=false;
        }

        if (isDefined(doctorData.jobData.clinic)) {
          if (isDefined(doctorData.jobData.clinic.name)) {
            data.push({
              "doctorData.jobData.clinic.name":{
                "status": "ok",
                "value": doctorData.jobData.clinic.name
              }
            });
          }else{
            data.push({
              "doctorData.jobData.clinic.name":{
                "status": "error",
                "info": "You must to send a value for this field"
              }
            });
            testApproved=false;
          }

          if (isDefined(doctorData.jobData.clinic.location)) {
            if (isDefined(doctorData.jobData.clinic.location.city)) {
              data.push({
                "doctorData.jobData.clinic.location.city":{
                  "status": "ok",
                  "value": doctorData.jobData.clinic.location.city
                }
              });
            }else{
              data.push({
                "doctorData.jobData.clinic.location.city":{
                  "status": "error",
                  "info": "You must to send a value for this field"
                }
              });
              testApproved=false;
            }

            if (isDefined(doctorData.jobData.clinic.location.address)) {
              data.push({
                "doctorData.jobData.clinic.location.address":{
                  "status": "ok",
                  "value": doctorData.jobData.clinic.location.address
                }
              });
            }else{
              data.push({
                "doctorData.jobData.clinic.location.address":{
                  "status": "error",
                  "info": "You must to send a value for this field"
                }
              });
              testApproved=false;
            }
          }else{
            data.push({
              "doctorData.jobData.location":{
                "status": "error",
                "info": "You must to send a location object"
              }
            });
            testApproved=false;
          }

          if (isDefined(doctorData.jobData.clinic.phone)) {
            if (isDefined(doctorData.jobData.clinic.phone.mobile)) {
              data.push({
                "doctorData.jobData.clinic.phone.mobile":{
                  "status": "ok",
                  "value": doctorData.jobData.clinic.phone.mobile
                }
              });
            }else{
              data.push({
                "doctorData.jobData.clinic.phone.mobile":{
                  "status": "error",
                  "info": "You must to send a value for this field"
                }
              });
              testApproved=false;
            }

            if (isDefined(doctorData.jobData.clinic.phone.landline)) {
              data.push({
                "doctorData.jobData.clinic.phone.landline":{
                  "status": "ok",
                  "value": doctorData.jobData.clinic.phone.landline
                }
              });
            }else{
              data.push({
                "doctorData.jobData.clinic.phone.landline":{
                  "status": "error",
                  "info": "You must to send a value for this field"
                }
              });
              testApproved=false;
            }
          }else{
            data.push({
              "doctorData.jobData.phone":{
                "status": "error",
                "info": "You must to send a phone object"
              }
            });
            testApproved=false;
          }
        }else{
          data.push({
            "doctorData.jobData.clinic":{
              "status": "error",
              "info": "You must to send a value for this field"
            }
          });
          testApproved=false;
        }
      }else{
        data.push({
          "doctorData.jobData":{
            "status": "error",
            "info": "You must to send a jobData object"
          }
        });
        testApproved = false;
      }


      


    }else{
      data.push({
        "doctorData":{
          "status": "error",
          "info": "You must to send a doctorData object"
        }
      });
      testApproved = false;
    }
  }
  next(testApproved, data);
};

var testPersonalDataDoctor = function(personalData, next) {
  var data = [];
  var testApproved = true;
  if (isDefined(personalData)) {
    if (isDefined(personalData.identification)) {
      if (isDefined(personalData.identification.type)) {
        if (["TI","CC","Pasaporte"].indexOf(personalData.identification.type)>=0) {
          data.push({
            "personalData.identification.type":{
              "status": "ok",
              "value": personalData.identification.type
            }
          });
        }else{
          data.push({
            "personalData.identification.type":{
              "status": "error",
              "info": "The value of this fiel must be [TI,CC,Pasaporte]"
            }
          });
          testApproved=false;
        }
      }else{
        data.push({
          "personalData.identification.type":{
            "status": "error",
            "info": "You must to send a value for this field"
          }
        });
        testApproved=false;
      }

      if (isDefined(personalData.identification.number)) {
        data.push({
          "personalData.identification.number":{
            "status": "ok",
            "value": personalData.identification.number
          }
        });
      }else{
        data.push({
          "personalData.identification.number":{
            "status": "error",
            "info": "You must to send a value for this field"
          }
        });
        testApproved=false;
      }
    }else{
      data.push({
        "personalData.identification":{
          "status": "error",
          "info": "You must to send a identification object"
        }
      });
      testApproved = false;
    }

    if (isDefined(personalData.names)) {
      if (isDefined(personalData.names.first)) {
        data.push({
          "personalData.names.first":{
            "status": "ok",
            "value": personalData.names.first
          }
        });
      }else{
        data.push({
          "personalData.names.first":{
            "status": "error",
            "info": "You must to send a value for this field"
          }
        });
        testApproved=false;
      }

      if (isDefined(personalData.names.sencond)) {
        data.push({
          "personalData.names.second":{
            "status": "ok",
            "value": personalData.names.second
          }
        });
      }
    }else{
      data.push({
        "personalData.names":{
          "status": "error",
          "info": "You must to send a names object"
        }
      });
      testApproved = false;
    }

    if (isDefined(personalData.lastnames)) {
      if (isDefined(personalData.lastnames.first)) {
        data.push({
          "personalData.lastnames.first":{
            "status": "ok",
            "value": personalData.lastnames.first
          }
        });
      }else{
        data.push({
          "personalData.lastnames.first":{
            "status": "error",
            "info": "You must to send a value for this field"
          }
        });
        testApproved=false;
      }

      if (isDefined(personalData.lastnames.second)) {
        data.push({
          "personalData.lastnames.second":{
            "status": "ok",
            "value": personalData.lastnames.second
          }
        });
      }else{
        data.push({
          "personalData.lastnames.second":{
            "status": "error",
            "info": "You must to send a value for this field"
          }
        });
        testApproved=false;
      }
    }else{
      data.push({
        "personalData.lastnames":{
          "status": "error",
          "info": "You must to send a lastnames object"
        }
      });
      testApproved = false;
    }

    if (isDefined(personalData.sex)) {
      data.push({
        "personalData.sex":{
          "status": "ok",
          "value": personalData.sex
        }
      });
    }else{
      data.push({
        "personalData.sex":{
          "status": "error",
          "info": "You must to send a value for this field"
        }
      });
      testApproved=false;
    }

    if (isDefined(personalData.birthdate)) {
      data.push({
        "personalData.birthdate":{
          "status": "ok",
          "value": personalData.birthdate
        }
      });
    }else{
      data.push({
        "personalData.birthdate":{
          "status": "error",
          "info": "You must to send a value for this field"
        }
      });
      testApproved=false;
    }
    
    if(isDefined(personalData.contactData)){
      if (isDefined(personalData.contactData.home)) {
        if (isDefined(personalData.contactData.home.city)) {
          data.push({
            "personalData.contactData.home.city":{
              "status": "ok",
              "value": personalData.contactData.home.city
            }
          });
        }else{
          data.push({
            "personalData.contactData.home.city":{
              "status": "error",
              "info": "You must to send a value for this field"
            }
          });
          testApproved=false;
        }

        if (isDefined(personalData.contactData.home.address)) {
          data.push({
            "personalData.contactData.home.address":{
              "status": "ok",
              "value": personalData.contactData.home.address
            }
          });
        }else{
          data.push({
            "personalData.contactData.home.address":{
              "status": "error",
              "info": "You must to send a value for this field"
            }
          });
          testApproved=false;
        } 
      }else{
        data.push({
          "personalData.contactData.home":{
            "status": "error",
            "info": "You must to send a home object"
          }
        });
        testApproved = false;
      }

      if (isDefined(personalData.contactData.phone)) {
        if (isDefined(personalData.contactData.phone.mobile)) {
          data.push({
            "personalData.contactData.phone.mobile":{
              "status": "ok",
              "value": personalData.contactData.phone.mobile
            }
          });
        }else{
          data.push({
            "personalData.contactData.phone.mobile":{
              "status": "error",
              "info": "You must to send a value for this field"
            }
          });
          testApproved=false;
        }

        if (isDefined(personalData.contactData.phone.home)) {
          data.push({
            "personalData.contactData.phone.home":{
              "status": "ok",
              "value": personalData.contactData.phone.home
            }
          });
        }else{
          data.push({
            "personalData.contactData.phone.home":{
              "status": "error",
              "info": "You must to send a value for this field"
            }
          });
          testApproved=false;
        }
      }else{
        data.push({
          "personalData.contactData.phone":{
            "status": "error",
            "info": "You must to send a phone object"
          }
        });
        testApproved = false;
      }
    }else{
      data.push({
        "personalData.contactData":{
          "status": "error",
          "info": "You must to send a contactData object"
        }
      });
      testApproved = false;
    }

    if (isDefined(personalData.nationality)) {
      data.push({
        "personalData.nationality":{
          "status": "ok",
          "value": personalData.nationality
        }
      });
    }else{
      data.push({
        "personalData.nationality":{
          "status": "error",
          "info": "You must to send a value for this field"
        }
      });
      testApproved=false;
    }
  }else{
    data.push({
      "personalData":{
        "status": "error",
        "info": "You must to send a personalData object"
      }
    });
    testApproved = false;
  }
  next(testApproved, data);
};

var testTitlesDataDoctor = function(titlesData, next) {
  var data = [];
  var testApproved = true;
  if (isDefined(titlesData)) {
    if (isDefined(titlesData.title)) {
      data.push({
        "titlesData.title":{
          "status": "ok",
          "value": titlesData.title
        }
      });
    }else{
      data.push({
        "titlesData.title":{
          "status": "error",
          "info": "You must to send a value for this field"
        }
      });
      testApproved=false;
    }

    if (isDefined(titlesData.description)) {
      data.push({
        "titlesData.description":{
          "status": "ok",
          "value": titlesData.description
        }
      });
    }else{
      data.push({
        "titlesData.description":{
          "status": "error",
          "info": "You must to send a value for this field"
        }
      });
      testApproved=false;
    }

    if (isDefined(titlesData.university)) {
      data.push({
        "titlesData.university":{
          "status": "ok",
          "value": titlesData.university
        }
      });
    }else{
      data.push({
        "titlesData.university":{
          "status": "error",
          "info": "You must to send a value for this field"
        }
      });
      testApproved=false;
    }

    if (isDefined(titlesData.graduationDate)) {
      data.push({
        "titlesData.graduationDate":{
          "status": "ok",
          "value": titlesData.graduationDate
        }
      });
    }else{
      data.push({
        "titlesData.graduationDate":{
          "status": "error",
          "info": "You must to send a value for this field"
        }
      });
      testApproved=false;
    }
  }else{
    data.push({
      "titlesData":{
        "status": "error",
        "info": "You must to send a titlesData object"
      }
    });
    testApproved = false;
  }
  next(testApproved, data);
};

var resToIncorrectStructure = function(req, res, structureType, data) {
  structureType = structureType || "personalData"
  if (structureType=="personalData") {
    var structure = personalDataDoctorStructure;
  }else if (structureType=="titlesData") {
    var structure = titlesDataDoctorStructure;
  }else if (structureType=="professionalData") {
    var structure = professionalDataDoctorStructure;
  }
  if (isDefined(req.query.errors) && req.query.errors == "verbose") {
    res.send(400,{
      mdStatus:{
        code:4000,
        info: "You have errors in "+structureType+" you have sent",
        errors: {
          data: data
        },
        help: {
          "info": "You "+structureType+" object has to have a structura as follows",
          "structure": structure
        }
      }
    });
  }else{
    res.send(400,{
      mdStatus:{
        code:4000,
        info: "You have errors in personal data you have sent",
        help: {
          "info": "You personalData object has to have a structura as follows",
          "structure": structure
        }
      }
    });
  }
};


/*User Data Doctor*/

//get
exports.getUserDataDoctors = function (req, res) {
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
  models.userDataDoctors.find(criteria, function (err, doctors) {
    if (err) {
      res.send(500);
    }else{
      res.send(doctors);
    }
  });
};

exports.getUserDataDoctorByUsername = function (req, res) {
  var criteria = {};
  var projection = {};
  criteria.username=req.params.username;
  console.log("fields: "+req.query.fields);
  models.userDataDoctors.findOne(criteria, function (err, doctor) {
    if (err) {
      console.log(err);
      res.send(500);
    }else{
      res.send(doctor);
    }
  });
};

//post
exports.saveUserDataDoctor = function (req, res){
  if(isDefined(req.body.email) && isDefined(req.body.username) && isDefined(req.body.password)){
    userDataDoctorsModel.create({
      email: req.body.email,
      username: req.body.username,
      password: encryptString(req.body.password,"secret-password-for-doctor-user-passwords")
    }, function (err, userDataDoctor) {
      if (err) {
        if (err.code==11000) {
          res.send({
            error:{
              code:1,
              info:"Email already registered in our database"
            }
          });
        }else{
          res.send(500);
        }
      }else{
        console.log(userDataDoctor);
        res.send(userDataDoctor);
      }
    });
  }else{
    res.send(400,{
      error:{
        code:400,
        info:"You must to pass a email, username and password values for make this query"
      }
    });
  }
};


/*Personal Data Doctors*/

//get
exports.getPersonalDataDoctor = function (req, res){
  var criteria = {};
  var projection = {};
  criteria.username=req.params.username;
  console.log("fields: "+req.query.fields);
  models.userDataDoctors.findOne(criteria, function (err, doctor) {
    if (err) {
      console.log(err);
      res.send(500);
    }else{
      console.log(doctor);
      if (helpers.isDefined(doctor)) {
        models.personalDataDoctors.findOne({idUserDataDoctor:doctor._id},function (err, personalDataDoctor) {
          if (err) {
            console.log(err);
            res.send(500);
          }else if (personalDataDoctor){
            console.log("datos personales:"+personalDataDoctor);
            res.send(200, {error: null, personalDataDoctor: personalDataDoctor});
          }else{
            res.send(200, {error: null, personalDataDoctor: null});
          }
        });
      }else{
        res.send(401);
      }
    }
  });
}

//post
exports.savePersonalDataDoctor = function (req, res){
  testPersonalDataDoctor(req.body.personalData, function(testApproved,data){
    if (testApproved) {
      models.userDataDoctors.findOne({username:req.params.username}, function(err, userDataDoctor) {
        if (err) {
          console.log(err);
          res.send(500);
        }else if(helpers.isDefined(userDataDoctor)){
          req.body.personalData.idUserDataDoctor = userDataDoctor._id;
          models.personalDataDoctors.create(req.body.personalData, function (err, personalDataDoctor) {
            if (err) {
              if (err.code == 11000) {
                res.send(200,{
                  mdStatus:{
                    code:2010,
                    info: "This username already has an asociated personalData ",
                    help: {
                      "info": "You must to pass the value with update method not with a post method"
                    }
                  }        
                });
              }else{  
                console.log(err);
                res.send(500);
              }
            }else{
              res.send(201,personalDataDoctor);
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
      resToIncorrectStructure(req,res,"personalData",data);    
    }
  });
};

//put
exports.updatePersonalDataDoctor = function(req, res) {
  testPersonalDataDoctor(req.body.personalData, function(testApproved,data){
    if (testApproved) {
      models.userDataDoctors.findOne({username:req.params.username}, function(err, userDataDoctor) {
        if (err) {
          console.log(err);
          res.send(500);
        }else if(helpers.isDefined(userDataDoctor)){
          req.body.personalData.idUserDataDoctor = userDataDoctor._id;
          models.personalDataDoctors.update(
            {idUserDataDoctor:userDataDoctor._id},
            req.body.personalData,
            function (err, personalDataDoctor) {
              if (err) {
                console.log(err);
                res.send(500);
              }else{
                res.send(200,{
                  mdStatus:{
                    code:2000,
                    info: "Personal data doctor successfully updated",
                    url:"localhost:3000/api/v1/doctors/"+userDataDoctor.username+"/personal_data"
                  }
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
      resToIncorrectStructure(req,res,"personalData",data);    
    }
  });
};


/*Titles Data Doctors*/

//get
exports.getTitlesDataDoctor = function(req, res) {
  var criteria = {};
  var projection = {};
  criteria.username=req.params.username;
  console.log("fields: "+req.query.fields);
  models.userDataDoctors.findOne(criteria, function (err, doctor) {
    if (err) {
      console.log(err);
      res.send(500);
    }else{
      console.log(doctor);
      if (helpers.isDefined(doctor)) {
        models.titlesDataDoctors.find({idUserDataDoctor:doctor._id},function (err, titlesDataDoctor) {
          if (err) {
            console.log(err);
            res.send(500);
          }else if (titlesDataDoctor){
            console.log(titlesDataDoctor);
            console.log("titulos:"+titlesDataDoctor);
            res.send(200, {error: null, titlesDataDoctor: titlesDataDoctor});
            // models.universities.findOne({_id:titlesData.idUniversity})
          }else{
            res.send(200, {error: null, titlesDataDoctor: null});
          }
        });
      }else{
        res.send(401);
      }
    }
  });
};

exports.saveTitlesDataDoctor = function (req, res){
  testTitlesDataDoctor(req.body.titlesData, function(testApproved,data){
    if (testApproved) {
      models.userDataDoctors.findOne({username:req.params.username}, function(err, userDataDoctor) {
        if (err) {
          console.log(err);
          res.send(500);
        }else if(helpers.isDefined(userDataDoctor)){
          req.body.titlesData.idUserDataDoctor = userDataDoctor._id;
          models.universities.findOne({_id:req.body.titlesData.university}, function(err, university){
            if (err) {
              console.log(err);
              res.send(500);
            }else if(isDefined(university)){
              console.log("se encontro la U");
              req.body.titlesData.idUniversity = university._id;
              models.titlesDataDoctors.create(req.body.titlesData, function (err, titlesDataDoctor) {
                if (err) {
                  if (err.code == 11000) {
                    res.send(200,{
                      mdStatus:{
                        code:2010,
                        info: "This username already has an asociated titlesData ",
                        help: {
                          "info": "You must to pass the value with the update method not with the post method"
                        }
                      }        
                    });
                  }else{  
                    console.log(err);
                    res.send(500);
                  }
                }else{
                  res.send(201,titlesDataDoctor);
                }
              });
            }else{
              console.log("no se encontro la U");
              res.send("no se va a guardar");
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
      resToIncorrectStructure(req,res,"titlesData", data);    
    }
  });
};

