var helpers = require('../helpers/helpers');

exports.index = function(req, res){
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
  
  if (req.cookies && (req.cookies.isLogged == true || req.cookies.isLogged == 'true')) {
    console.log("render dashboard from cookie")
    res.render('dashboard', {data: data});
  }else if(req.session && req.session.isLogged == true){
    console.log("render dashboard from session")
    res.render('dashboard', {data: data});
  }else{
    res.render('index');
  }
};