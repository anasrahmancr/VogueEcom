const mongoose = require('mongoose');
// const {ObjectId} = require('mongodb');
const orderSchema = new mongoose.Schema({
  
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'},
    deliveryAddress: Array,
    paymentMethod: String,
    products: [{
        prodId : {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'product',
        },quantity: Number
        }],
    totalAmount: Number,
    payment_details: Object,
    shipping_status: String,
    date: Date
 
 });

module.exports = mongoose.model('Order', orderSchema);
