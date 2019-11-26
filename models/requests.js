var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var requestsSchema = new Schema({
	senderid	 : {type:String,trim:true},
	sendername   : {type:String,trim: true},
	postid		 : {type:String,trim:true},
	receiverid	 : {type:String,trim:true},
	semail		 : {type:String,trim:true},
	tstamp		 : {type: Date,default:Date.now}
});

module.exports = mongoose.model('Request',requestsSchema); 