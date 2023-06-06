const Razorpay = require('razorpay');
require('dotenv').config()

var instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET ,
});

module.exports = {
    generateRazorpay: (order, total) => {
        return new Promise(async(resolve, reject) => {
            const receiptId = order._id;
            const totalPrice = Math.round(total * 100);
            var options = {
                amount: totalPrice,
                currency: "INR",
                receipt: "" + receiptId
            };
        instance.orders.create(options, function(err, order){
            console.log(order,"ORDER 3333333 INSIDE GENERATE RZOR PAY");
            resolve(order)
            })
            // resolve({status: true, totalPrice: totalPrice, receiptId: receiptId, order: order})
        })
        
    }
}