const product = require("../models/product");
const Category = require("../models/category");
const { ObjectId } = require("mongodb");
const Cart = require("../models/cart");
const coupon = require('../models/coupon')

// const { map } = require('../app')

module.exports = {
  productData: (data, files) => {
    return new Promise(async (resolve, reject) => {
      let images = files.map((file) => file.filename);
      let {
        mycategory,
        productname,
        productdescription,
        productprice,
        productdiscountprice,
        productsaleprice,
        brandName,
      } = data;

      let productData = new product({
        productName: productname,
        productPrice: productprice,
        productDiscountPrice: productdiscountprice,
        productSalePrice: productsaleprice,
        productDescription: productdescription,
        brands: brandName,
        category: mycategory,
        // subCategory: subcategory,
        // Stock: [{ Size: size }, { Quantity: quantity }],
        productImages: images,
      });

      await productData.save();
      resolve({ productData, status: true });
      // }
      // }
      // catch(error){
      //     reject(error)
      // }
    });
  },

  addCategory: (data) => {
    return new Promise(async (resolve, reject) => {
      const { categoryname } = data;
      const checkDuplicate = await Category.find({categoryName: categoryname})
      if(!checkDuplicate){
        const categoryData = new Category({
          categoryName: categoryname,
        });
        categoryData.save();
        resolve({ categoryData, status: true });
      } else{
        resolve({status: false, message: 'Provide a Unique Name'})
      }
      
    });
  },

  getCategory: () => {
    return new Promise(async (resolve, reject) => {
      let category = await Category.find();

      resolve(category);
    });
  },
  editproduct: (image, data, prodId) => {
    return new Promise(async (resolve, reject) => {
      try{
        const products = await product.findOne({ _id: new Object(prodId) });
        if(!products){
          resolve({status: false})
        } else{
          const updateProducts = await product.updateOne({_id: new Object(prodId)}, {
            productName: data.productname,
            productPrice: data.productprice,
            productDiscountPrice: data.productdiscountprice,
            productSalePrice: data.productsaleprice,
            productDescription: data.productdescription,
            brands: data.brandName,
            category: data.mycategory,       
            productImages: image,
          })
          resolve({status: true})
        }
      } catch(error){
          reject(error)
      }
    });
  },

  getProducts: (itemsPerPage, currentPage) => {
    return new Promise(async (resolve, reject) => {
      try {
        const skip = (currentPage - 1) * itemsPerPage;
        const totalProducts = await product.countDocuments();
        const products = await product.find().sort({ updatedAt: -1 }).skip(skip).limit(itemsPerPage);
        const totalPages = Math.ceil(totalProducts / itemsPerPage);
        resolve({currentPage: currentPage, products: products, totalPages: totalPages})
      } catch (error) {
        res.status(500).send('An error occurred');
      }
    }); 
  },

  findProduct: (proId) => {
    return new Promise((resolve, reject) => {
      product
        .findById(proId).then((item) => {
          if(!item){
            resolve({status: false})
          } else{
            resolve({status: true, item: item});
          }
        })
        .catch((error) => {
          console.log(error);
          reject();
        });
    });
  },

  findProductdetails: (proId) => {
    return new Promise((resolve, reject) => {
      product.findById(proId).then((item) => {
          if(!item){
            resolve({status: false})
          } else{
            resolve({status: true, item});
          }
        })
        .catch((error) => {
          console.log(error);
          reject();
        });
    });
  },

  deleteProducts: (data) => {
    return new Promise(async (resolve, reject) => {
      let item = await product.findById(data);
      if (!item) {
        resolve({ status: false });
      } else {
        await product.deleteOne(item);
        resolve({ status: true });
      }
    });
  },

  updateProducts: (data) => {},

  
  cart: (prodData, userData, quantity) => {

    return new Promise(async (resolve, reject) => {
      try{
      const cart = await Cart.findOne({ user_id: new ObjectId(userData) })
      if (!cart) {
        let newCart = new Cart({
          user_id: userData,
          items: [{ prodId: prodData, quantity: quantity }],
        });
        await newCart.save();
        resolve({status: true})
      } else {
        let result = cart.items.findIndex((item) => item.prodId == prodData);
        
        if (result !== -1) {
        await Cart.updateOne({user_id: userData, 'items.prodId': prodData},{$inc: {'items.$.quantity': quantity}})
        } else {
          await Cart.updateOne({user_id:userData},
             { $push:{items: { prodId: prodData, quantity: quantity } }},
          );
        }
        resolve({status: true})
      }
    }
    catch(error){
      reject(error)
    }
    });
  },

  getCart: (user) => {
    return new Promise(async(resolve, reject)=>{
      try {
       const userCart = await Cart.findOne({user_id: user}).populate('items.prodId').lean();
       if(userCart){
        const couponData = await coupon.find({Status: true});
        if(couponData){
          resolve({status: true, userCart: userCart, couponData: couponData});
        } else {
        resolve({status: true, userCart: userCart});
        }
       }
       else{
        resolve({status: false})
       }
      } catch (error) {
        reject(error);
      }  
    })
  },

  removefromCart: (prodId, user) => {
    return new Promise(async (resolve, reject) => {
      try {
        const cart = await Cart.findOne({ user_id: user });//.populate('items.prodId').lean();
        if (!cart) {
          reject({ status: false, message: 'Cart not found' });
          return;
        }
        
        // for(let i=0; i<cart.items.length; i++){
        //   if (cart.items[i].prodId == prodId) {
        //     itemIndex = i;
        //   }
        // }
        // if (itemIndex === -1) {
        //   reject({ status: false, message: 'Item not found in cart' });
        //   return;
        // }
  
        await Cart.updateOne(
          { user_id: user },
          { $pull: { items: { prodId: prodId } } }
        );
  
        const updatedCart = await Cart.findOne({user_id:user}).populate('items.prodId').lean();;
        resolve({ status: true, message: 'Item removed from cart', updatedCart: updatedCart });
      } catch (error) {
        reject({ status: false, message: error.message });
      }
    })
    .catch(error => {
      // Handle any unhandled promise rejections here
      throw error;
    });
  }
  
  
  
};
