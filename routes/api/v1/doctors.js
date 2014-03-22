'use strict'

var models = require('../../../models/models');
var helpers = require('../../../helpers/helpers');
var isDefined = helpers.isDefined;
var doctorsModel = models.doctors;

var doctorDataStructure = {
  "doctorData":{
    "personalData" :{
      "identification": {
        "type" : "CC",
        "number" : 123456789
      },
      "names" : {
        "first": "pedro",
        "second": "jose"
      },
      "lastnames" : {
        "first" : "jimenez",
        "second" : "perez"
      },
      "sex": "M",
      "birthdate": "22-02-1993",
      "contactData":{
        "home" : {
          "city": "sahagun",
          "address": "cr 19 #6-72"
        },
        "phone":{
          "movil" : 3017244854,
          "home": 7587931
        }
      },
      "nationality": "Colombiano"
    },
    "profesionalData": {
      "professinalCard": {
        "number": 123456789,
        "expeditionDate": "20-06-2010"
      },
      "_professionalType": "532db537bb861eb2811d87e7",
      "isWorking":"no",
      "evidence": "bla bla bla"
    },
    "registerState":"en estudio"
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
      if (isDefined(doctorData.personalData)) {
        if (isDefined(doctorData.personalData.identification)) {
          if (isDefined(doctorData.personalData.identification.type)) {
            if (["TI","CC","Pasaporte"].indexOf(doctorData.personalData.identification.type)>=0) {
              data.push({
                "doctorData.personalData.identification.type":{
                  "status": "ok",
                  "value": doctorData.personalData.identification.type
                }
              });
            }else{
              data.push({
                "doctorData.personalData.identification.type":{
                  "status": "error",
                  "info": "The value of this fiel must be [TI,CC,Pasaporte]"
                }
              });
              testApproved=false;
            }
          }else{
            data.push({
              "doctorData.personalData.identification.type":{
                "status": "error",
                "info": "You must to send a value for this field"
              }
            });
            testApproved=false;
          }

          if (isDefined(doctorData.personalData.identification.number)) {
            data.push({
              "doctorData.personalData.identification.number":{
                "status": "ok",
                "value": doctorData.personalData.identification.number
              }
            });
          }else{
            data.push({
              "doctorData.personalData.identification.number":{
                "status": "error",
                "info": "You must to send a value for this field"
              }
            });
            testApproved=false;
          }
        }else{
          data.push({
            "doctorData.personalData.identification":{
              "status": "error",
              "info": "You must to send a identification object"
            }
          });
          testApproved = false;
        }

        if (isDefined(doctorData.personalData.names)) {
          if (isDefined(doctorData.personalData.names.first)) {
            data.push({
              "doctorData.personalData.names.first":{
                "status": "ok",
                "value": doctorData.personalData.names.first
              }
            });
          }else{
            data.push({
              "doctorData.personalData.names.first":{
                "status": "error",
                "info": "You must to send a value for this field"
              }
            });
            testApproved=false;
          }

          if (isDefined(doctorData.personalData.names.sencond)) {
            data.push({
              "doctorData.personalData.names.second":{
                "status": "ok",
                "value": doctorData.personalData.names.second
              }
            });
          }
        }else{
          data.push({
            "doctorData.personalData.names":{
              "status": "error",
              "info": "You must to send a names object"
            }
          });
          testApproved = false;
        }

        if (isDefined(doctorData.personalData.lastnames)) {
          if (isDefined(doctorData.personalData.lastnames.first)) {
            data.push({
              "doctorData.personalData.lastnames.first":{
                "status": "ok",
                "value": doctorData.personalData.lastnames.first
              }
            });
          }else{
            data.push({
              "doctorData.personalData.lastnames.first":{
                "status": "error",
                "info": "You must to send a value for this field"
              }
            });
            testApproved=false;
          }

          if (isDefined(doctorData.personalData.lastnames.second)) {
            data.push({
              "doctorData.personalData.lastnames.second":{
                "status": "ok",
                "value": doctorData.personalData.lastnames.second
              }
            });
          }else{
            data.push({
              "doctorData.personalData.lastnames.second":{
                "status": "error",
                "info": "You must to send a value for this field"
              }
            });
            testApproved=false;
          }
        }else{
          data.push({
            "doctorData.personalData.lastnames":{
              "status": "error",
              "info": "You must to send a lastnames object"
            }
          });
          testApproved = false;
        }

        if (isDefined(doctorData.personalData.sex)) {
          data.push({
            "doctorData.personalData.sex":{
              "status": "ok",
              "value": doctorData.personalData.sex
            }
          });
        }else{
          data.push({
            "doctorData.personalData.sex":{
              "status": "error",
              "info": "You must to send a value for this field"
            }
          });
          testApproved=false;
        }

        if (isDefined(doctorData.personalData.birthdate)) {
          data.push({
            "doctorData.personalData.birthdate":{
              "status": "ok",
              "value": doctorData.personalData.birthdate
            }
          });
        }else{
          data.push({
            "doctorData.personalData.birthdate":{
              "status": "error",
              "info": "You must to send a value for this field"
            }
          });
          testApproved=false;
        }
        
        if(isDefined(doctorData.personalData.contactData)){
          if (isDefined(doctorData.personalData.contactData.home)) {
            if (isDefined(doctorData.personalData.contactData.home.city)) {
              data.push({
                "doctorData.personalData.contactData.home.city":{
                  "status": "ok",
                  "value": doctorData.personalData.contactData.home.city
                }
              });
            }else{
              data.push({
                "doctorData.personalData.contactData.home.city":{
                  "status": "error",
                  "info": "You must to send a value for this field"
                }
              });
              testApproved=false;
            }

            if (isDefined(doctorData.personalData.contactData.home.address)) {
              data.push({
                "doctorData.personalData.contactData.home.address":{
                  "status": "ok",
                  "value": doctorData.personalData.contactData.home.address
                }
              });
            }else{
              data.push({
                "doctorData.personalData.contactData.home.address":{
                  "status": "error",
                  "info": "You must to send a value for this field"
                }
              });
              testApproved=false;
            } 
          }else{
            data.push({
              "doctorData.personalData.contactData.home":{
                "status": "error",
                "info": "You must to send a home object"
              }
            });
            testApproved = false;
          }

          if (isDefined(doctorData.personalData.contactData.phone)) {
            if (isDefined(doctorData.personalData.contactData.phone.movil)) {
              data.push({
                "doctorData.personalData.contactData.phone.movil":{
                  "status": "ok",
                  "value": doctorData.personalData.contactData.phone.movil
                }
              });
            }else{
              data.push({
                "doctorData.personalData.contactData.phone.movil":{
                  "status": "error",
                  "info": "You must to send a value for this field"
                }
              });
              testApproved=false;
            }

            if (isDefined(doctorData.personalData.contactData.phone.home)) {
              data.push({
                "doctorData.personalData.contactData.phone.home":{
                  "status": "ok",
                  "value": doctorData.personalData.contactData.phone.home
                }
              });
            }else{
              data.push({
                "doctorData.personalData.contactData.phone.home":{
                  "status": "error",
                  "info": "You must to send a value for this field"
                }
              });
              testApproved=false;
            }
          }else{
            data.push({
              "doctorData.personalData.contactData.phone":{
                "status": "error",
                "info": "You must to send a phone object"
              }
            });
            testApproved = false;
          }
        }else{
          data.push({
            "doctorData.personalData.contactData":{
              "status": "error",
              "info": "You must to send a contactData object"
            }
          });
          testApproved = false;
        }

        if (isDefined(doctorData.personalData.nationality)) {
          data.push({
            "doctorData.personalData.nationality":{
              "status": "ok",
              "value": doctorData.personalData.nationality
            }
          });
        }else{
          data.push({
            "doctorData.personalData.nationality":{
              "status": "error",
              "info": "You must to send a value for this field"
            }
          });
          testApproved=false;
        }
      }else{
        data.push({
          "doctorData.personalData":{
            "status": "error",
            "info": "You must to send a personalData object"
          }
        });
        testApproved = false;
      }

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
      }else{
        data.push({
          "doctorData.professionalData":{
            "status": "error",
            "info": "You must to send a professionalData object"
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

exports.getAllDoctors = function (req, res) {
  var criteria = {};
  var projection = {};
  console.log("fields: "+req.query.fields);
  doctorsModel.find().populate('_professionalTypes _jobData').exec(function (err, doctors) {
    if (err) {
      res.send(err);
    }else{
      res.send(200);
    }
  });
};

exports.saveADoctor = function (req, res) {
  var contentType = req.header('content-type');
  if (helpers.isDefined(contentType)){
    if (contentType == "application/json") {
      testDoctorData(req.body.doctorData,contentType,function (testApproved,data) {
        if (testApproved) {
          res.send("se va a guardar el doctor");
        }else{
          if (isDefined(req.query.errors) && req.query.errors == "verbose") {
            res.send({
              errors: {
                "info": "You have errors in doctor data you have sent",
                "data": data
              },
              "help": {
                "info": "You doctorData object has to have a structura as follows",
                "structure": doctorDataStructure
              },
            });
          }else{
            res.send({
              errors: {
                "info": "You have errors in doctor data you have sent"
              },
              "help": {
                "info": "You doctorData object has to have a structura as follows",
                "structure": doctorDataStructure
              },
            });
          }
        }
      });

      /*console.log("Se recibio un json")
      console.log("------------------------------------------------------------");
      console.log(req.body);
      if (isDefined(req.body.professionalData.isWorking)) {
        if (req.body.professionalData.isWorking == "no") {

        }else*/
    };
  };
  res.send(200);
};