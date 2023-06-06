const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    // required: true
  },
  items: [{
    prodId : {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
    },
    
    quantity: {type: Number, default: 1},
    // required: true
  
    // subTotal: {type:Number}
  }],

  Total: {
    type: Number
    // required: true
  },
});

module.exports = mongoose.model('Cart', cartSchema);
