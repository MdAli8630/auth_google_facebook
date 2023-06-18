require('dotenv').config();
const express = require("express");
const passport = require("passport");
const session = require('express-session');
require('./passport-setup');

const app = express();
const PORT = 8080;

const facebookStrategy = require('passport-facebook');





app.set("view engine", "ejs");

app.use(session({
  secret: process.env.GOOGLE_CLIENT_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.render("pages/index");
});

app.get("/success", (req, res) => {
  res.render('pages/profile.ejs');
});

app.get("/google", passport.authenticate('google', { scope: ["profile", "email"] }));

app.get("/google/callback", passport.authenticate('google', { failureRedirect: '/failed' }),
  function (req, res) {
    res.redirect('/success');
  }
);

//make our facebook strategy

passport.use(new facebookStrategy({
    clientID :process.env.FACEBOOK_CLIENT_ID,
    clientSecret :process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL : process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id','displayName','name','gender','picture.type(large)','email']

},
function(token, refreshToken,profile,done){
    console.log(profile)
    return done(null,profile)
}
))


app.get("/auth/facebook",passport.authenticate('facebook',{scope:'email'}))

app.get("/facebook/callback",passport.authenticate('facebook',{
    successRedirect:'/profile',
    failureRedirect:'/failed'
}))



app.get('/profile',(req,res)=>{
    res.send("You are a valid user")
})

app.get("/failed",(req,res)=>{
    res.send("You are a non valid user")
})


passport.serializeUser(function(user,done){

    done(null,user);
})

passport.deserializeUser(function(id,done){

    return done(null,id);
})


app.listen(PORT, () => {
  console.log(`Server is listening on Port:${PORT}`);
});
