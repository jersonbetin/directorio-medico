
exports.index = function(req, res){
  console.log("cookies",req.cookies);
  if (req.cookies && (req.cookies.isLogged == true || req.cookies.isLogged == 'true')) {
    console.log("render dashboard from cookie")
    res.render('dashboard');
  }else if(req.session && req.session.isLogged == true){
    console.log("render dashboard from session")
    res.render('dashboard');
  }else{
    res.render('index');
  }
};