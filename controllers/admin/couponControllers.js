const {addcoupons, showcoupons, editcoupon, updatecoupon, deletecoupon} = require('../../helpers/couponHelpers')

module.exports = {
    // get addCoupon Page
    addcoupon: (req, res) => { 
        res.render('admin/addCoupon');
    },

    // post addCoupon Data
    addCoupons: (req, res) => {
      addcoupons(req.body).then(response => {
        if(response.status){
            res.redirect('/admin/showCoupons')
        }
      })
    },

    showCoupons:(req, res) => {
        const itemsPerPage = 9;
        const currentPage = parseInt(req.query.page) || 1;
        showcoupons(itemsPerPage, currentPage).then(response => {
            if(response.status){
                res.render('admin/showCoupon',{currentPage: response.currentPage, showcoupon: response.coupons, totalPages: response.totalPages})
            } else{
                console.log('some errors occured');
            }
        })
    },

    editCoupon: (req, res) => {
        editcoupon(req.params.id).then(response => {
            if(response.status){
                res.render('admin/editCoupon',{editcoupon: response.editcoupon})
            }
        })
    },

    updatedCoupon: (req, res) => {
        updatecoupon(req.params.id, req.body).then(response => {
            if(response.status){
                res.redirect('/admin/showCoupons')
            }
        })
    },

    deleteCoupon: (req, res) => {
        deletecoupon(req.params.id).then(response => {
            res.json({status: response.status, message: response.message});
        })
    }

}  