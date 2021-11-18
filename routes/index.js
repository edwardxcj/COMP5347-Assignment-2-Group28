var express = require('express');
var router = express.Router();
var controller = require('../controllers/server.controller');


router.get('/login', function(req, res, next) {
  res.render('login',{});
});

router.get('/register', function(reg,res,next){
  res.render('register',{});
});

/* GET home page. */
router.get('/', function(reg,res,next){
  res.render('index',{});
});

router.get('/checkoutPage', function(reg,res,next){
  res.render('Checkout_Page',{});
});

router.get('/userPage', function(reg,res,next){
  res.render('userPage',{});
});


router.post("/searchbytitle", controller.getSearchTitle)



module.exports = router;
