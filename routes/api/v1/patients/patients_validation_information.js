var helpers = require('../../../../helpers/helpers');
var isDefined = helpers.isDefined;

var patientsPersonalInformationStructure = {
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
      "phone":{
        "mobile" : "",
        "home": ""
      }
    }
  }
};

exports.testPatientPersonalInformation = function(personalInformation, next) {
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

exports.resToIncorrectStructure = function(req, res, structureType, data) {
  structureType = structureType || "personalInformation"
  if (structureType=="personalInformation") {
    var structure = doctorPersonalInformationStructure;
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
