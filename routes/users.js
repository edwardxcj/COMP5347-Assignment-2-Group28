var express = require('express');
var router = express.Router();
var userModel = require('../model/userModel');
var md5 = require('md5-node'); //import MD5 module
var mongoose = require('mongoose');



// user register interface
router.post('/register', function(req, res, next) {

  let {firstname, lastname, username, password, password2} = req.body;

  if (password != password2) {
    console.log('May two passwords are not the same');
    res.redirect('/register');
  } else if (username === '' || password === '') {
    console.log('username or password is empty');
    res.redirect('/register');
  }

  // MD5 encoding
  password = md5(password);

  // verify data first
  userModel.find({email:username}).then((docs)=>{
    if (docs.length > 0) {
      res.send('username already exists');
      
    } else {
      // insert data to db
      var id = new mongoose.Types.ObjectId();
      userModel.insertMany({_id:id, firstname, lastname, email:username, password}).then((data)=>{
        // sign up successfully and redirect to sign in page
        res.redirect('/login');
      }).catch((err)=>{
        res.redirect('/register');
      })
    }
  });
});

// user login interface
router.post('/login', function(req,res,next){
  let {username, password} = req.body;
  
  if(username == '' || password == ''){
    console.log('username or password is empty');
    res.redirect('/login');
  }

  password = md5(password);

  userModel.find({ email:username, password:password }).then((docs)=>{
    if (docs.length > 0) {
      // server side will use session to record user information once successfully login
      console.log("username and password is OK!");
      // console.log(112233,docs);
      req.session.userId = docs[0]._id;
      req.session.password = docs[0].password;
      // JSON.stringify();
      req.session.username = username;
      req.session.isLogin = true;
      // go to home page
      res.redirect('/'); 
    } else {
      // username or password is wrong
      console.log("username or password is wrong");
      res.redirect('/login');
    }
  }).catch((err)=>{
    console.log("login error occurs");
    res.redirect('/login');
  })
});

// user log out interface
router.get('/logout', (req, res, next)=>{
  req.session.username = null;
  req.session.isLogin = false;
  res.redirect('/login')
})

module.exports = router;