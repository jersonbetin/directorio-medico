'use sctrict'

var crypto = require('crypto');

exports.isDefined = function (variable){
  if(typeof variable === 'undefined' || variable === null){
    return false;
  }else{
    return true;
  }
}

exports.encryptString = function (string, key){
  key = key || "default-key";
  var hash = "";
  hash = crypto.createHmac('sha1', key).update(string).digest('hex');
  return hash;
};
