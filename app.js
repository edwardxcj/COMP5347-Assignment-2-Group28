var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const bodyParser = require('body-parser');


// connect to database
var db = require('./model/db');

var routes = require('./routes/server.routes');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// phone list router
// var phonesRouter = require('./routes/phones');

var app = express();

// session configuration
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge : 1000 * 60 * 5 } //set session age to 5 mins
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

// app.use(express.static(__dirname+"/public",{index:"userPage.html"}));
// app.use('/',routes);

//load all the static files under public
// app.use('/checkoutPage', express.static(__dirname + "/public", { index: "Checkout_Page.html" }));
app.use('/entry', routes);


app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use('/phones', phonesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(3000, function(){
  console.log("server listening on port 3000!!")
});


module.exports = app;
