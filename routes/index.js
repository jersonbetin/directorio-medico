'use strict'

var models = require('../models/models');
var helpers = require('../helpers/helpers');

exports.index = function(req, res){
  console.log("#################### index ####################");
  
  console.log("Generation csrf token");
  var data = {};
  var csrf = helpers.encryptString(Math.random().toString(),"csrftoken");
  req.session.csrf = csrf;
  data.csrf = csrf;
  
  if (req.cookies && (req.cookies.isLogged == true || req.cookies.isLogged == 'true')) {
    console.log("render dashboard from cookie")
    if(req.cookies.userType == "doctor"){
      res.render('doctors_dashboard', {data: data});
    }else if(req.cookies.userType == "patient"){
      res.render('patients_dashboard', {data: data});
    }
  }else if(req.session && (req.session.isLogged == true || req.session.isLogged == 'true')){
    console.log("render dashboard from session")
    // console.log(req.session);
    if(req.session.userType == "doctor"){
      res.render('doctors_dashboard', {data: data});
    }else if(req.session.userType == "patient"){
      res.render('patients_dashboard', {data: data});
    }
  }else{
    res.render('index');
  }
};