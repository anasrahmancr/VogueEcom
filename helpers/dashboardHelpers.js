const Orders = require("../models/order");
const Category = require('../models/category');
const products = require('../models/product');
const user = require('../models/user');

module.exports = {
  //////// getSalesDetails //////////
  getSalesDetails: () => {
    return new Promise((resolve, reject) => {
      Orders
        .aggregate([
          {
            $group: {
              _id: { $month: "$date" },
              totalAmount: { $sum: "$totalAmount" },
            },
          },
        ])
        .then((salesByMonth) => {
          resolve(salesByMonth);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  getYearlySalesDetails: () => {
    return new Promise((resolve, reject) => {
      Orders
        .aggregate([
          {
            $group: {
              _id: { $year: "$date" },
              totalAmount: { $sum: "$totalAmount" },
            },
          },
        ])
        .then((salesByYear) => {
          
          resolve(salesByYear);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  adminAllOrders:()=>{
    return new Promise((resolve,reject)=>{
        Orders.find().populate([{
            path:'user_id',
            select:'userName'
        },{
            path:'products.prodId',
            select:'productName'
        }]).then((allOrders)=>{
            
            resolve(allOrders)
        }).catch((error)=>{
            reject(error)
        })
    })
},

getOrdersByDate:async()=>{
  try{
      const ordersByDate = await Orders.aggregate([
          {
              $group:{
                  _id:{
                      month:{ $month:"$date"},
                      year:{ $year:"$date"}
                  },
                  count:{$sum:1}
              }
          }
      ]);
      
      return ordersByDate;
  }catch(error){
      throw new Error(error)
  }
},

getCategorySales:async()=>{
  try{
      const orders = await Orders.find().populate('products.prodId','category');
      const categorySales = {}
      orders.forEach(order=>{
          order.products.forEach(product=>{
              const ProductCategory = product.prodId.category
              if(ProductCategory){
                  if(ProductCategory in categorySales){
                      categorySales[ProductCategory] += 1;
                  }else{
                      categorySales[ProductCategory] = 1;
                  }
              }
          })
      })
      const allCategories = await Category.find()
      const result = allCategories.map(category=>{
          const count = categorySales[category.categoryName] || 0
          return {name:category.categoryName,count}
      })
     
      return result;
  }catch(error){
      throw error
  }
},

fetchallProducts: () => {
  return new Promise((resolve, reject) => {
      products.find().then((products) => {
          resolve(products)
      }).catch((error) => {
          console.log(error);
          reject(error);
      })
  })
},

getAllUsers:()=>{
  return new Promise((resolve,reject)=>{
      user.find().then((allUsers)=>{
          resolve(allUsers)
      }).catch((err)=>{
          console.log(err);
          reject(err)
      })
      
  })
},
};
