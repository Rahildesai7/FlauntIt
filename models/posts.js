var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postsSchema = new Schema({
	userid  	 : {type:String,trim:true},
	username     : {type:String,trim:true},
	postid	     : {type:String,trim:true},
	image        : {type:String,default:"https://unsplash.it/200/200"},
	likes        : {type:Number,default:0},
	description	 : {type:String,default:""},
	title		 : {type:String,default:""},
	authenticated: {type:Boolean,default:false},
	requests	 : {type:Number,default:0},
	//tstamp		 : {type:Timestamp,default:""}
});

module.exports = mongoose.model('Posts',postsSchema); 