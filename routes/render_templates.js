'use strict'

var models = require('../models/models');
// var userDataDoctorsModel = models.userDataDoctors;
// var doctorsAccessTokens = models.doctorsAccessTokens;

var helpers = require('../helpers/helpers');


exports.renderSigupDoctorTemplate = function (req, res) {
  console.log("#################### renderSigupDoctorTemplate ####################");
  console.log("Generation csrf token");
  var data = {};
  var csrf = helpers.encryptString(Math.random().toString(),"csrftoken");
  req.session.csrf = csrf;
  data.csrf = csrf;
  console.log(data);
  res.render('signup_doctors', {data: data});
};

exports.renderSigupPatientTemplate = function (req, res) {
  console.log("#################### renderSigupDoctorTemplate ####################");
  console.log("Generation csrf token");
  var data = {};
  var csrf = helpers.encryptString(Math.random().toString(),"csrftoken");
  req.session.csrf = csrf;
  data.csrf = csrf;
  console.log(data);
  res.render('signup_patients', {data: data});
};


exports.renderLoginDoctorTemplate = function (req, res) {
  console.log("#################### renderLoginDoctorTemplate ####################");
  console.log("Generation csrf token");
  var data = {};
  var csrf = helpers.encryptString(Math.random().toString(),"csrftoken");
  req.session.csrf = csrf;
  data.csrf = csrf;
  console.log(data);
  res.render('login_doctors', {data: data});
};

exports.renderLoginPatientTemplate = function (req, res) {
  console.log("#################### renderLoginPatientTemplate ####################");
  console.log("Generation csrf token");
  var data = {};
  var csrf = helpers.encryptString(Math.random().toString(),"csrftoken");
  req.session.csrf = csrf;
  data.csrf = csrf;
  console.log(data);
  res.render('login_patients', {data: data});
};
exports.renderPersonalInformation = function (req, res){
  console.log("#################### renderPersonalInformation ####################");
  console.log("Generation csrf token");
  var data = {};
  var csrf = helpers.encryptString(Math.random().toString(),"csrftoken");
  req.session.csrf = csrf;
  data.csrf = csrf;
  console.log(data);
  if (req.cookies && (req.cookies.isLogged == true || req.cookies.isLogged == 'true')) {
    console.log("render personal_information from cookie");
    res.render('personal_information', {data: data});
  }else if(req.session && req.session.isLogged == true || req.session.isLogged == 'true'){
    console.log("render personal_information from session");
    res.render('personal_information', {data: data});
  }else{
    res.redirect('/');
  } 
};

exports.renderProfessionalInformation = function (req, res){
  console.log("#################### renderPersonalInformation ####################");
  console.log("Generation csrf token");
  var data = {};
  var csrf = helpers.encryptString(Math.random().toString(),"csrftoken");
  req.session.csrf = csrf;
  data.csrf = csrf;
  console.log(data);
  if (req.cookies && (req.cookies.isLogged == true || req.cookies.isLogged == 'true')) {
    console.log("render professional_information from cookie");
    res.render('professional_information', {data: data});
  }else if(req.session && req.session.isLogged == true || req.session.isLogged == 'true'){
    console.log("render professional_information from session");
    res.render('professional_information', {data: data});
  }else{
    res.redirect('/');
  } 
};

exports.renderTitlesInformation = function (req, res){
  console.log("#################### renderPersonalInformation ####################");
  console.log("Generation csrf token");
  var data = {};
  var csrf = helpers.encryptString(Math.random().toString(),"csrftoken");
  req.session.csrf = csrf;
  data.csrf = csrf;
  console.log(data);
  if (req.cookies && (req.cookies.isLogged == true || req.cookies.isLogged == 'true')) {
    console.log("render titles_information from cookie");
    res.render('titles_information', {data: data});
  }else if(req.session && req.session.isLogged == true || req.session.isLogged == 'true'){
    console.log("render titles_information from session");
    res.render('titles_information', {data: data});
  }else{
    res.redirect('/');
  } 
};

exports.renderRegisterEnd = function (req, res){
  console.log("#################### renderRegisterEnd  ####################");
  console.log("Generation csrf token");
  var data = {};
  var csrf = helpers.encryptString(Math.random().toString(),"csrftoken");
  req.session.csrf = csrf;
  data.csrf = csrf;
  console.log(data);
  if (req.cookies && (req.cookies.isLogged == true || req.cookies.isLogged == 'true')) {
    console.log("render register_Ends from cookie");
    res.render('register_Ends', {data: data});
  }else if(req.session && req.session.isLogged == true || req.session.isLogged == 'true'){
    console.log("render register_Ends from session");
    res.render('register_Ends', {data: data});
  }else{
    res.redirect('/');
  } 
};

exports.renderSearchDoctorTemplate = function (req, res){
  console.log("#################### renderSearchDoctor  ####################");
  console.log("Generation csrf token");
  var data = {};
  var csrf = helpers.encryptString(Math.random().toString(),"csrftoken");
  req.session.csrf = csrf;
  data.csrf = csrf;
  console.log(data);
  res.render('search_doctors', {data: data});
};

exports.renderSearchIdoneidadTemplate = function (req, res){
  console.log("#################### renderSearchIdoneidad ####################");
  console.log("Generation csrf token");
  var data = {};
  var csrf = helpers.encryptString(Math.random().toString(),"csrftoken");
  req.session.csrf = csrf;
  data.csrf = csrf;
  console.log(data);
  res.render('search_idoneidad', {data: data});
};

exports.renderInformationPatient = function (req, res){
  console.log("#################### renderPersonalInformation ####################");
  console.log("Generation csrf token");
  var data = {};
  var csrf = helpers.encryptString(Math.random().toString(),"csrftoken");
  req.session.csrf = csrf;
  data.csrf = csrf;
  console.log(data);
  if (req.cookies && (req.cookies.isLogged == true || req.cookies.isLogged == 'true')) {
    console.log("render titles_information from cookie");
    res.render('patient_information', {data: data});
  }else if(req.session && req.session.isLogged == true || req.session.isLogged == 'true'){
    console.log("render titles_information from session");
    res.render('patient_information', {data: data});
  }else{
    res.redirect('/');
  } 
}

exports.renderProfileDoctorTemplate = function(req, res){
  console.log("#################### renderProfileDoctor ####################");
  console.log("Generation csrf token");
  var data = {};
  var csrf = helpers.encryptString(Math.random().toString(),"csrftoken");
  req.session.csrf = csrf;
  data.csrf = csrf;
  console.log(data);
  res.render('perfilMedico', {data: data});
}