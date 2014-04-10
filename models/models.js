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

var professionalTypesSchema = new Schema({
  type : {type : String, required: true},
  description: {type : String, default:''}
});

var jobInformationSchema = new Schema({
  nit:{type:String, required:true, unique:true, default:''},
  clinic: {
    name: {type: String, required:true, default:''},
    location: {
      city: {type: Schema.Types.ObjectId, required:true},
      address: {type: String, required:true, default:''}
    },
    phone:{
      mobile : {type: String, default: ''},
      landline: {type: String, required:true, default:''}
    }
  }
});


var doctorsAccountInformationSchema = new Schema({
  email: { type: String, required: true, unique: true},
  username: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  registerState:{
    type:String, 
    required:true, 
    default: 0,
    enum:[0,1,2,3]
  },
  createdDate: {
    type: Date, 
    default: Date.now
  }
});

var doctorsTitlesInformationSchema = new Schema({
  idDAI: {type:Schema.Types.ObjectId, required:true},
  title : {type : String, required: true},
  description : {type: String, defaul:''},
  idUniversity : {type:Schema.Types.ObjectId, required:true},
  graduationDate : {type: Date, required:true}
});

var doctorsPersonalInformationSchema = new Schema({
  idDAI: {type:Schema.Types.ObjectId, index:true, unique:true, required:true},
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
  sex: {type: String, enum: ['Masculino', 'Femenino']},
  birthdate: {type: Date, required:true},
  contactData:{
    home : {
      city: {type: String, required:true},
      address: {type: String, required:true}
    },
    phone:{
      mobile : {type: String, required:true},
      home: {type: String, required:true}
    }
  },
  nationality: {
    type:String, 
    required:true, 
    enum:['Colombiano', 'Extranjero', 'Nacionalizado']
  }
});

var doctorsProfessionalInformationSchema = new Schema({
  idDAI: {type:Schema.Types.ObjectId, index:true, unique:true, required:true},
  professinalCard: {
    number: {type: String, required:true, unique:true},
    expeditionDate: {type: Date, required:true}
  },
  professionalType: {type:Schema.Types.ObjectId, required:true},
  isWorking:{type:String, required:true, enum:['yes', 'no']},
  jobInformation: {type:Schema.Types.ObjectId, required:true},
  evidence: {type: String, required:true}
});

var adminsSchema = new Schema({
  user:{type : String, required:true},
  password:{type : String, required:true}
});

var doctorsAccessTokensSchema = new Schema({
  idDAI: Schema.Types.ObjectId,
  accessToken: String,
  tokenType: {type: String, default:"bearer"},
  refreshToken: String,
  expirationDate: Date
});

exports.universities = mongoose.model('universities', universitiesSchema);
exports.cities = mongoose.model('cities', citiesSchema);
exports.jobInformation = mongoose.model('jobInformation', jobInformationSchema);
exports.professionalTypes = mongoose.model('professionalTypes',professionalTypesSchema);


exports.doctorsTitlesInformation = mongoose.model('doctorsTitlesInformation', doctorsTitlesInformationSchema);
exports.doctorsPersonalInformation = mongoose.model('doctorsPersonalInformation', doctorsPersonalInformationSchema);
exports.doctorsProfessionalInformation = mongoose.model('doctorsProfessionalInformation', doctorsProfessionalInformationSchema);
exports.doctorsAccountInformation = mongoose.model('doctorsAccountInformation', doctorsAccountInformationSchema);
exports.doctorsAccessTokens = mongoose.model('doctorsAccessTokens', doctorsAccessTokensSchema);

exports.admins = mongoose.model('admins', adminsSchema);
