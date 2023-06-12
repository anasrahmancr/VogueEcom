const { sendOtp, checkOtp } = require("../util/auth");
const user = require("../models/user");
const bcrypt = require("bcrypt");
const Cart = require("../models/cart");
const coupon = require("../models/coupon");
const order = require("../models/order");

module.exports = {
  loginData: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const userLogin = await user.findOne({ userEmail: data.email });
        if (userLogin) {
          if (userLogin.isBlocked) {
            resolve({ loginStatus: false, errorMessage: "User Blocked." });
          } else {
            const match = await bcrypt.compare(
              data.password,
              userLogin.userPassword
            );
            if (!match) {
              resolve({
                loginStatus: false,
                errorMessage:
                  "Incorrect password. Please check your password and try again.",
              });
              return;
            }
            resolve({ loginStatus: true, user: userLogin });
          }
        } else {
          resolve({
            loginStatus: false,
            errorMessage:
              "User not found. Please check your email and try again.",
          });
          return;
        }
      } catch (error) {
        reject(error);
      }
    });
  },

  signupData: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { username, useremail, userpassword, confirmpassword } = data;
        const userphone = Number(data.userphone);

        if (!username || !useremail || !userphone || !userpassword) {
          resolve({ status: false, message: "Fill all the input fields" });
        } else {
          const emailExists = await user.findOne({ userEmail: useremail });
          const phoneExists = await user.findOne({ userPhone: userphone });
          const hashedPassword = await bcrypt.hash(userpassword, 10);
          const passwordMatch = await bcrypt.compare(confirmpassword, hashedPassword);

          if (emailExists) {
            resolve({ status: false, message: "Email already exists" });
          } else if (phoneExists) {
            resolve({ status: false, message: "Phone number already exists" });
          } else if (!passwordMatch) {
            resolve({ status: false, message: "Passwords doesnot match" });
          } else {
            await sendOtp(userphone);
            const userData = new user({
              userName: username,
              userEmail: useremail,
              userPhone: userphone,
              userPassword: hashedPassword,
              isBlocked: false,
              isApproved: false,
            });

            userData.save();
            resolve({ userData, status: true });
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  },

  otpVerify: (usernumber, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const check = await checkOtp(usernumber, data);
        if (check === true) {
          const userData = await user.updateOne({ userPhone: usernumber },{$set: {isApproved: true}});
          resolve({ status: true});
        } else {
          resolve({ status: false });
        }
      } catch (error) {
        reject({ status: false, error: 'OTP verification failed' });
;
      }
    });
  },

  approveUser: () => {

  },

  changeproQuantity: (data, userId) => {
    let total = 0;
    data.count = parseInt(data.count);
    data.quantity = parseInt(data.quantity);
    let price = parseInt(data.productPrice);
    // const cartId = data.cart;
    const prodId = data.product;
    // const productId = new ObjectId(data.product);
    return new Promise((resolve, reject) => {
      Cart.updateOne(
        { user_id: userId, "items.prodId": prodId },
        { $inc: { "items.$.quantity": data.count } }
      )
        .then(() => {
          Cart.findOne({ user_id: userId })
            .populate("items.prodId")
            .then((cart) => {
              if (!cart) {
                resolve({ status: false, message: "cart not found" });
              } else {
                // const item = cart.items.find((item) => item.prodId._id === new ObjectId(prodId) );
                for (let i = 0; i < cart.items.length; i++) {
                  if (cart.items[i].prodId._id == prodId) {
                    const quantity = cart.items[i].quantity;
                    const subTotal = quantity * price;
                    if (data.count == 1) {
                      total = price;
                    } else {
                      total = -price;
                    }

                    resolve({
                      status: true,
                      quantity: quantity,
                      subTotal: subTotal,
                      total: total,
                    });
                    break;
                  } else {
                    // console.log('Item not found in the cart');
                  }
                }
              }
            })
            .catch((err) => {
              // Handle error
              console.error(err);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  addCartTotal: (total, user) => {
    return new Promise(async (resolve, reject) => {
      try {
        let cart = await Cart.findOne({ user_id: user });
        if (!cart) {
          resolve({ status: false, message: "cart not found" });
          return;
        }
        await Cart.updateOne({ user_id: user }, { Total: total });
        resolve({ status: true });
      } catch (error) {
        reject(error);
      }
    });
  },

  getactivecoupon: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const activecoupon = await coupon.findOne({
          couponCode: data.couponName,
        });
        let cartSubtotal = parseFloat(data.cartSubtotal);
        if (!activecoupon) {
          resolve({ status: false, message: "Invalid Coupon" });
        } else {
          if (activecoupon.couponMinAmount <= cartSubtotal) {
            const discountedAmount = (
              cartSubtotal * activecoupon.couponDiscount
            ).toFixed(2);
            cartSubtotal = cartSubtotal - discountedAmount;
            resolve({
              status: true,
              cartSubtotal: cartSubtotal,
              discountedAmount: discountedAmount,
              message: "Coupon Applied Successfully",
            });
          } else {
            resolve({ status: false, message: "Cannot apply coupon" });
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  },

  myorders: (user) => {
    return new Promise(async (resolve, reject) => {
      try{
        await order.find({ user_id: user }).then((orders) => {
          if (orders) {
            resolve({ status: true, orders: orders });
          } else {
            resolve({ status: false });
          }
        });
      } catch(error){
        console.log(error.message);
      }
      
    });
  },

  userDetails:(userId) =>{
    return new Promise(async(resolve, reject) => {
      try{
        const user = await user.find({_id: userId})
        resolve(user)
      } catch(error){
        console.log(error);
      }
    })
  }
};
