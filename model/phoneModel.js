var mongoose = require('./db');


var phoneSchema = new mongoose.Schema(
    {
        title: String,
        brand: String,
        image: String,
        stock: Number,
        seller: String,
        price: Number,
        disabled: String,
        avgRating:Number
    },
    {
        versionKey: false 
    }
);

// var reviewsSchema = new mongoose.Schema(
//     {
//         reviewer: String,
//         rating: Number,
//         comment: String
//     },
//     {
//         versionKey: false 
//     }
// );


phoneSchema.statics.updateListingInfo = function(data, callback){
    console.log(data)

    return this.updateMany({'title':data.title},
                        {$set:{stock:data.stock}},
                        {multi:false}
                        ).exec(callback);
}


phoneSchema.statics.addNewListing = function(data, callback){
    return this.create({
                            title:data.title,
                            brand:data.brand,
                            image:data.image,
                            stock:data.stock,
                            seller:data.seller,
                            price:data.price
                        },callback);
}


phoneSchema.statics.changeImageRoutes = function(data,callback){
    console.log("change image route",data);
    return this.updateMany({},[{$set:{image:{$concat:["images/","$brand",".jpeg"]}}}],{multi:true},callback);
}


phoneSchema.statics.getRelatedPhoneListings = function(data, callback){
    return this.find({'seller':data})
               .exec(callback);
}

phoneSchema.statics.deletePhoneListings= function(deleteId, callback){
    return this.deleteMany({_id:{$in:deleteId}},callback);
}

phoneSchema.statics.disablePhoneListings= function(disableId, callback){
    console.log("disableId:",disableId);
    return this.update({_id:{$in:disableId}},
                        {$set:{disabled:""}},
                        {multi:1}
                        ).exec(callback);
}


phoneSchema.statics.notDisablePhoneListings= function(notDisableId, callback){
    console.log("notDisableId:",notDisableId);
            return this.update({_id:{$in:notDisableId}},
                    {$unset:{disabled:""}},
                    {multi:1}
                    ).exec(callback);
}


phoneSchema.statics.getSoldOutSoon = function(data,callback){
    console.log(data);
    return this.find({"disabled":{$exists:false},
                      "stock":{$gt:0}
                    })
                    .sort({"stock":1})
                    .limit(5)
                    .exec(callback);
}



phoneSchema.statics.getBestSellers = function(data,callback){
    console.log(data);
    return this.aggregate([{$addFields:{avgRating:{$avg:"$reviews.rating"}}},{$match:{"reviews.1":{$exists:true},disabled:{$exists:false}}},{$sort:{avgRating:-1}},{$limit:5}],callback);
}

phoneSchema.statics.getSearchTitle = function(data, callback){
    // match by partial input and case insensitive
    return this.find({title:{$regex: data,$options:"$i"}}, callback)

}


var phoneModel = mongoose.model('phones', phoneSchema,'phonelisting');

module.exports = phoneModel;