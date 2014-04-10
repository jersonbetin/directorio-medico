'use strict'

var models = require('../../../models/models');
var helpers = require('../../../helpers/helpers');
var isDefined = helpers.isDefined;
var encryptString = helpers.encryptString;

var userDataDoctorsModel = models.userDataDoctors;

var doctorPersonalInformationStructure = {
  "doctorPersonalInformation" :{
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

var titleDataDoctorStructure = {
  "titleData": {
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

var testDoctorPersonalInformation = function(personalInformation, next) {
  var data = [];
  var testApproved = true;
  // console.log(personalInformation);
  if (isDefined(personalInformation)) {
    if (isDefined(personalInformation.identification)) {
      if (isDefined(personalInformation.identification.type)) {
        if (["TI","CC","Pasaporte"].indexOf(personalInformation.identification.type)>=0) {
          data.push({
            "personalInformation.identification.type":{
              "status": "ok",
              "value": personalInformation.identification.type
            }
          });
        }else{
          data.push({
            "personalInformation.identification.type":{
              "status": "error",
              "info": "The value of this fiel must be [TI,CC,Pasaporte]"
            }
          });
          testApproved=false;
        }
      }else{
        data.push({
          "personalInformation.identification.type":{
            "status": "error",
            "info": "You must to send a value for this field"
          }
        });
        testApproved=false;
      }

      if (isDefined(personalInformation.identification.number)) {
        data.push({
          "personalInformation.identification.number":{
            "status": "ok",
            "value": personalInformation.identification.number
          }
        });
      }else{
        data.push({
          "personalInformation.identification.number":{
            "status": "error",
            "info": "You must to send a value for this field"
          }
        });
        testApproved=false;
      }
    }else{
      data.push({
        "personalInformation.identification":{
          "status": "error",
          "info": "You must to send a identification object"
        }
      });
      testApproved = false;
    }

    if (isDefined(personalInformation.names)) {
      if (isDefined(personalInformation.names.first)) {
        data.push({
          "personalInformation.names.first":{
            "status": "ok",
            "value": personalInformation.names.first
          }
        });
      }else{
        data.push({
          "personalInformation.names.first":{
            "status": "error",
            "info": "You must to send a value for this field"
          }
        });
        testApproved=false;
      }

      if (isDefined(personalInformation.names.sencond)) {
        data.push({
          "personalInformation.names.second":{
            "status": "ok",
            "value": personalInformation.names.second
          }
        });
      }
    }else{
      data.push({
        "personalInformation.names":{
          "status": "error",
          "info": "You must to send a names object"
        }
      });
      testApproved = false;
    }

    if (isDefined(personalInformation.lastnames)) {
      if (isDefined(personalInformation.lastnames.first)) {
        data.push({
          "personalInformation.lastnames.first":{
            "status": "ok",
            "value": personalInformation.lastnames.first
          }
        });
      }else{
        data.push({
          "personalInformation.lastnames.first":{
            "status": "error",
            "info": "You must to send a value for this field"
          }
        });
        testApproved=false;
      }

      if (isDefined(personalInformation.lastnames.second)) {
        data.push({
          "personalInformation.lastnames.second":{
            "status": "ok",
            "value": personalInformation.lastnames.second
          }
        });
      }else{
        data.push({
          "personalInformation.lastnames.second":{
            "status": "error",
            "info": "You must to send a value for this field"
          }
        });
        testApproved=false;
      }
    }else{
      data.push({
        "personalInformation.lastnames":{
          "status": "error",
          "info": "You must to send a lastnames object"
        }
      });
      testApproved = false;
    }

    if (isDefined(personalInformation.sex)) {
      data.push({
        "personalInformation.sex":{
          "status": "ok",
          "value": personalInformation.sex
        }
      });
    }else{
      data.push({
        "personalInformation.sex":{
          "status": "error",
          "info": "You must to send a value for this field"
        }
      });
      testApproved=false;
    }

    if (isDefined(personalInformation.birthdate)) {
      data.push({
        "personalInformation.birthdate":{
          "status": "ok",
          "value": personalInformation.birthdate
        }
      });
    }else{
      data.push({
        "personalInformation.birthdate":{
          "status": "error",
          "info": "You must to send a value for this field"
        }
      });
      testApproved=false;
    }
    
    if(isDefined(personalInformation.contactData)){
      if (isDefined(personalInformation.contactData.home)) {
        if (isDefined(personalInformation.contactData.home.city)) {
          data.push({
            "personalInformation.contactData.home.city":{
              "status": "ok",
              "value": personalInformation.contactData.home.city
            }
          });
        }else{
          data.push({
            "personalInformation.contactData.home.city":{
              "status": "error",
              "info": "You must to send a value for this field"
            }
          });
          testApproved=false;
        }

        if (isDefined(personalInformation.contactData.home.address)) {
          data.push({
            "personalInformation.contactData.home.address":{
              "status": "ok",
              "value": personalInformation.contactData.home.address
            }
          });
        }else{
          data.push({
            "personalInformation.contactData.home.address":{
              "status": "error",
              "info": "You must to send a value for this field"
            }
          });
          testApproved=false;
        } 
      }else{
        data.push({
          "personalInformation.contactData.home":{
            "status": "error",
            "info": "You must to send a home object"
          }
        });
        testApproved = false;
      }

      if (isDefined(personalInformation.contactData.phone)) {
        if (isDefined(personalInformation.contactData.phone.mobile)) {
          data.push({
            "personalInformation.contactData.phone.mobile":{
              "status": "ok",
              "value": personalInformation.contactData.phone.mobile
            }
          });
        }else{
          data.push({
            "personalInformation.contactData.phone.mobile":{
              "status": "error",
              "info": "You must to send a value for this field"
            }
          });
          testApproved=false;
        }

        if (isDefined(personalInformation.contactData.phone.home)) {
          data.push({
            "personalInformation.contactData.phone.home":{
              "status": "ok",
              "value": personalInformation.contactData.phone.home
            }
          });
        }else{
          data.push({
            "personalInformation.contactData.phone.home":{
              "status": "error",
              "info": "You must to send a value for this field"
            }
          });
          testApproved=false;
        }
      }else{
        data.push({
          "personalInformation.contactData.phone":{
            "status": "error",
            "info": "You must to send a phone object"
          }
        });
        testApproved = false;
      }
    }else{
      data.push({
        "personalInformation.contactData":{
          "status": "error",
          "info": "You must to send a contactData object"
        }
      });
      testApproved = false;
    }

    if (isDefined(personalInformation.nationality)) {
      data.push({
        "personalInformation.nationality":{
          "status": "ok",
          "value": personalInformation.nationality
        }
      });
    }else{
      data.push({
        "personalInformation.nationality":{
          "status": "error",
          "info": "You must to send a value for this field"
        }
      });
      testApproved=false;
    }
  }else{
    data.push({
      "personalInformation":{
        "status": "error",
        "info": "You must to send a personalInformation object"
      }
    });
    testApproved = false;
  }
  next(testApproved, data);
};

var testTitlesDataDoctor = function(titleData, next) {
  var data = [];
  var testApproved = true;
  if (isDefined(titleData)) {
    if (isDefined(titleData.title)) {
      data.push({
        "titleData.title":{
          "status": "ok",
          "value": titleData.title
        }
      });
    }else{
      data.push({
        "titleData.title":{
          "status": "error",
          "info": "You must to send a value for this field"
        }
      });
      testApproved=false;
    }

    if (isDefined(titleData.description)) {
      data.push({
        "titleData.description":{
          "status": "ok",
          "value": titleData.description
        }
      });
    }else{
      data.push({
        "titleData.description":{
          "status": "error",
          "info": "You must to send a value for this field"
        }
      });
      testApproved=false;
    }

    if (isDefined(titleData.university)) {
      data.push({
        "titleData.university":{
          "status": "ok",
          "value": titleData.university
        }
      });
    }else{
      data.push({
        "titleData.university":{
          "status": "error",
          "info": "You must to send a value for this field"
        }
      });
      testApproved=false;
    }

    if (isDefined(titleData.graduationDate)) {
      data.push({
        "titleData.graduationDate":{
          "status": "ok",
          "value": titleData.graduationDate
        }
      });
    }else{
      data.push({
        "titleData.graduationDate":{
          "status": "error",
          "info": "You must to send a value for this field"
        }
      });
      testApproved=false;
    }
  }else{
    data.push({
      "titleData":{
        "status": "error",
        "info": "You must to send a titleData object"
      }
    });
    testApproved = false;
  }
  next(testApproved, data);
};

var resToIncorrectStructure = function(req, res, structureType, data) {
  structureType = structureType || "personalInformation"
  if (structureType=="personalInformation") {
    var structure = doctorPersonalInformationStructure;
  }else if (structureType=="titleData") {
    var structure = titleDataDoctorStructure;
  }else if (structureType=="professionalData") {
    var structure = professionalDataDoctorStructure;
  }
  if (isDefined(req.query.errors) && req.query.errors == "verbose") {
    res.send({
      error: {
        code:400,
        error:"BadStructureSent",
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
    res.send({
      error: {
        code:400,
        error:"BadStructureSent",
        info: "You have errors in "+structureType+" you have sent",
        help: {
          "info": "You "+structureType+" object has to have a structura as follows",
          "structure": structure
        }
      }    
    });
  }
};


/*Doctors Account Information*/

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
  console.log("#################### getUserDataDoctorById  ####################");
  models.doctorsAccountInformation.findOne({_id:req.session.DAI.id}, function(err, doctorAI){
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
      res.send({
        error:null,
        doctorAccountInformation:{
          email: doctorAI.email,
          username: doctorAI.username,
          registerState: doctorAI.registerState,
          registerDate: doctorAI.createdDate
        }
      });
    }else{
      res.send({
        error: {
          code:404,
          error:"UserDataDoctorIdNotFound",
          info:""
        }
      });
    }
  });
};

exports.getDoctorAccountInformationByUsername = function (req, res) {
  console.log("#################### getUserDataDoctorByUsername  ####################");
  var criteria = {};
  var projection = {};
  criteria.username=req.params.username;
  console.log("fields: "+req.query.fields);
  console.log("params: "+req.params);
  models.doctorsAccountInformation.findOne(criteria, function (err, doctorAI) {
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
      res.send({
        error:null,
        doctorAccountInformation:{
          email: doctorAI.email,
          username: doctorAI.username,
          registerState: doctorAI.registerState,
          registerDate: doctorAI.createdDate
        }
      });
    }else{
      res.send({
        error: {
          code:404,
          error:"DoctorAIUsernameNotFound",
          info:""
        }
      });
    }
  });
};

//post
exports.saveDoctorAccountInformation = function (req, res){
  console.log("#################### saveDoctorAccountInformation  ####################");
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
          res.send({
        error: {
          code:500,
          error:"SomethingWasWrongWithUs",
          info:"This erros happends in our servers, we will try to fix the soon as possible"
        }
      });
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


/*Doctors Personal Informatio*/

//get
exports.getDoctorPersonalInformationById = function (req, res){
  console.log("#################### getDoctorPersonalInformationById  ####################");
  var criteria = {};
  var projection = {};
  models.doctorsPersonalInformation.findOne({idDAI:req.session.DAI.id},function (err, doctorPI) {
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
      console.log("datos personales:"+doctorPI);
      res.send(200, {error: null, doctorPersonalInformation: doctorPI});
    }else{
      console.log("Doctor npersonal information not found");
      res.send(200, {error: null, doctorPersonalInformation: null});
    }
  });
}

exports.getDoctorPersonalInformationByUsername = function (req, res){
  console.log("#################### getDoctorPersonalInformationByUsername  ####################");
  var criteria = {};
  var projection = {};
  criteria.username=req.params.username;
  models.doctorsAccountInformation.findOne(criteria, function (err, doctorAI) {
    if (err) {
      console.log(err);
      res.send({
        error: {
          code:500,
          error:"SomethingWasWrongWithUs",
          info:"This erros happends in our servers, we will try to fix the soon as possible"
        }
      });
    }else if (doctorAI) {
      models.doctorsPersonalInformation.findOne({idDAI:doctorAI._id},function (err, doctorPI) {
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
          console.log("datos personales:"+doctorPI);
          res.send(200, {error: null, doctorPersonalInformation: doctorPI});
        }else{
          res.send(200, {error: null, doctorPersonalInformation: null});
        }
      }); 
    }else{
      res.send(404);
    }
  });
}

//post
exports.saveDoctorPersonalInformation = function (req, res){
  console.log("#################### saveDoctorPersonalInformation  ####################");
  testDoctorPersonalInformation(req.body.personalInformation, function(testApproved,data){
    if (testApproved) {
      console.log("Test approved");
      console.log(req.params.username);
      models.doctorsAccountInformation.findOne({username:req.params.username}, function(err, doctorAccountInformation) {
        if (err) {
          console.log(err);
          res.send({
            error: {
              code:500,
              error:"SomethingWasWrongWithUs",
              info:"This erros happends in our servers, we will try to fix the soon as possible"
            }
          });
        }else if(doctorAccountInformation){
          req.body.personalInformation.idDAI = doctorAccountInformation._id;
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
                doctorPersonalInformation: doctorPI
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
      resToIncorrectStructure(req,res,"personalInformation",data);    
    }
  });
};

//put
exports.updateDoctorPersonalInformation = function(req, res) {
  testDoctorPersonalInformation(req.body.personalInformation, function(testApproved,data){
    if (testApproved) {
      models.doctorsAccountInformation.findOne({username:req.params.username}, function(err, doctorAccountInformation) {
        if (err) {
          console.log(err);
          res.send({
            error: {
              code:500,
              error:"SomethingWasWrongWithUs",
              info:"This erros happends in our servers, we will try to fix the soon as possible"
            }
          });
        }else if(helpers.isDefined(doctorAccountInformation)){
          req.body.personalInformation.idDAI = doctorAccountInformation._id;
          models.doctorsPersonalInformation.update(
            {idUserDataDoctor:doctorAccountInformation._id},
            req.body.personalInformation,
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
                  doctorPersonalInformation: doctorPI
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
      resToIncorrectStructure(req,res,"personalInformation",data);    
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
      res.send({
        error: {
          code:500,
          error:"SomethingWasWrongWithUs",
          info:"This erros happends in our servers, we will try to fix the soon as possible"
        }
      });
    }else{
      console.log(doctor);
      if (helpers.isDefined(doctor)) {
        models.titlesDataDoctors.find({idUserDataDoctor:doctor._id},function (err, titlesDataDoctor) {
          if (err) {
            console.log(err);
            res.send({
        error: {
          code:500,
          error:"SomethingWasWrongWithUs",
          info:"This erros happends in our servers, we will try to fix the soon as possible"
        }
      });
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

exports.getTitleDataDoctorById = function(req, res) {
  var criteria = {};
  var projection = {};
  criteria.username=req.params.username;
  console.log("fields: "+req.query.fields);
  models.userDataDoctors.findOne(criteria, function (err, doctor) {
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
      console.log(doctor);
      console.log("idTitle: "+req.params.title_id);
      if (helpers.isDefined(doctor)) {
        models.titlesDataDoctors.find({
          idUserDataDoctor:doctor._id,
          _id:req.params.title_id
        },function (err, titlesDataDoctor) {
          if (err) {
            console.log(err);
            res.send({
        error: {
          code:500,
          error:"SomethingWasWrongWithUs",
          info:"This erros happends in our servers, we will try to fix the soon as possible"
        }
      });
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

//post
exports.saveTitlesDataDoctor = function (req, res){
  testTitlesDataDoctor(req.body.titlesData, function(testApproved,data){
    if (testApproved) {
      models.userDataDoctors.findOne({username:req.params.username}, function(err, doctorAccountInformation) {
        if (err) {
          console.log(err);
          res.send({
        error: {
          code:500,
          error:"SomethingWasWrongWithUs",
          info:"This erros happends in our servers, we will try to fix the soon as possible"
        }
      });
        }else if(helpers.isDefined(doctorAccountInformation)){
          req.body.titlesData.idUserDataDoctor = doctorAccountInformation._id;
          models.universities.findOne({_id:req.body.titlesData.university}, function(err, university){
            if (err) {
              console.log(err);
              res.send({
        error: {
          code:500,
          error:"SomethingWasWrongWithUs",
          info:"This erros happends in our servers, we will try to fix the soon as possible"
        }
      });
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
                    res.send({
        error: {
          code:500,
          error:"SomethingWasWrongWithUs",
          info:"This erros happends in our servers, we will try to fix the soon as possible"
        }
      });
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

//put
exports.updateTitleDataDoctor = function(req, res) {
  testTitlesDataDoctor(req.body.titleData, function(testApproved,data){
    if (testApproved) {
      models.userDataDoctors.findOne({username:req.params.username}, function(err, doctorAccountInformation) {
        if (err) {
          console.log(err);
          res.send({
        error: {
          code:500,
          error:"SomethingWasWrongWithUs",
          info:"This erros happends in our servers, we will try to fix the soon as possible"
        }
      });
        }else if(helpers.isDefined(doctorAccountInformation)){
          console.log("si existe el nombre de usuario");
          req.body.titleData.idUserDataDoctor = doctorAccountInformation._id;
          models.titlesDataDoctors.update({
              idUserDataDoctor: doctorAccountInformation._id,
              _id: req.params.title_id
            },
            req.body.titleData,
            function (err, titleDataDoctor) {
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
                    url:"localhost:3000/api/v1/doctors/"+doctorAccountInformation.username+"/titles_data/"+req.params.title_id
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
      resToIncorrectStructure(req,res,"titleData",data);    
    }
  });
};
