const { filterProducts, shopProducts, testshop} = require("../../helpers/userProductListHelp");
const { findProductdetails} = require("../../helpers/productHelpers");

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
        let query = {}
        if (req.session.query) {
            query = req.session.query
            console.log(query,"inside fif query");
        } else{
            query = req.query.sort; 
        }
        const page =  req.query.page ? req.query.page : 1;
        console.log(query, page,"fil, page");
        req.session.query = query;
        filterProducts(query).then(data => {
            shopProducts(data, page).then(response => {
                res.render('user/shop',{currentPage: response.currentPage, products: response.products, totalPages: response.totalPages, totalProducts: response.totalProducts})
            })
        })  
    },

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