var passport = require ('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

var facebookStrategy = require('passport-facebook').Strategy;
var googleStrategy = require('passport-google-oauth20').Strategy;

var methods = require('../secure/methods');
var db   = require('../secure/db');
var bcrypt = require('bcryptjs');

passport.serializeUser((user, done)=>{
	done(null, user.id);
});

/*passport.deserializeUser((id,user)=>{
	User.findById(id, (err,user)=>{
		done(err, user);
	})
});*/
passport.deserializeUser(function(user, done) {
 	done(null, user);
});

/*passport.use('local.signup', new LocalStrategy({
	emailField: 'email',
	passwordField: 'password',
	passReqToCallback: true
},(req, email, password, done)=>{
			User.findOne ({'email': email}, (err,user)=>{
				if(err){
					return done(err);
				}
		        if(user){
					return done(null, false, {message: 'Email already exists'});
				}
				
				const hash = methods.token(req.body.email);
				const hashpasswordd = User.encryptPassword(req.body.passoword);
				newUser.fullname = fullname;
				newUser.username = username;
				newUser.email = email;
				newUser.password = newUser.encryptPassword(password);
				newUser.accountTojen = hash;
				 var userData = {
    				fullname  	 : req.body.fullname,
    				username  	 : req.body.username,
    				email 	  	 : req.body.email,
    				password  	 : hashpassword,
    				accountToken : hash
    			};
				var newUser = new User(usrData);
				newUser.save((err, result)=>{
					if(err){
						return done(err);
					}
					return done(null, newUser);
				});
})
}));
*/


// local strategy for login

passport.use('local.login',new LocalStrategy({
	usernameField : "email",
	passwordField : "password",
	passReqToCallback : true
},(req,email,password,done) => {
	
	User.findOne({email: req.body.email}, function(err, user){
        if(err) {
          console.log(err);
        }
		if(user){
			if(bcrypt.compareSync(password,user.password)){
				console.log("succes");
				return done(null,user);
			} else{
		   		return done(null,false,req.flash('error','Credentials not matched.'));
			}
			}
		else{
			return done(null,false,req.flash('error',"User doesn't exists."));
		}

	});
	/*db.findData(User,{email:email})
	  .then(function(data){
	  	if(bcrypt.compareSync(password,data.password)){
			return done(null,data);
		} else{
		   return done(null,false,req.flash('error','Credentials not matched.'));
		}
	  }).catch(function(err){
	  	return done(null,false,req.flash('error','Something went wrong.'));
	  });*/

}));


/*************************************
*   Facebook Local Startegy          *
*************************************/

/*passport.use(new facebookStrategy({
  clientID: get.fbID,
  clientSecret: get.fbSecret,
  callbackURL: "http://localhost:3000/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'email','picture.type(large)'],
  passReqToCallback : true
},(req,accessToken,refreshToken,profile,done) => {


	db.findData(User,{$or:[{facebookID:profile.id},{email:profile.emails[0].value}]})
	  .then(function(data){
	  	if(data) {
			return done(null,data);
		}else{

			var newUser = new User();
				newUser = methods.saveUser(profile,newUser);
				newUser.facebookID = profile.id;
				newUser.fbToken.push({token:accessToken});
				newUser.save((err) => {
					if(err) throw err;
					return done(null,newUser);
				});
		}
	  })
	  .catch(function(err){
	  		return done(null,false,req.flash('error','Something went wrong.'));
	  });

  	}
));

*/

/*************************************
*       Google Local Startegy            
*************************************/

/*passport.use(new googleStrategy({
    clientID: get.gID,
    clientSecret: get.gSecret,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(req,accessToken, refreshToken, profile, done) {
	db.findData(User,{$or:[{googleID:profile.id},{email:profile.emails[0].value}]})
	  .then(function(data){
	  	if(data) {
			return done(null,data);
		}else{
			var newUser = new User();
				newUser = methods.saveUser(profile,newUser);
				newUser.image = newUser.image.split("?")[0];
				newUser.googleID = profile.id;
				newUser.googleToken.push({token:accessToken});
				
				newUser.save((err) => {
					if(err) throw err;
					return done(null,newUser);
				});
		}
	  })
	  .catch(function(err){
	  		return done(null,false,req.flash('error','Something went wrong.'));
	  });   
  }
));*/