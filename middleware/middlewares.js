/*var bcrypt = require('bcryptjs');
var sanitizer = require('sanitize')();

// Express Validator middleware

function reg_valid(req,res,next){
	
	/*const fullname = sanitizer.value(req.body.fullname, 'string');
	const username = sanitizer.value(req.body.username, 'string');
	const email = sanitizer.value(req.body.email, 'string');
	
	req.checkBody({

		'fullname' : { 
						notEmpty : true, 
						isLength : {
							options : [{ min:5 , max : 25 }],
							errorMessage : "Fullname must be between 5 to 25 characters"
						},
						errorMessage: 'Fullname is required' 
					 },

		'username' : { 
						notEmpty : true, 
						isLength : {
							options : [{ min:5 , max : 12 }],
							errorMessage : "Username must be between 5 to 12 characters"
						},
						errorMessage: 'Username is required' 
					 },

		'email'    : { 
						notEmpty:true,
						isEmail : {
							errorMessage : 'Invalid Email Address'
						},
						errorMessage:'Email is required'  
					 },
		'password' : { 
						notEmpty : true, 
						isLength : {
							options : [{min:8}],
							errorMessage : "Password must be greater than 7 characters"
						},
						errorMessage: 'Password is required' 
					 },

		'confirm' : { 
						notEmpty : true, 
						errorMessage: 'Confirm Password is required' 
					 }
	});

	req.checkBody('email','Email already exist').isExist_email();
	req.assert('confirm','Password not matced').equals(req.body.password); 

	req.asyncValidationErrors().then(function(){
			next();
	},function(errors){
		if(errors){
			res.send(errors[0]);
		}
	});

}

module.exports.reg_valid = reg_valid;
*/
