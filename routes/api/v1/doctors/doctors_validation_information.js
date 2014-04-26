var helpers = require('../../../../helpers/helpers');
var isDefined = helpers.isDefined;

var doctorPersonalInformationStructure = {
  "personalInformation" :{
    "identification": {
      "type" : "",
      "number" : ""
    },
    "names" : "",
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
      "number": ""
    },
    "professionalType": "",
    "isWorking":"",
    "evidence": "",
    //If working is yes then
    "jobInformation":{
      "clinic": {
        "nit": "",
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
}

var doctorTitlesInformationStructure = {
  "titlesInformation": {
    "title" : "",
    "description" :"" ,
    "university" : "",
    "graduationDate" : ""
  }
}

exports.testDoctorPersonalInformation = function(personalInformation, next) {
  var data = [];
  var testApproved = true;
  // console.log(personalInformation);
  if (isDefined(personalInformation)) {
    if (isDefined(personalInformation.identification)) {
      if (isDefined(personalInformation.identification.type)) {
        if (["ti","cc","pasaporte"].indexOf(personalInformation.identification.type)>=0) {
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
      data.push({
        "personalInformation.names": {
          "status": "ok",
          "value": personalInformation.names
        } 
      });
    }else{
      data.push({
        "personalInformation.names":{
          "status": "error",
          "info": "You must to send a value for this field"
        }
      });
      testApproved=false;
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

exports.testDoctorProfessionalInformation = function(professionalInformation, next) {
  var data = [];
  var testApproved = true;
  // console.log(professionalInformation);
  if (isDefined(professionalInformation)) {
    // console.log(professionalInformation);
    if (isDefined(professionalInformation.professionalCard)) {
      // console.log(professionalInformation.professionalCard);
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
      if(professionalInformation.isWorking == "si"){
        if (isDefined(professionalInformation.jobInformation)) {
          if (isDefined(professionalInformation.jobInformation.clinic)) {
            if (isDefined(professionalInformation.jobInformation.clinic.nit)) {
              data.push({
                "professionalInformation.jobInformation.clinic.nit":{
                  "status": "ok",
                  "value": professionalInformation.jobInformation.clinic.nit
                }
              });
            }else{
              data.push({
                "professionalInformation.jobInformation.clinic.nit":{
                  "status": "error",
                  "info": "You must to send a value for this field"
                }
              });
              testApproved=false;
            }
            if (isDefined(professionalInformation.jobInformation.clinic.name)) {
              data.push({
                "professionalInformation.jobInformation.clinic.name":{
                  "status": "ok",
                  "value": professionalInformation.jobInformation.clinic.name
                }
              });
            }else{
              data.push({
                "professionalInformation.jobInformation.clinic.name":{
                  "status": "error",
                  "info": "You must to send a value for this field"
                }
              });
              testApproved=false;
            }

            if (isDefined(professionalInformation.jobInformation.clinic.location)) {
              if (isDefined(professionalInformation.jobInformation.clinic.location.city)) {
                data.push({
                  "professionalInformation.jobInformation.clinic.location.city":{
                    "status": "ok",
                    "value": professionalInformation.jobInformation.clinic.location.city
                  }
                });
              }else{
                data.push({
                  "professionalInformation.jobInformation.clinic.location.city":{
                    "status": "error",
                    "info": "You must to send a value for this field"
                  }
                });
                testApproved=false;
              }

              if (isDefined(professionalInformation.jobInformation.clinic.location.address)) {
                data.push({
                  "professionalInformation.jobInformation.clinic.location.address":{
                    "status": "ok",
                    "value": professionalInformation.jobInformation.clinic.location.address
                  }
                });
              }else{
                data.push({
                  "professionalInformation.jobInformation.clinic.location.address":{
                    "status": "error",
                    "info": "You must to send a value for this field"
                  }
                });
                testApproved=false;
              }
            }else{
              data.push({
                "professionalInformation.jobInformation.location":{
                  "status": "error",
                  "info": "You must to send a location object"
                }
              });
              testApproved=false;
            }

            if (isDefined(professionalInformation.jobInformation.clinic.phone)) {
              if (isDefined(professionalInformation.jobInformation.clinic.phone.mobile)) {
                data.push({
                  "professionalInformation.jobInformation.clinic.phone.mobile":{
                    "status": "ok",
                    "value": professionalInformation.jobInformation.clinic.phone.mobile
                  }
                });
              }else{
                data.push({
                  "professionalInformation.jobInformation.clinic.phone.mobile":{
                    "status": "error",
                    "info": "You must to send a value for this field"
                  }
                });
                testApproved=false;
              }

              if (isDefined(professionalInformation.jobInformation.clinic.phone.landline)) {
                data.push({
                  "professionalInformation.jobInformation.clinic.phone.landline":{
                    "status": "ok",
                    "value": professionalInformation.jobInformation.clinic.phone.landline
                  }
                });
              }else{
                data.push({
                  "professionalInformation.jobInformation.clinic.phone.landline":{
                    "status": "error",
                    "info": "You must to send a value for this field"
                  }
                });
                testApproved=false;
              }
            }else{
              data.push({
                "professionalInformation.jobInformation.phone":{
                  "status": "error",
                  "info": "You must to send a phone object"
                }
              });
              testApproved=false;
            }
          }else{
            data.push({
              "professionalInformation.jobInformation.clinic":{
                "status": "error",
                "info": "You must to send a value for this field"
              }
            });
            testApproved=false;
          }
        }else{
          data.push({
            "professionalInformation.jobInformation":{
              "status": "error",
              "info": "You must to send a jobData object"
            }
          });
          testApproved = false;
        }
      }
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

exports.testDoctorTitleInformation = function(titleInformation, next) {
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

exports.resToIncorrectStructure = function(req, res, structureType, data) {
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
