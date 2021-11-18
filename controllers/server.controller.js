var UserInfo = require('../model/userModel')
var PhoneListing = require('../model/phoneModel')
var cartListing = require('../model/cartModel')

module.exports.showCheckoutPage = function (req, res) {
    //find the data
    cartListing.find({}, (err, cartlist) => {
      if (err) {
        console.log("query err");
      } else {
        console.log(cartlist)
        //if success, return cartlist json to the routes
        res.json(cartlist)
      }
    })
  }
  
module.exports.updateListingInfo = function(req,res){
    newInfo = {
          title:req.body.title,
          stock:req.body.new_stock
    }
  
    // console.log(newInfo);
    
    PhoneListing.updateListingInfo(newInfo, function(err, result){
        if(err){
            console.log(err);
        }else{
            // res.json(result);
            res.send("success updating");
        }
    });
    
}

module.exports.addToCart = function(req,res){
    newCartInfo = {
            title:req.body.title,
            price:req.body.price,
            stock:req.body.stock,
            quantity:req.body.quantity
    }
   
    //console.log(newCartInfo);
    
    cartListing.addToCart(newCartInfo, function(err, result){
        if(err){
            console.log(err);
        }else{
            // res.json(result);
            res.send("success adding to cart");
        }
    });
}




module.exports.getUserId = function(req,res){
      console.log("session~",req.session.userId);
    //   console.log("session~",typeof(req.session.userId));
    res.send(req.session.userId);
}


module.exports.getUserStatus = function(req,res){
  if(req.session.isLogin){
      res.send("loged")
  }else{
      res.send("unloged")
  }
}


module.exports.checkPwd = function(req,res){
    if(req.body.userPwd==req.session.password){
        res.send("correctpwd");
    }else{
        res.send("incorrectpwd");
    }
}


module.exports.getUserInfo = function(req,res){
    userId=req.params.id;
    UserInfo.getUserInfo(userId, function(err, result){
        if(err){
            console.log("can not find info of "+ id);
        }else{
            res.json(result);
        }
    });
}


module.exports.updateUserInfo = function(req,res){
    newInfo = {
        id:req.body.id,
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        email:req.body.email
    }
    console.log(newInfo);
    
    UserInfo.updateUserInfo(newInfo, function(err, result){
        if(err){
            console.log(err);
        }else{
            // res.json(result);
            res.send("successProfile");
        }
    });
}


module.exports.changePassword = function(req,res){
    newPwd = {
        id:req.body.id,
        password:req.body.password
    }
    console.log(newPwd,2333333333333333333333333333)
    console.log(newPwd);
    
    UserInfo.changePassword(newPwd, function(err, result){
        if(err){
            console.log(err);
        }else{
            // res.json(result);
            req.session.password=req.body.password;
            res.send("successPwd");
        }
    });
}

module.exports.addNewListing = function(req,res){
    newListingInfo = {
            title:req.body.title,
            brand:req.body.brand,
            image:"imageurl",
            stock:req.body.stock,
            seller:req.body.id,
            price:req.body.price
    }
    console.log(newListingInfo);
    
    PhoneListing.addNewListing(newListingInfo, function(err, result){
        if(err){
            console.log(err);
        }else{
            // res.json(result);
            res.send("successAddListing");
        }
    });
}


module.exports.changeImageRoutes = function(req,res){
    helloinfo = req.params.info;
    
    PhoneListing.changeImageRoutes(helloinfo, function(err, result){
        if(err){
            console.log(err);
        }else{
            // res.json(result);
            res.send("successChangeImageRoutes");
        }
    });
}


module.exports.getRelatedPhoneListings = function(req,res){
    sellerId = req.params.id;
    
    PhoneListing.getRelatedPhoneListings(sellerId, function(err, result){
        if(err){
            console.log(err);
        }else{
            res.json(result);
            // res.send("successSendRelatedPhoneListings");
        }
    });
}


module.exports.deletePhoneListings = function(req,res){
    deleteId = req.body;
    // console.log("2333333333",deleteId);
    PhoneListing.deletePhoneListings(deleteId, function(err, result){
        if(err){
            console.log(err);
        }else{
            // res.json(result);
            res.send("successDelete");
        }
    });
}


module.exports.disablePhoneListings = function(req,res){
    disableId = req.body;
    // console.log("2333333333",deleteId);
    PhoneListing.disablePhoneListings(disableId, function(err, result){
        if(err){
            console.log(err);
        }else{
            // res.json(result);
            console.log("disabled!!")
            res.send("successDisable");
        }
    });
}


module.exports.notDisablePhoneListings = function(req,res){
    notdisableId = req.body;
    PhoneListing.notDisablePhoneListings(notdisableId, function(err, result){
        if(err){
            console.log(err);
        }else{
            // res.json(result);
            console.log("not disabled!!")
            res.send("successNotDisable");
        }
    });
}


module.exports.getSoldOutSoon = function(req,res){
    info = req.params.info;
    PhoneListing.getSoldOutSoon(info, function(err, result){
        if(err){
            console.log(err);
        }else{
            res.json(result);
        }
    });
}


module.exports.getBestSellers = function(req,res){
    info = req.params.info;
    PhoneListing.getBestSellers(info, function(err, result){
        if(err){
            console.log(err);
        }else{
            res.json(result);
        }
    });
}


module.exports.getSearchTitle = function(req, res){
    title = req.body.title
    PhoneListing.getSearchTitle(title, function(err, result){
        if(err){
            console.log(err)
        }
        else{
            res.json(result)
        }
    })
}
