require("dotenv").config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
const nunjucks = require('nunjucks')
const session = require('express-session');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require ('./routes/login');
// var secretRouter = require ('./routes/secret');
var signupRouter = require ('./routes/signup');
var profileRouter = require ('./routes/profile');
var logoutRouter = require ('./routes/logout');

var app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'hemlig',
  resave: false,
  saveUninitialized: true,
  cookie: { sameSite: true }
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
// app.use('/secret', secretRouter);  
app.use('/signup', signupRouter); 
app.use('/profile', profileRouter); 
app.use('/logout', logoutRouter); 




module.exports = app;
