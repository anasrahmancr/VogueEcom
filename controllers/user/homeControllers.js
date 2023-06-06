const {getActiveBanner} = require('../../helpers/bannerHelpers')

module.exports = {
    homePage: (req,res) => {
        getActiveBanner().then(response => {
            if(response.status){
                const activeBanner = response.activeBanner;
                res.render('index', {activeBanner: activeBanner} );
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

