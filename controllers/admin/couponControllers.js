const {addcoupons, showcoupons, editcoupon, updatecoupon, deletecoupon} = require('../../helpers/couponHelpers')

module.exports = {
    // get addCoupon Page
    addcoupon: (req, res) => { 
       req.session.errorMessage = null;
       const errorMessage = req.session.errorMessage;
       res.render('admin/addCoupon',{errorMessage: errorMessage});
    },

    // post addCoupon Data
    addCoupons: (req, res) => {
        try{
            addcoupons(req.body).then(response => {
                if(response.status){
                    res.redirect('/admin/showCoupons')
                } else{
                    res.render('admin/addCoupon', {errorMessage: response.message})
                }
              })
        } catch(error){
            
        }
      
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