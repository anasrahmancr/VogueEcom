const Product = require('../models/product')
const Category = require('../models/category')
// const pagination = require('pagination')


module.exports = {
    getWomenData: () => {
        return new Promise(async(resolve,reject) => {
            Category.findOne({ categoryName: 'Women' })
  .then(category => {
    // Find all the products that belong to the "Women" category
    Product.find({ category: category._id })
      .then(products => {
        resolve(products) // Display the products that belong to the "Women" category
      })
      .catch(err => console.error(err));
  })
  .catch(err => console.error(err));
        })
    },

    shopProducts: (itemsPerPage, currentPage) => {
       return new Promise(async(resolve,reject)=>{
        try {
          const skip = (currentPage - 1) * itemsPerPage;
          const totalProducts = await Product.countDocuments();
          const products = await Product.find().skip(skip).limit(itemsPerPage);
          const totalPages = Math.ceil(totalProducts / itemsPerPage);
          resolve({currentPage: currentPage, products: products, totalPages: totalPages, totalProducts: totalProducts})
        } catch (error) {
          res.status(500).send('An error occurred');
        }
     
       })
    },

    // shopProducts: (itemsPerPage, currentPage, category, minPrice, maxPrice, searchQuery) => {
    //   return new Promise(async (resolve, reject) => {
    //     try {
    //       const skip = (currentPage - 1) * itemsPerPage;
    //       const totalProducts = await Product.countDocuments();
    //       let query = Product.find();
    
    //       // Apply sorting based on the selected sort option
    //       switch (sortOption) {
    //         case 'lowToHigh':
    //           query = query.sort({ productSalePrice: 1 });
    //           break;
    //         case 'highToLow':
    //           query = query.sort({ productSalePrice: -1 });
    //           break;
    //         case 'releaseDate':
    //           query = query.sort({ releaseDate: 1 });
    //           break;
    //         default:
    //           // Default to sorting by featured (can be adjusted based on your implementation)
    //           query = query.sort({ featured: -1 });
    //           break;
    //       }
    
    //       const products = await query.skip(skip).limit(itemsPerPage);
    //       const totalPages = Math.ceil(totalProducts / itemsPerPage);
    //       resolve({
    //         currentPage: currentPage,
    //         products: products,
    //         totalPages: totalPages,
    //         totalProducts: totalProducts
    //       });
    //     } catch (error) {
    //       reject(error);
    //     }
    //   });
    // },
    

    testshop: (itemsPerPage, currentPage) => {
      return new Promise(async(resolve, reject) => {
        try {
          const skip = (currentPage - 1) * itemsPerPage;
          const totalProducts = await Product.countDocuments();
          const products = await Product.find().skip(skip).limit(itemsPerPage);
          const totalPages = Math.ceil(totalProducts / itemsPerPage);
          resolve({currentPage: currentPage, products: products, totalPages: totalPages})
        } catch (error) {
          res.status(500).send('An error occurred');
        }
      })
    }
}