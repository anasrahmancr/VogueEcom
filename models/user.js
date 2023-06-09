const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {type:String},
    userName: {type:String, required:true},
    userEmail: {type:String, required:true, unique: true},
    userPhone: {type:Number, required:true, unique: true},
    userPassword: {type:String,required:true},
    userAddress: {type:Array},
    userWishlist: {type:Array},
    userOrders: {type:Array},
    isBlocked: {type:Boolean},
    isApproved: {type: Boolean}
  
})

const user = mongoose.model('user',userSchema);

module.exports = user
