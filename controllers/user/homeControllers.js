const {getActiveBanner} = require('../../helpers/bannerHelpers')
const {product} = require('../../models/product')
const {homePageProducts} = require('../../helpers/userProductListHelp')

module.exports = {
    homePage: (req,res) => {
        getActiveBanner().then(response => {
            if(response.status){
                const activeBanner = response.activeBanner;
               homePageProducts().then((items)=>{
                res.render('index', {activeBanner: activeBanner, products: items} );
               })
                
            }
            else{
                res.render('index');
            }
        })
},

    aboutPage: (req,res) => {
        res.render('user/about')
    },

    blog: (req,res) => {
        res.render('user/blog')
    },

    contact: (req,res) => {
        res.render('user/contact')
    }
}

