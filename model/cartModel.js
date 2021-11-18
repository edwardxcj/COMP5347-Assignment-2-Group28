var mongoose = require('./db');


var cartSchema = new mongoose.Schema({
  title: String,
  price: Number,
  quantity: Number
})
// addtocartni xie de fuzhi jinlai 
cartSchema.statics.addToCart = function(data, callback){
  return this.create({
                          title:data.title,
                          price:data.price,
                          stock:data.stock,
                          quantity:data.quantity
                      },callback);
}

var cart = mongoose.model('cart', cartSchema, 'cartlist');

module.exports = cart;