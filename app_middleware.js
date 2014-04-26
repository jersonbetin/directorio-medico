var models = require('./models/models');
var helpers = require('./helpers/helpers');

exports.csrfValidation = function (req, res, next){
  console.log("#################### CSRF VALIDATION  ####################")
  if(req.header("Host") == "localhost:3000"){
    if (helpers.isDefined(req.session)) {
      console.log(req.session.csrf);
      console.log(req.header("csrfToken"));
      if(helpers.isDefined(req.session.csrf) && req.session.csrf == req.header("csrfToken")){
          console.log("Si se encontro un CSRF token")
          next();
      }else if(req.header("applicationToken") == "POSTMANAplicationToken"){
        console.log("csrfTokenPOSTMAN sent");
        next();
      }else{
        console.log("Origen valido pero el csrf token no");
        res.send("Origen valido pero el csrf token no");
      }
    }else{
      res.send("No session");
    }
  }else if(req.header("applicationToken")){
    res.send("Se recibio el csrf token de la aplicacion");
  }else{
    res.send("Origen no valido");
  }
}

exports.credentialsVerification = function (req, res, next){
  console.log("#################### CREDENTIALS VERIFICATION  ####################")
  if (req.header("accessToken")) {
    models.doctorsAccessTokens.findOne({accessToken:req.header("accessToken")}, function(err, doctorAccessToken){
      if (err) {
        console.log(err);
        res.send({error:500});
      }else if(doctorAccessToken){
        console.log("Access token found");
        if (Date.now() <= doctorAccessToken.expirationDate) {
          if(req.params.username == "me"){
            console.log("Se paso el me");
            models.doctorsAccountInformation.findOne({_id: doctorAccessToken.idDAI}, function(err, doctorAI){
              if(err){
                console.log("err");
                res.send(500);
              }else if(doctorAI){
                console.log(doctorAI.username);
                req.params.username = doctorAI.username;
                next();
              }else{
                console.log("MEdoctorAccountInformation not fount")
                res.send(404);
              }
            });
          }else{
            if(req.method == "GET"){
              next();
            }else{
              models.doctorsAccountInformation.findOne({username: req.params.username}, function(err, doctorAI){
                if (err) {
                  console.log(err);
                  res.send(500);
                }else if(doctorAI){
                  console.log("DAT: " + doctorAccessToken.idDAI);
                  if(doctorAccessToken.idDAI == doctorAI.id){
                    next();
                  }else{
                    res.send({
                      error: {
                        code:401,
                        error:"InvalidAccessToken",
                        info:"The access token have you sent is not related to the user that you want to modify"
                      }    
                    });
                  }
                }else{
                  res.send({
                    error: {
                      code:401,
                      error:"Username not found",
                      info:"Username not found"
                    }    
                  });
                }
              });
            }
          }
        }else{
          res.send({
          error: {
            code:401,
            error:"AccessTokenExpired",
            info:"The accessToken have you sent have expired, please get a new accessToken"
          }
        });
        }
      }else{
        console.log("Access token not valid");
        res.send({
          error: {
            code:401,
            error:"AccessTokenNoValid",
            info:"The accessToken have you sent doesn't exist in our database, please send another"
          }
        });
      }
    });  
  }else{
    console.log("Access token not sent");
    res.send({
      error: {
        code:401,
        error:"AccessTokenNotSent",
        info:"You don't sent an accessToken"
      }
    });
  }
}