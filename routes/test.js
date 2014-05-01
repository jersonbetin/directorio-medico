'use strinct'

var models = require('../models/models');

//incluimos el sistema de  "archivos" de nodejs
var fs = require("fs");
// fs.readFile("/home/pedro/Escritorio/universidades", function(error, data) {
//     console.log("error: "+error);
//     var arr1 = data.toString().split("\n").map(function (val) { return val; });
//     for(i = 0; i<arr1.length; i++){
//         var arr2 = arr1[i].split("\t").map(function (val) {return val;});
//         var u = {
//             _id: arr2[0],
//             name: arr2[1],
//             department: arr2[2],
//             city: arr2[3]
//         }
//         models.universities.create(u, function(err, u){
//             if (err) {
//                 console.log(err);
//             }else{
//                 console.log("Guardado: "+ u.name);
//             }
//         });
//     }
// });

// fs.readFile("/home/pedro/Escritorio/municipios", function(error, data) {
//     console.log("error: "+error);
//     var arr1 = data.toString().split("\n").map(function (val) { return val; });
//     for(i = 0; i<arr1.length; i++){
//         var arr2 = arr1[i].split("\t").map(function (val) {return val;});
//         var c = {
//             _id: arr2[0],
//             name: arr2[1],
//         }
//         models.cities.create(c, function(err, c){
//             if (err) {
//                 console.log(err);
//             }else{
//                 console.log("Guardado: "+ c.name);
//             }
//         });
//     }
// });
