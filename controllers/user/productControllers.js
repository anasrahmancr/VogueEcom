const { shopProducts, testshop} = require("../../helpers/userProductListHelp");
const { findProductdetails} = require("../../helpers/productHelpers");
const { response } = require("express");

module.exports = {
    womens: (req,res) => {
        res.render('user/women') 
    },

    mens: (req,res) => {
        res.render('user/men')
    },

    kids: (req,res) => {

    },
    shopView: (req,res) => {
        const itemsPerPage = 9;
        const currentPage = parseInt(req.query.page) || 1;
        shopProducts(itemsPerPage, currentPage).then(response => {
            res.render('user/shop',{currentPage: response.currentPage, products: response.products, totalPages: response.totalPages, totalProducts: response.totalProducts})
        })
    },

//     shopView: (req, res) => {
//         const itemsPerPage = 9;
//         const currentPage = parseInt(req.query.page) || 1;
//         const sortOption = req.query.sort || 'featured'; // Get the selected sort option from query parameter
        
//         shopProducts(itemsPerPage, currentPage, sortOption)
//           .then(response => {
//             res.render('user/shop', {
//               currentPage: response.currentPage,
//               products: response.products,
//               totalPages: response.totalPages,
//               totalProducts: response.totalProducts,
//               sort: sortOption // Pass the sort option to the view
//             });
//           })
//           .catch(error => {
//             res.status(500).send('An error occurred');
//           });
// },

    productDetails: (req,res) => {
        const prodId = req.params.id;
        findProductdetails(prodId).then(response => {
            const product = response.item;
        res.render('user/productDetails',{prod:product})
    })
    },

    testShop: (req, res) => {
        const itemsPerPage = 9;
        const currentPage = parseInt(req.query.page) || 1;
        testshop(itemsPerPage, currentPage).then(response => {
            res.render('user/testShop',{currentPage: response.currentPage, products: response.products, totalPages: response.totalPages})
        })
    }
}