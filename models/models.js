var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
mongoose.connect('mongodb://localhost/medicalDirectory');
//mongoose.connect('mongodb://consulting:1q2w3e4r@ds037737.mongolab.com:37737/secretaria');

var db =  mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback(){
  console.log('conexion establecida');
  console.log('Database medicalDirectory');
});

var universitiesSchema = new Schema({
  name : {type : String, required: true},
  department : {type : String, required: true},// traer de una tabla
  city: {type : String, required: true}// traer de una tabla
});

var citiesSchema = new Schema({
  name : {type: String, required: true}
});

var titlesSchema = new Schema({
  _doctor : {type:Schema.Types.ObjectId, ref:'doctors'},
  title : {type : String, required: true},
  description : {type: String, defaul:''},
  _university : {type:Schema.Types.ObjectId, ref:'universities'},
  graduationDate : {type: Date, required:true}
});

var professionalTypesSchema = new Schema({
  type : {type : String, required: true},
  description: {type : String, default:''}
});

var jobDataSchema = new Schema({
  nit:{type:String, required:true, unique:true, default:'sin definir'},
  clinic: {
    name: {type: String, required:true, default:'sin definir'},
    location: {
      _city: {type: Schema.Types.ObjectId, ref:'city'},
      address: {type: String, required:true, default:'sin definir'}
    },
    phone:{
      movil : {type: String, default: 'sin definir'},
      landline: {type: String, required:true, default:'sin definir'}
    }
  }
});

var doctorsSchema = new Schema({
  personalData :{
    identification: {
      type : {type: String, required:true, enum: ['TI', 'CC', 'Pasaporte']},
      number : {type : String, index : true, required:true, unique:true}
    },
    names : {
      first: { type: String, required:true},
      second: { type: String}
    },
    lastnames : {
      first : {type: String, required:true},
      second : {type: String, required:true}
    },
    sex: {type: String, enum: ['M', 'F']},
    birthdate: {type: Date, required:true},
    contactData:{
      home : {
        city: {type: String, required:true},
        address: {type: String, required:true}
      },
      phone:{
        movil : {type: String, required:true},
        home: {type: String, required:true}
      }
    },
    nationality: {
      type:String, 
      required:true, 
      enum:['Colombiano', 'Extranjero', 'Nacionalizado']
    }
  },
  profesionalData: {
    professinalCard: {
      number: {type: String, required:true, unique:true},
      expeditionDate: {type: Date, required:true}
    },
    _professionalType: {type:Schema.Types.ObjectId, ref:'professionalTypes'},
    _jobData: {type:Schema.Types.ObjectId, ref:'jobData'},
    isWorking:{type:String, required:true, enum:['si', 'no']},
    evidence: {type: String, required:true}
  },
  registerState:{
    type:String, 
    required:true, 
    enum:['en estudio', 'aprovado', 'desaprovado']
  }
});

var adminsSchema = new Schema({
  user:{type : String, required:true},
  password:{type : String, required:true}
});

exports.universities = mongoose.model('universities', universitiesSchema);
exports.cities = mongoose.model('cities', citiesSchema);
exports.jobData = mongoose.model('jobData', jobDataSchema);
exports.professionalTypes = mongoose.model('professionalTypes',professionalTypesSchema);
exports.titles = mongoose.model('titles', titlesSchema);
exports.doctors = mongoose.model('doctors', doctorsSchema);
exports.admins = mongoose.model('admins', adminsSchema);
