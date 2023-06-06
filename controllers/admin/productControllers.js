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
    const itemsPerPage = 9;
    const currentPage = parseInt(req.query.page) || 1;
      getProducts(itemsPerPage, currentPage).then((response) => {
        res.render('admin/productLists',{currentPage: response.currentPage, products: response.products, totalPages: response.totalPages})
        // res.render("admin/productLists", { products,  admin: true });
      });
  },

  addProducts: (req, res) => {
    getCategory().then((response) => {
      const categories = response;
      res.render("admin/addProducts", { categories, admin:true });
    });
  },

  addProductData: (req, res) => {
    productData(req.body,req.files).then((response) => {
      if (response.status) {
        res.redirect("/admin/productManagement");
      }
    });
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

  editProductData: (req, res) => {
    editproduct(req.body, req.params.id).then(response => {
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
      if (response.categoryData) {
        res.redirect("/admin/category");
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
