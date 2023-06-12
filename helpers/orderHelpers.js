const Cart = require("../models/cart");
const Order = require("../models/order");
const Product = require("../models/product");
const { generateRazorpay } = require("../helpers/paymentHelpers");
const crypto = require("crypto");
// const { ObjectId } = require("mongodb");

module.exports = {
  getCart: (user) => {
    return new Promise(async (resolve, reject) => {
      try {
        let userCart = await Cart.findOne({ user_id: user })
          .populate("items.prodId")
          .lean();
        if (userCart) {
          resolve(userCart);
        } else {
          resolve(null);
        }
      } catch (error) {
        reject(error);
      }
    });
  },

  orderPlace: (data, user) => {
    return new Promise(async (resolve, reject) => {
      try {
        let items = await Cart.findOne({ user_id: user }).populate('items.prodId');
        console.log(items.items,"itsmes s ");
        const total = items.Total;
        if (!items) {
          resolve({ status: false, message: "Cart not found" });
        } else {
          if (data.payment_option === "COD") {
            let order = new Order({
              user_id: user,
              deliveryAddress: {
                fname: data.fname,
                lname: data.lname,
                billing_address: data.billing_address,
                state: data.state,
                city: data.city,
                zipcode: data.zipcode,
                phone: data.phone,
              },
              paymentMethod: data.payment_option,
              products: items.items,
              totalAmount: total,
              shipping_status: "Order Placed",
              date: new Date(),
            });
            order.save();
            await Cart.deleteOne({ user_id: user });
            resolve({ status: true, paymentOption: data.payment_option });
          } else if (data.payment_option === "onlinepayment") {
            const paymentmethod = data.payment_option;
            let order = new Order({
              user_id: user,
              deliveryAddress: {
                fname: data.fname,
                lname: data.lname,
                billing_address: data.billing_address,
                state: data.state,
                city: data.city,
                zipcode: data.zipcode,
                phone: data.phone,
              },
              paymentMethod: paymentmethod,
              products: items.items,
              totalAmount: total,
              shipping_status: "Pending",
              date: new Date(),
            });
            order.save();
            generateRazorpay(order, total).then((response) => {
              resolve(response);
            });
          } else {
          }
        }
      } catch (error) {}
    });
  },

  verifypayment: (details) => {
    return new Promise(async (resolve, reject) => {
      let hmac = crypto.createHmac("sha256", "lapF4lkrYo8NK9CEO38S5SBX");
      hmac.update(
        details["response[razorpay_order_id]"] +
          "|" +
          details["response[razorpay_payment_id]"]
      );
      hmac = hmac.digest("hex");
      if (hmac == details["response[razorpay_signature]"]) {
        resolve();
      } else {
        reject();
      }
    });
  },

  changePaymentStatus: (orderId, user) => {
    return new Promise(async (resolve, reject) => {
      const changepaymentstatus = await Order.findOneAndUpdate(
        { _id: orderId },
        { shipping_status: "Order Placed" }
      );
      if (changepaymentstatus) {
        await Cart.deleteOne({ user_id: user });
        resolve({ status: true });
      }
    });
  },

  cancelorder: (orderId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const cancelOrder = await Order.findOne({ _id: orderId });
        if (!cancelOrder) {
          resolve({ status: false, message: "Order not found" });
        } else {
          await Order.updateOne(
            { _id: orderId },
            { $set: { shipping_status: "Cancelled" } }
          );
          resolve({ status: true, message: "Order cancelled successfully" });
        }
      } catch (error) {
        console.log(error);
      }
    });
  },

  returnproducts: (orderId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const returnOrder = await Order.findOne({ _id: orderId });
        if (!returnOrder) {
          resolve({ status: false, message: "Order not found" });
        } else {
          await Order.updateOne(
            { _id: orderId },
            { $set: { shipping_status: "Returned" } }
            )};
            resolve({ status: true, message: "Products returned successfully" });
          
          // const productIds = Order.products.map((product) => product.productId);

          // await Product.updateMany(
          //   { _id: { $in: productIds } },
          //   { $set: { shipping_status: "Returned" } }
          // );
        
      } catch (error) {
        console.error(error);
      }
    });
  },

  viewOrderedProducts: (orderId) => {
    return new Promise(async(resolve, reject) => {
      try {
          const orderDetails = await Order.findOne({_id: orderId}).populate('products.prodId');
          resolve(orderDetails)
        } catch (error) {
          console.log(error.message,"err messsage");
        }
  })
  }
};
