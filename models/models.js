var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
// mongoose.connect('mongodb://localhost/medicalDirectory');
mongoose.connect('mongodb://consulting:1q2w3e4r@ds049568.mongolab.com:49568/consulting');

var db =  mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback(){
  console.log('conexion establecida');
  console.log('Database medicalDirectory');
});

var patientsSchema = new Schema({
  accountInformation: {
    email: { type: String, required: true, unique: true},
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    createdDate: {
      type: Date, 
      default: Date.now
    } 
  },
  personalInformation:{
    identification: {
      type : {type: String, enum: ['ti', 'cc', 'pasaporte']},
      number : {type : String}
    },
    names : { type: String},
    lastnames : {
      first : {type: String},
      second : {type: String}
    },
    sex: {type: String, enum: ['masculino', 'femenino']},
    birthdate: {type: Date},
    contactData:{
      phone:{
        mobile : {type: String},
        home: {type: String}
      }
    }
  }
});

var doctorsCalendarSchema = new Schema({
  idDAI: {type:Schema.Types.ObjectId, required:true, ref: 'doctorsAccountInformation'},
  date: {
    year: {type: Number, required: true},
    month: {type: Number, required: true},
    day: {type: Number, required: true}
  },
  time: {
    start: {type: Number, required: true},
    end: {type: Number, required: true}
  },
  isAvailable: {type: Boolean, default:true},
  appointment: {
    idPatient: {type:Schema.Types.ObjectId, ref: 'patients'},
    description: String
  }
});

doctorsCalendarSchema.index({idDAI: 1, date: 1, time:1}, {unique: true});

var universitiesSchema = new Schema({
  _id: String,
  name: {type : String, required: true},
  department : {type : String, required: true},// traer de una tabla
  city: {type : String, required: true}// traer de una tabla
});

var citiesSchema = new Schema({
  _id: String,
  name : {type: String, required: true}
});

var professionalTypesSchema = new Schema({
  _id: String,
  type : {type : String, required: true},
  description: {type : String, default:''}
});

var jobInformationSchema = new Schema({
  clinic: {
    nit:{type:String, required:true, unique:true},
    name: {type: String, required:true, default:''},
    location: {
      city: {type: String, required:true, ref: "cities"},
      address: {type: String, required:true, default:''}
    },
    phone:{
      mobile : {type: String, default: ''},
      landline: {type: String, default:''}
    }
  }
});


var doctorsAccountInformationSchema = new Schema({
  email: { type: String, required: true, unique: true},
  username: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  image: String,
  registerState:{
    type:Number,
    required:true, 
    default: 0,
    enum:[0,1,2,3]
  },
  observation: {type: String, default: ""},
  createdDate: {
    type: Date, 
    default: Date.now
  },
  pei: {type:Schema.Types.ObjectId, ref: 'doctorsPersonalInformation'},
  pri: {type:Schema.Types.ObjectId, ref: 'doctorsProfessionalInformation'},
  ti: [{type:Schema.Types.ObjectId, ref: 'doctorsTitlesInformation'}]
});

var doctorsTitlesInformationSchema = new Schema({
  idDAI: {type:Schema.Types.ObjectId, required:true, ref: 'doctorsAccountInformation'},
  title : {type : String, required: true},
  description : {type: String, defaul:''},
  idUniversity : { type: String, ref: 'universities' },
  graduationDate : {type: Date, required:true}
});

var doctorsPersonalInformationSchema = new Schema({
  idDAI: {type:Schema.Types.ObjectId, index:true, unique:true, required:true, ref: 'doctorsAccountInformation'},
  identification: {
    type : {type: String, required:true, enum: ['ti', 'cc', 'pasaporte']},
    number : {type : String, index : true, required:true, unique:true}
  },
  names : { type: String, required:true},
  lastnames : {
    first : {type: String, required:true},
    second : {type: String, required:true}
  },
  sex: {type: String, enum: ['masculino', 'femenino']},
  birthdate: {type: Date, required:true},
  contactData:{
    home : {
      city: {type: String},
      address: {type: String}
    },
    phone:{
      mobile : {type: String},
      home: {type: String}
    }
  },
  nationality: {
    type:String,
    required:true,
    enum:['colombiano', 'extranjero', 'nacionalizado']
  }
});


var doctorsProfessionalInformationSchema = new Schema({
  idDAI: {type:Schema.Types.ObjectId, index:true, unique:true, required:true, ref:"doctorsAccountInformation"},
  professionalCard: {
    number: {type: String, required:true, unique:true}
  },
  professionalType: {type: String, required:true, ref:"professionalTypes"},
  isWorking:{type:String, required:true, enum:['si', 'no'], default:"no"},
  jobInformation: {type:Schema.Types.ObjectId, ref:"jobInformation"},
  evidence: {type: String}
});

var doctorsAccessTokensSchema = new Schema({
  idDAI: Schema.Types.ObjectId,
  accessToken: String,
  tokenType: {type: String, default:"bearer"},
  refreshToken: String,
  expirationDate: Date
});

var patientsAccessTokensSchema = new Schema({
  idPatient: Schema.Types.ObjectId,
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


exports.patients = mongoose.model('patients', patientsSchema);
exports.patientsAccessTokens = mongoose.model('patientsAccessTokens', patientsAccessTokensSchema);

exports.doctorsCalendar = mongoose.model('doctorsCalendar', doctorsCalendarSchema);