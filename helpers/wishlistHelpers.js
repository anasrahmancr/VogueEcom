
const wishlist = require('../models/wishlist')
const { ObjectId } = require("mongodb");
const { inspect } = require('util');

module.exports = {
    addwishlist: (prodId, userId) => {
        return new Promise(async (resolve, reject) => {
          try {
            const wishList = await wishlist.findOne({ userId: userId }).populate()
            if (wishList) {
                console.log(wishList.items.prodId, " wishlist ietms.prodId", prodId,'new objdiddd', wishList,'wishliiiisttt');
                const result = wishList.items.findIndex((item) => item.prodId == prodId);
              if (result !== -1) {
                resolve({ status: true, message: 'Product Already in the Cart' });
                return;
              }
              await wishlist.updateOne(
                { userId: userId },{ $push: { items: {prodId: prodId }} }
              );
              resolve({ status: true, message: 'Item added to wishlist' });
            } else {
              const userWishList = new wishlist({
                userId: userId,
                productId: [prodId],
              });
              await userWishList.save();
              resolve({ status: true, message: 'Item added to wishlist' });
            }
          } catch (error) {
            console.error('Error:', error);
            reject(error);
          }
        });
      },
      

      getWishlist: (user) => {
        return new Promise(async (resolve, reject) => {
          try {
            const getWishlist = await wishlist.findOne({ userId: user }).populate('items.prodId').lean();
      
            if (getWishlist) {
              resolve({ status: true, getWishlist });
            } else {
              resolve({ status: false, message: 'Wishlist is Empty' });
            }
          } catch (error) {
            console.error('Error:', error);
            reject(error);
          }
        });
      },

      removeWishList: (prodId, userId) => {
        return new Promise(async(resolve, reject)=>{
            const Wishlist = await wishlist.findOne({userId: userId});
            if(!Wishlist){
                resolve({status:false, message: 'Wishlist Not found'});
                return;
            }
            const result = Wishlist.items.findIndex((item) => item.prodId == prodId);
            // console.log(result,"result");
            // console.log(Wishlist.items[result]);
            if(result !== -1){
            //    const reslt = await wishlist.deleteOne({userId: userId},{items: Wishlist.items[result] });;
            //    console.log(reslt, 'deleted ');
               await wishlist.updateOne(
                { userId: userId },
                { $pull: { items: { prodId: prodId } } }
              );
              const wish = await wishlist.find({userId: userId}).populate('items.prodId').lean();
              console.log(wish,"wishwhshshhshs");
                
                resolve({wish: wish, status: true, message: 'Item removed successfully from Wishlist'})
            }
            
        })
      }
      
}