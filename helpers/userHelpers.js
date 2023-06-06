const { sendOtp, checkOtp } = require("../util/auth");
const user = require("../models/user");
const bcrypt = require("bcrypt");
// const mongoose = require("mongoose");
const Cart = require("../models/cart");
const coupon = require('../models/coupon')
const { ObjectId } = require("mongodb");
const order = require("../models/order");

module.exports = {
  loginData: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const userLogin = await user.findOne({ userEmail: data.email });
        if(userLogin){
          if(userLogin.isBlocked){
              resolve({ loginStatus: false, errorMessage:"User Blocked.",
            });
          } else{
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
        } 
        else{
            resolve({ loginStatus: false, errorMessage: "User not found. Please check your email and try again."
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
        let { username, useremail, userpassword, confirmpassword } = data;
        let userphone = Number(data.userphone);
        
        if (!username || !useremail || !userphone || !userpassword) {
          resolve({ status: false, message: "Fill all the input fields" });
        } else {
            const emailExists = await user.findOne({ userEmail: useremail });
            const phoneExists = await user.findOne({ userPhone: userphone });
            const hashedPassword = await bcrypt.hash(userpassword, 10);
            const passwordMatch = await bcrypt.compare(confirmpassword,hashedPassword)

          if (emailExists) {
            resolve({ status: false, message: "Email already exists" });
          } else if (phoneExists) {
            resolve({ status: false, message: "Phone number already exists" });
          } else if(!passwordMatch){
              resolve({status: false, message: "Passwords doesnot match"})
          } else {
            console.log(userphone,"this is userphoene");
            await sendOtp(userphone);
            let userData = new user({
              userName: username,
              userEmail: useremail,
              userPhone: userphone,
              userPassword: hashedPassword,
              isBlocked: false
            });

            userData.save();
            console.log(userData, "User created successfully");
            resolve({ userData, status: true });
          }
        }
      } catch (error) { 
        reject(error);
      }
    });
  },

  otpVerify: (usernumber, data) => {
    console.log(usernumber, data);
    return new Promise(async (resolve, reject) => {
      let check = await checkOtp(usernumber, data);
      console.log(check, "ccccccccc");
      if (check.valid) {
        let userData = await user.findOne({ userPhone: usernumber });
        resolve({ status: true, userData });
      } else {
        resolve({ status: false }); 
      }
    });
  },

  changeproQuantity: (data, userId) => {
    let total = 0;
    data.count = parseInt(data.count);
    data.quantity = parseInt(data.quantity);
    let price = parseInt(data.productPrice);
    // const cartId = data.cart;
    const prodId = data.product;
    console.log(price,'price');
    // const productId = new ObjectId(data.product);
    return new Promise((resolve, reject) => {
      Cart.updateOne(
        { user_id: userId, 'items.prodId': prodId },
        { $inc: { "items.$.quantity": data.count } }
      )
      .then(() => {
        Cart.findOne({ user_id: userId }).populate('items.prodId')
  .then((cart) => {
    console.log(cart,'this is cart');
    if (!cart) {
      resolve({status:false, message: 'cart not found'});
    } else {
      // const item = cart.items.find((item) => item.prodId._id === new ObjectId(prodId) );
    for(let i=0; i<cart.items.length; i++){
      // console.log(item,'test');
      if (cart.items[i].prodId._id == prodId) {
        const quantity = cart.items[i].quantity;
        const subTotal = quantity * price;
        if(data.count == 1){
          total = price;
        }
        else{
          total = -price;
        }
        

        
        resolve({status:true, quantity: quantity, subTotal: subTotal, total: total})
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
    return new Promise(async(resolve, reject)=>{
      try{
        let cart = await Cart.findOne({user_id: user});
        console.log(cart,total,'carttttt');
        if(!cart){
          resolve({status: false, message: 'cart not found'});
          return;
        }
        await Cart.updateOne({user_id: user}, {Total: total})
        resolve({status: true})
      }
      catch(error){
        reject(error)
      }
    })
  },

  getactivecoupon: (data) => {
    return new Promise(async(resolve, reject) => {
      try{
        const activecoupon =await coupon.findOne({couponCode: data.couponName});
        let cartSubtotal = parseFloat(data.cartSubtotal);
        console.log(data,"this is data");
        console.log(activecoupon,"activecoupoooooooooon");
        if(!activecoupon){
          resolve({status: false, message: 'Invalid Coupon'})
        } else{
          console.log('inseide else');
          console.log(activecoupon.couponMinAmount,"couponMinAmountTGHUS");
          if(activecoupon.couponMinAmount <= cartSubtotal){
            const discountedAmount = (cartSubtotal * activecoupon.couponDiscount).toFixed(2);
            cartSubtotal = cartSubtotal - discountedAmount;
            console.log(cartSubtotal,"catsubtotal after calculation");
            resolve({status: true, cartSubtotal: cartSubtotal, discountedAmount:discountedAmount, message: "Coupon Applied Successfully" })
          } else{
            resolve({status: false, message: 'Cannot apply coupon'})
          }
          
        }
      } catch(error){
        reject(error)
      }
    })
  },

  myorders: (user) => {
    return new Promise(async(resolve,reject)=>{
        await order.find({user_id: user}).then((orders)=> {
          console.log(orders,"this is orders from collection");
          if(orders){
            resolve({status: true, orders: orders})
          }
          else {
            resolve({status: false})
          }
        })
        
    })
  },

  userAccount: (userId) =>{
    return new Promise(async(resolve, reject) => {
      // try{
      //     const userDetails = await user.find({_id: userId});
      // if(!userDetails){
      //     resolve({status: false, message: 'No datas found'})
      // } else{
      //     resolve({status: true, userDetails: userDetails})
      // }
      // } catch(error){
      //     console.log(error);
      // }
      
  })
  }
  
};
