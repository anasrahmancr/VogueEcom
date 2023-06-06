const mongoose = require('mongoose');


const wishlistSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    //   ref: 'user',
    //   required: true
    },
    items: [{
        prodId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
        } 
        
       
      }]
  });
const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;