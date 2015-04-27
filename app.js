var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var index = require('./routes/index');
var users = require('./routes/users');
var session = require('express-session');
var app = express();


var util = require('util');
// multi part handeling
var multer  = require('multer');
//var mongooseschema= require('models/userdata');

var app = express();
app.use(bodyParser.json());


mongoose.connect('mongodb://cmpe277:cmpe277@ds047107.mongolab.com:47107/cmpe277');

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',index);
app.use('/photoshare/api/v1/users', users);

//app.use(session({
//    secret: 'keyboard cat',
//    resave: true,
//    saveUninitialized: true
//}));

//var passport = require('passport');
//var expressSession = require('express-session');
//app.use(expressSession({secret: 'mySecretKey'}));
//app.use(passport.initialize());
//app.use(passport.session());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
});

console.log("Serve running on port 8080");
app.listen(8080);

module.exports = app;
