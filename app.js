var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');

var crypto = require('crypto');
var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
var methodOverride = require('method-override');

var expressHbs = require('express-handlebars');



var app = express();

// mongodb connection
mongoose.connect('mongodb+srv://username:username@exchanger-m9ryh.mongodb.net/test?retryWrites=true&w=majority',{
	useNewUrlParser: true,
	useCreateIndex: true
}).then(()=>{
	console.log('connected to database');
}).catch(err=>{
	console.log('ERROR:', err.message);
});



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


require('./config/passport');

// view engine setup
app.engine('.hbs',expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//session setup
app.use(session({secret: 'mysupersecret', resave: false, saveUninitialized: false}));

//flash initialization
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  next(createError(404));
});*/

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
