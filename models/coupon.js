const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  couponCode: {
    type: String,
    // required: true,
    // unique: true,
  },
 
  couponDiscount: {
    type: Number,
    // required: true,
  },

  couponMinAmount: {
    type: Number,
    // required: true
  },

  expireDate: {
    type: Date,
    // required: true,
  },

  Status: { 
    type: Boolean,
    // required: true,
  }
});

const coupon = mongoose.model('coupon', couponSchema);

module.exports = coupon;
