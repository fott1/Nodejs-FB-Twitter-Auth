// Dependancies. Some of them are not needed but they are included
var express     =   require("express"); 
var app         =   express();
var bodyParser  =   require("body-parser");
var router      =   express.Router();
var path = require('path');
var util = require('util');

// Dependancies for Facebook Login 
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy
	, TwitterStrategy = require('passport-twitter').Strategy;
app.use('/',router);

// We set the views to render to the user
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

//Home Route
router.get("/",function(req,res){
        res.sendFile(path.join(__dirname, './pages/index.html'));});
//About Route
router.get("/about",function(req,res){
        res.sendFile(path.join(__dirname, './pages/about.html'));});
//Render Login File
router.get("/login",function(req,res){
        res.sendFile(path.join(__dirname, './pages/login.html'));});

//Facebook Auth
passport.use(new Strategy({
    clientID: process.env.CLIENT_ID || '1672996562925109',
    clientSecret: process.env.CLIENT_SECRET || '01279a1db36c54dba6ffe4f31c66b579',
    callbackURL: 'http://www.3e.gr' //this is just a test callback URL
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }));

  passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// Facebook Routing
app.get('/login-facebook',
  passport.authenticate('facebook'));

//Twitter Auth
passport.use(new TwitterStrategy({
    consumerKey: 'I8eQdlmCuv71Z0XNNH2DEFnWj',
    consumerSecret: '6n9WebrGtLt32IV4WjXwNTFqoRzgsQDEaOI45iLKgT9kZfj2Lh',
    callbackURL: "http://127.0.0.1:3000/" // This is to test is returns to Localhost
  },
  function(token, tokenSecret, profile, done) {
    User.findOrCreate({ twitterId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

//Twitter Routing
app.get('/login-twitter',
  passport.authenticate('twitter'));

app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.listen(3000);
console.log("Listening to PORT 3000");





