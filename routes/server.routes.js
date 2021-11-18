var express = require('express');
var controller = require('../controllers/server.controller');
var router = express.Router();

// routers for userPage and parts of mainPage 
router.get('/userPage/getUserId', controller.getUserId);
router.get('/userPage/getUserInfo/:id', controller.getUserInfo);
router.post('/userPage/updateUserInfo', controller.updateUserInfo);
router.post('/userPage/checkPwd',controller.checkPwd);
router.post('/userPage/userInfo/pwd', controller.changePassword);
router.post('/userPage/userInfo/newlisting', controller.addNewListing);
router.get('/userPage/getUserStatus', controller.getUserStatus);
router.get('/userPage/changeImageRoutes/:info', controller.changeImageRoutes);
router.get('/userPage/phoneListings/:id', controller.getRelatedPhoneListings);
router.post('/userPage/deletePhoneListings', controller.deletePhoneListings);
router.post('/userPage/disablePhoneListings', controller.disablePhoneListings);
router.post('/userPage/notDisablePhoneListings', controller.notDisablePhoneListings);
router.get('/mainPage/soldOutSoon/:info', controller.getSoldOutSoon);
router.get('/mainPage/bestSellers/:info', controller.getBestSellers);


// router.get('/data', controller.showCheckoutPage);
router.get('/checkoutPage/data', controller.showCheckoutPage);
//router.post('/mainPage/stocks', controller.updateListingInfo);
// router.post('/update',controller.updateListingInfo);
router.post('/checkoutPage/update',controller.updateListingInfo);
router.post('/checkoutPage/addtocart',controller.addToCart);

module.exports = router;