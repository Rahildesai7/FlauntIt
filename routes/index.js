var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const methods = require('../secure/methods');
var passport = require('passport');
var User = require('../models/user');
var Post = require('../models/posts');
var Request = require('../models/requests');

var crypto = require('crypto');
var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
var methodOverride = require('method-override');

const path = require('path');

/* GET home page. */
var username ="";
  router.get('/',isLoggedin,(req,res,next)=>{
	User.findById(req.user,(err,file)=>{
		username= file.username;
		console.log(username);
		Post.find((err, files)=>{
  	  if(!files || files.length==0){
  		   res.render('index',{title: 'Exchanger'});
  	  }else{
		  console.log(files.length);
		  var files1=[];
		  files1 = files.reverse();
		  console.log(files1.length);
  		  var postChunks = [];
      	  var chunkSize = 3;

		  for (var i = 0; i < files1.length; i += chunkSize) {
        		postChunks.push(files.slice(i, i+chunkSize))
      	   }
	  console.log(username);
 	  res.render('index',{title: 'Exchanger', posts:postChunks, username: username });
  	  }
  	});
	});
  	
 });

router.get('/files/:no', (req, res, next) => {
  gfs.files.findOne({ 
    filename: req.params.no
  }, (err, file) => {
    if (!file) {
      return res.status(404).json({
        err: "no files exist"
      })
    };
    return res.json(file);
  });;
});

router.get('/image/:no', (req, res, next) => {
  gfs.files.findOne({ 
    filename: req.params.no
  }, (err, file) => {
    if (!file) {
      return res.status(404).json({
        err: "no files exist"
      })
    };
    const readstream = gfs.createReadStream(file.filename);
	 readstream.pipe(res);
  });;
});



/* Singup */
router.get('/users/signup', function(req, res, next) {
  res.render('users/signup', { title: 'Exchanger'});
});

/* POST Register User */

router.post('/users/signup',function(req,res,next){
	
	User.findOne({email: req.body.email}, function(err, user){
        if(err) {
          console.log('Post retrieval error'+err);
        }
        var message;
        if(user) {
          console.log(user)
            message = "user exists";
            console.log(message)
        } else {
            var hash = methods.token(req.body.email);

    var userData = {
    		fullname  	 : req.body.fullname,
    		username  	 : req.body.username,
    		email 	  	 : req.body.email,
    		password  	 : bcrypt.hashSync(req.body.password, 10),
    		accountToken : hash
    };
				//console.log(userData);


    /**  
    *  Sending activation tokento user for account activation. - START
    **/

     var mailOptions = {
            from     : 'Exchanger',
            to       :  userData.email, 
            subject  : 'Account Acivation', 
            text     : 'Welcome to FlauntIt. Keep Sharing'
        };

        methods.sendMail(mailOptions).then(function(info){
            var newUser = new User(userData);
			console.log(newUser);
            newUser.save((err,result) => {
                if(err) throw err;
				if(result){
					//res.send('Account created');
					res.redirect('/users/signin');
				}
                
            });
        }).catch(function(err){
			console.log('Send mail error '+err);
             var data = {msg:"Something went wrong.",param:"",success:false};
             res.send(data);
        });

        }
        //res.json({message: message});
    });
	
	
    /**  
    *  Sending activation tokento user for account activation. - END
    **/


});



router.get('/users/signin', function (req, res, next) {
  var messages = req.flash('error');
  res.render('users/signin',{ title: 'Exchanger'});
	//console.log(req.csrfToken());
});

router.post('/users/signin', passport.authenticate('local.login', {
  //successRedirect: '/',
  failureRedirect: '/users/signin',
  failureFlash: true
}), function (req, res, next) {
  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
	  //console.log(req.csrfToken());
  } else {
	  //console.log(req.csrfToken());
	  res.redirect('/');
}});


var postchunks=[];
router.get('/users/profile',isLoggedin,(req,res,next)=>{
	User.findById(req.user,(err,user)=>{
		if(user){
			var username= user.username;
			var bio = user.bio;
			var posts= user.posts;
			var image = user.image;
			Post.find({userid: req.user},(err,files)=>{
				 files1 = files.reverse();
  		  		 var postChunks = [];
      	  		 var chunkSize = 3;
				 var posts = files.length;
		  		for (var i = 0; i < files1.length; i += chunkSize) {
        			postChunks.push(files.slice(i, i+chunkSize))
      	   		}
		
				res.render('users/profile',{username: username,bio: bio,image: image, posts: posts, postarray: postChunks});
			});
		}
	});
	
});

//init gfs
let gfs;
mongoose.connection.once("open", () => {
	gfs = new Grid(mongoose.connection.db, mongoose.mongo);
  	gfs.collection('uploads');
});

 //STORAGE ENGINE
