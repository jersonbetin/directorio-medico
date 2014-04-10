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
    res.render('dashboard', {data: data});
  }else if(req.session && (req.session.isLogged == true || req.session.isLogged == 'true')){
    console.log("render dashboard from session")
    // console.log(req.session);
    res.render('dashboard', {data: data});
  }else{
    res.render('index');
  }
};