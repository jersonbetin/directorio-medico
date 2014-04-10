var api = {};
api.version = 'v1';
// api.doctors = require('./routes/api/'+api.version+'/doctors');
api.authentication = require('./api/'+api.version+'/authentication');

exports.newDoctorSession = function (req, res) {
  api.authentication.generateDoctorAccessToken(req,res);
}

exports.destroyDoctorSession = function(req, res){
  console.log("aqui");
  if(req.cookies && (req.cookies.isLogged == true || req.cookies.isLogged == "true")){
    console.log("11111111111111111111111111111111111111111");
    console.log(req.cookies);
    res.clearCookie("isLogged");
    res.send(200);
  }else if(req.session && (req.session.isLogged == true || req.session.isLogged == "true")){
    console.log("22222222222222222222222222222222222222222");
    delete req.session.isLogged;
    res.send(200);
  }else{
    console.log("3333333333333333333333333333333333333333333");
    res.send(200);
  }
}