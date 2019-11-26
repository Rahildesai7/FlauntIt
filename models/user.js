var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
	/*fullname 	 : {type:String,required:true,unique:false,trim:true},
	username 	 : {type:String,trim:true,default:""},
	email    	 : {type:String,required:true,unique:true,trim:true},
	password 	 : {type:String,default:""},
	accountToken : {type:String},
	facebookID   : {type:String},
	fbToken      : Array ,
	googleID     : {type:String},
	googleToken  : Array*/
	fullname  	 : {type:String,unique:false},
	username 	 : {type:String,required:true, trim:true,default:"", unique:true},
	email    	 : {type:String,required:true,unique:true,trim:true},
	password 	 : {type:String,default:""},
	verified	 : {type:Boolean,default:false},
	image        : {type:String,default:"https://unsplash.it/200/200"},
	bio          : {type:String,default:""},
	status   	 : {type:String,default:0},
	accountToken : {type:String},
	resetToken   : {type:String},
	expireToken  : {type:Date},
	facebookID   : {type:String},
	fbToken      : Array ,
	googleID     : {type:String},
	googleToken  : Array,
	followers    : Array,
	following    : Array,
	likes        : {type:Number,default:0},
	posts        : [{
					  post : String,
					  body : {type:String,trim:true},
					  image : {type:String,trim:true}	
					}]
});

userSchema.methods.encryptPassword = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validpassword = function(password){
	return bcyrpt.compareSync(password, this.password);
};

module.exports = mongoose.model('User',userSchema); 