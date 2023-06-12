const {
  productData,
  addCategory,
  getCategory,
  editproduct,
  getProducts,
  findProduct,
  deleteProducts,
} = require("../../helpers/productHelpers");

module.exports = {
  productManagement: (req, res) => {
    try{
      const itemsPerPage = 9;
    const currentPage = parseInt(req.query.page) || 1;
      getProducts(itemsPerPage, currentPage).then((response) => {
        res.render('admin/productLists',{currentPage: response.currentPage, products: response.products, totalPages: response.totalPages})
      });
    } catch(error){
      console.log(error.message);
    }
  },

  addProducts: (req, res) => {
    try{
      getCategory().then((response) => {
        const categories = response;
        res.render("admin/addProducts", { categories, admin:true });
      });
    } catch(error){
      console.log(error);
    }
  },

  addProductData: (req, res) => {
    try{
      productData(req.body,req.files).then((response) => {
        if (response.status) {
          res.redirect("/admin/productManagement");
        }
      });
    } catch(error){
      console.log(error.message);
    }
  },

  editProducts: (req, res) => {
    const productId = req.params.id;
    findProduct(productId).then((item) => {
      getCategory().then((response) => {
        const categories = response;
        
        res.render("admin/editProducts", { item: item.item, categories});
      });
    });
  },

  // editProductData: (req, res) => {
  //   editproduct(req.body, req.params.id).then(response => {
  //     if(response.status){
  //       res.redirect('/admin/productManagement')
  //     } else{
  //       res.json({message: "error occured"})
  //     }
  //   })
  // },

  editProductData: (req, res) => {
    let new_images = [];
    if(req.files.length > 0){
      req.files.forEach(files => {
        new_images.push(files.filename)
      });
      try{
        req.body.old_image.forEach(files => {
          fs.unlinkSync(`public/productImages/${files}`);
        });
      } catch(err){
        console.log(err);
      }
    } else{
      new_images.push(...req.body.old_image);      
    }
    editproduct(new_images, req.body, req.params.id).then(response => {
      if(response.status){
        res.redirect('/admin/productManagement')
      } else{
        res.json({message: "error occured"})
      }
    })
  },

  category: (req, res) => {
    getCategory().then((response) => {
      const categories = response;
      res.render("admin/category", { categories, admin:true });
    });
  },

  addCategory: (req, res) => {
    addCategory(req.body).then((response) => {
      if (response.status) {
        res.redirect("/admin/category");
      } else{
        res.render('admin/category',{errorMessage: response.message})
      }
    });
  },

  deleteProduct: (req,res) => {
    const prodId = req.params.id;
    deleteProducts(prodId).then(response => {
      res.redirect('/admin/productManagement')
    })
  },


};