var storage = new GridFsStorage({
  url: 'mongodb+srv://username:username@exchanger-m9ryh.mongodb.net/test?retryWrites=true&w=majority',
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
		  console.log(filename);
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

router.get('/users/posts',isLoggedin,function(req,res,next){
	User.findById(req.user, function(err, user){
		  if(user){
			  var username = user.username;
			  res.render('users/post_form',{ title: 'Exchanger', username: username});
		  }
	});
});


router.post('/users/posts',upload.single('file'),(req,res,next)=>{
	var postdata;
	console.log('file');
	User.findById(req.user, function(err, user){
		  if(user){
			  const userid= user.id;
			  const username = user.username;
			  postdata = {
		      userid: userid,
			  username: username,
		      postid: req.file.id,
		      image: req.file.filename,
			  description: req.body.description,
			  title: req.body.title
	 }
	 var newPosts = new Post(postdata);
	 newPosts.save((err,result) => {
                if(err) throw err;
				if(result){
					res.redirect('/');
				}
                
            });
			  user.posts.push(req.file.id);
			  user.save((err,savedUser)=>{
				 console.log('user saved'); 
			  });
		  }
		
	});
});

router.post('/requests/:postid',(req,res,next)=>{
	var userid;
	Post.findOne({postid: req.params.postid},(err,file)=>{
		userid = file.userid;
		User.findById(req.user,(err,user)=>{
			if(user){
				var request ={
		senderid: req.user,
		sendername: user.email,
		postid: req.params.postid, 
		receiverid: userid,
		}
		var newRequest = new Request(request);
		newRequest.save((err,docs)=>{
			if(docs){
				console.log(docs);
				res.redirect('/');
			}else{
				console.log(err);
			}
		});
			}
		});
		
	});
	
});

var flag=0;
router.post('/likes/:postid/',(req,res,next)=>{
	Post.findOne({postid: req.params.postid},(err,file)=>{
		if(file){
			file.likes = file.likes + 1;
			file.save((err,docs)=>{
				if(docs){
					//res.send('saved'+ docs);
					res.redirect('/');
					//console.log('liked');
				}
				else{
					//res.send('error');
				}
			});
		}
	});
});

const docs=[];
const emails=[];
var reqUser=[];
router.get('/users/requests',isLoggedin,(req,res,next)=>{
	User.findById(req.user,(req,user)=>{
		if(user){
			console.log(user);
	Request.find({receiverid: user._id},(err,docs)=>{
		console.log(docs);
		if(docs.length>0){
			//docs.push(emails);
			console.log(docs);
			res.render('users/requests',{requestarray: docs, emails:emails});
		}
		else{
			res.render('users/requests');
		}
	});
		}
	});
});


router.get('/update/bio',isLoggedin,(req,res,next)=>{
	User.findById(req.user,(req,user)=>{
		if(user){
		res.render('users/editprofile',{username: user.username});
		}
	});
	
});

router.post('/update/bio',upload.single('file'),(req,res,next)=>{
	User.findById(req.user,(err,user)=>{
		if(user){
			console.log(user);
			user.bio = req.body.bio;
			user.image = req.file.filename;
			user.save((err,docs)=>{
				console.log(user);
			});
			res.redirect('/users/profile');
		}else{
			res.send('err');
		}
	});
});


router.post('/update/',(req,res,next)=>{
		Post.find({userid:req.user},(err,post)=>{
		if(post){
			for(var j=0;j<post.lenght;j++){
				console.log(post[j]);
				post[i].username=req.body.username;
				post[i].save((err,result)=>{
					if(result){
						console.log(result);
						Request.find({senderid:req.user},(err,request)=>{
						if(request){
							for(var i=0;i<request.length;i++){
							//console.log(request[i]);
								request[i].sendername = req.body.email;
								request[i].save((err,result)=>{
								if(result){
									res.send(updated);
								}
							});
						}
					}
				});
			}
				});
			}
		}
	});
});



router.get('/contact',isLoggedin,(req,res,next)=>{
	User.findById(req.user,(req,user)=>{
		if(user){
	res.render('users/contact_us',{username: user.username});
		}
	});
});

router.get('/about',isLoggedin,(req,res,next)=>{
	User.findById(req.user,(req,user)=>{
		if(user){
	res.render('users/about_us',{username: user.username});
		}
	});
});

router.get('/delete/:id',(req,res,next)=>{
	Post.deleteOne({postid: req.params.id},(file,err)=>{
		if(!err){
			res.send('deleted');
			//res.redirect('users/profile');
		}
		res.redirect('/users/profile');
	});
});

router.get('/logout', isLoggedin, function (req, res, next) {
  req.logOut();
  res.redirect('/');
});

var mongodb = require('mongodb');
router.get('/remove/user',isLoggedin,(req,res,next)=>{
	User.deleteOne({_id: new mongodb.ObjectID(req.user)},(user,err)=>{
		if(!err){
			res.send('user deleted');
		}	
		Post.deleteMany({userid: req.user},(files,err)=>{
			if(!err){
				res.send('user deleted');
			}	
		});
	res.redirect('/users/signin');
	});
});

function isLoggedin(req,res,next){
  if( req.isAuthenticated()){
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/users/signin');
}
function updateRequest(req,res,next){
	
	return next();
}

function updatePost(req,res,next){
	
	return next();
}
function updateDiv()
{ 
    $( "#here" ).load(window.location.href + " #here" );
}

module.exports = router;
