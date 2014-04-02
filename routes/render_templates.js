'use strict'

// var models = require('../../../models/models');
// var userDataDoctorsModel = models.userDataDoctors;
// var doctorsAccessTokens = models.doctorsAccessTokens;

var helpers = require('../helpers/helpers');


exports.renderSigupDoctorTemplate = function (req, res) {
  var data = {};
  if(req.session.crfs){
    console.log("Ya se tiene el token");
    data.crfs = req.session.crfs;
  }else{
    console.log("No se tiene el token");
    var crfs = helpers.encryptString(Math.random().toString(),"appautorization");
    req.session.crfs = crfs;
    data.crfs = crfs;
  }
  console.log(data);
  res.render('signup_doctors', {data: data});
};