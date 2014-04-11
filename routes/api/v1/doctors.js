'use strict'

var models = require('../../../models/models');
var helpers = require('../../../helpers/helpers');
var isDefined = helpers.isDefined;
var encryptString = helpers.encryptString;

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

var doctorProfessionalInformationStructure = {
  "professionalInformation": {
    "professionalCard": {
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

var doctorTitlesInformationStructure = {
  "titlesInformation": {
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

var testDoctorProfessionalInformation = function(professionalInformation, next) {
  var data = [];
  var testApproved = true;
  // console.log(personalInformation);
  if (isDefined(professionalInformation)) {
    console.log(professionalInformation);
    if (isDefined(professionalInformation.professionalCard)) {
    console.log(professionalInformation.professionalCard);
      if (isDefined(professionalInformation.professionalCard.number)) {
        data.push({
          "professionalInformation.professionalCard.number":{
            "status": "ok",
            "value": professionalInformation.professionalCard.number
          }
        });
      }else{
        data.push({
          "professionaData.professionalCard.number":{
            "status": "error",
            "info": "You must to send a value for this field"
          }
        });
        testApproved=false;
      } 

      if (isDefined(professionalInformation.professionalCard.expeditionDate)) {
        data.push({
          "professionalInformation.professionalCard.expeditionDate":{
            "status": "ok",
            "value": professionalInformation.professionalCard.expeditionDate
          }
        });
      }else{
        data.push({
          "professionaData.professionalCard.expeditionDate":{
            "status": "error",
            "info": "You must to send a value for this field"
          }
        });
        testApproved=false;
      }
    }else{
      data.push({
        "professionalInformation.professionalCard":{
          "status": "error",
          "info": "You must to send a professionalCard object"
        }
      });
      testApproved = false;
    }

    if (isDefined(professionalInformation.professionalType)) {
      data.push({
        "professionalInformation.professionalType":{
          "status": "ok",
          "value": professionalInformation.professionalType
        }
      });
    }else{
      data.push({
        "professionalInformation.professionalType":{
          "status": "error",
          "info": "You must to send a value for this field"
        }
      });
      testApproved=false;
    }

    if (isDefined(professionalInformation.isWorking)) {
      data.push({
        "professionalInformation.isWorking":{
          "status": "ok",
          "value": professionalInformation.isWorking
        }
      });
    }else{
      data.push({
        "professionalInformation.isWorking":{
          "status": "error",
          "info": "You must to send a value for this field"
        }
      });
      testApproved=false;
    }

    if (isDefined(professionalInformation.evidence)) {
      data.push({
        "professionalInformation.evidence":{
          "status": "ok",
          "value": professionalInformation.evidence
        }
      });
    }else{
      data.push({
        "professionalInformation.evidence":{
          "status": "error",
          "info": "You must to send a value for this field"
        }
      });
      testApproved=false;
    } 
  }else{
    data.push({
      "professionalInformation":{
        "status": "error",
        "info": "You must to send a professionalInformation object"
      }
    });
    testApproved = false;
  } 
  next(testApproved, data);
};

var testDoctorTitleInformation = function(titleInformation, next) {
  var data = [];
  var testApproved = true;
  console.log(titleInformation);
  if (isDefined(titleInformation)) {
    if (isDefined(titleInformation.title)) {
      data.push({
        "titleInformation.title":{
          "status": "ok",
          "value": titleInformation.title
        }
      });
    }else{
      data.push({
        "titleInformation.title":{
          "status": "error",
          "info": "You must to send a value for this field"
        }
      });
      testApproved=false;
    }

    if (isDefined(titleInformation.description)) {
      data.push({
        "titleInformation.description":{
          "status": "ok",
          "value": titleInformation.description
        }
      });
    }else{
      data.push({
        "titleInformation.description":{
          "status": "error",
          "info": "You must to send a value for this field"
        }
      });
      testApproved=false;
    }

    if (isDefined(titleInformation.university)) {
      data.push({
        "titleInformation.university":{
          "status": "ok",
          "value": titleInformation.university
        }
      });
    }else{
      data.push({
        "titleInformation.university":{
          "status": "error",
          "info": "You must to send a value for this field"
        }
      });
      testApproved=false;
    }

    if (isDefined(titleInformation.graduationDate)) {
      data.push({
        "titleInformation.graduationDate":{
          "status": "ok",
          "value": titleInformation.graduationDate
        }
      });
    }else{
      data.push({
        "titleInformation.graduationDate":{
          "status": "error",
          "info": "You must to send a value for this field"
        }
      });
      testApproved=false;
    }
  }else{
    data.push({
      "titleInformation":{
        "status": "error",
        "info": "You must to send a titleInformation object"
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
  }else if (structureType=="titleInformation") {
    var structure = doctorTitlesInformationStructure;
  }else if (structureType=="professionalInformation") {
    var structure = doctorProfessionalInformationStructure;
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
exports.getDoctorsAccountInformation = function (req, res) {
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


/*Doctors Personal Information*/

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
  models.doctorsPersonalInformation.findOne()
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
      console.log("datos personales:"+doctorPI);
      res.send(200, {error: null, doctorPersonalInformation: doctorPI});
    }else{
      res.send(200, {error: null, doctorPersonalInformation: null});
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
            {idDAI:doctorAccountInformation._id},
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


/*Doctors TItles Information*/

//get
exports.getDoctorTitlesInformationById = function(req, res) {
  var criteria = {};
  var projection = {};
  models.titleInformationDoctors.find({idDAI:req.params.id},function (err, doctorTI) {
    if (err) {
      console.log(err);
      res.send({
        error: {
          code:500,
          error:"SomethingWasWrongWithUs",
          info:"This erros happends in our servers, we will try to fix the soon as possible"
        }
      });
    }else if (doctorTI){
      res.send(200, {error: null, doctorTitlesInformation: doctorTI});
      // models.universities.findOne({_id:titleInformation.idUniversity})
    }else{
      res.send(200, {error: null, doctorTitlesInformation: null});
    }
  });
};

exports.getDoctorsTitlesInformationByUsername = function(req, res) {
  console.log("#################### getDoctorsTitlesInformationByUsername  ####################");
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
    }else{
      if (helpers.isDefined(doctorAI)) {
        models.doctorsTitlesInformation.find({idDAI:doctorAI._id}).populate("idUniversity").exec(function (err, doctorTI) {
          if (err) {
            console.log(err);
            res.send({
              error: {
                code:500,
                error:"SomethingWasWrongWithUs",
                info:"This erros happends in our servers, we will try to fix the soon as possible"
              }
            });
          }else if (doctorTI){
            for (var i=0; i < doctorTI.length; i++){
              console.log(doctorTI[i]);
            }
            res.send(200, {error: null, doctorTitlesInformation: doctorTI});
            // models.universities.findOne({_id:titleInformation.idUniversity})
          }else{
            res.send(200, {error: null, doctorTitlesInformation: null});
          }
        });
      }else{
        res.send(401);
      }
    }
  });
};

//post
exports.saveDoctorTitleInformation = function (req, res){
  testDoctorTitleInformation(req.body.titleInformation, function(testApproved,data){
    if (testApproved) {
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
        }else if(helpers.isDefined(doctorAI)){
          req.body.titleInformation.idDAI = doctorAI._id;
          models.universities.findOne({_id:req.body.titleInformation.university}, function(err, university){
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
      resToIncorrectStructure(req,res,"titleInformation", data);    
    }
  });
};

//put
exports.updateDoctorTitleInformation = function(req, res) {
  console.log("#################### updateDoctorTitleInformation  ####################");
  testDoctorTitleInformation(req.body.titleInformation, function(testApproved,data){
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
          console.log("si existe el nombre de usuario");
          req.body.titleInformation.idDAI = doctorAI._id;
          models.doctorsTitlesInformation.update({
              idDAI: doctorAI._id,
              _id: req.params.title_id
            },
            req.body.titleInformation,
            function (err, doctorTI) {
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
          res.send(200,{
            mdStatus:{
              code:2000,
              info: "This username doesn't exist in our  database"
            }
          });
        }
      });
    }else{
      resToIncorrectStructure(req,res,"titleInformation",data);    
    }
  });
};


/*Doctors Professional Information*/
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