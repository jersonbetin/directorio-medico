/*
correo: consulting.cordoba.service@gmail.com
contraseña: consulting1q2w3e4r
*/

var nodemailer = require("nodemailer");
// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
  service: "Gmail",
  auth: {
      user: "consulting.cordoba.service",
      pass: "consulting1q2w3e4r"
  }
});

exports.sendMail = function(mailOptions){
  console.log(mailOptions);
  // send mail with defined transport object
  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.message);
    }
  });
}