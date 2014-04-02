
/*
 * GET home page.
 */

exports.index = function(req, res){
  var data = {};
  data.crfs = 123456789;
  req.session.crfs = data.crfs;
  res.render('index', {data:data});
};