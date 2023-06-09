const {addwishlist, getWishlist, removeWishList} = require('../../helpers/wishlistHelpers')

module.exports = {
    addWishlist: (req, res) => {
        const userId = req.session.user._id;
        addwishlist(req.params.id, userId).then(response=>{
           res.json({message: response.message});
        })
    },

    wishlist: (req, res) => {
        const user = req.session.user._id;
        getWishlist(user).then(response => {
            if(response.getWishlist){
                const wishlist = response.getWishlist;
                res.render('user/wishlist',{wishlist:wishlist});
            }
            else{
                // alert(
                //     'No wishlist found'
                // )
                res.redirect('/');
            }
        })
            
    },

    removeFromWishlist:(req,res) => {
        const user = req.session.user._id;
        removeWishList(req.params.id, user).then(response => {
            const message = response.message;
            const wish = response.wish;
            const status = response.status;
            res.json({message: message, wish: wish, status: status});
        })
    }
}