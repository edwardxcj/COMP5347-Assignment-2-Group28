var mongoose = require('./db');

var userSchema = new mongoose.Schema(
    {
        firstname: String,
        lastname: String,
        email: String,
        password: String
    },
    {
        versionKey: false 
    }
);


userSchema.statics.getUserInfo = function(id, callback){
    return this.find({'_id':id}).exec(callback);
}

userSchema.statics.updateUserInfo = function(data, callback){
    return this.update({'_id':data.id},
                        {$set:{firstname:data.firstname,
                            lastname:data.lastname,
                            email:data.email}},
                        {multi:false}
                        ).exec(callback);
}

userSchema.statics.changePassword = function(data, callback){
    return this.update({'_id':data.id},
                        {$set:{password:data.password}},
                        {multi:false}
                        ).exec(callback);
}


var userModel = mongoose.model('users', userSchema,'userlist');

module.exports = userModel;