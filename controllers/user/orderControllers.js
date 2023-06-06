const {getCart, orderPlace, verifypayment, changePaymentStatus, cancelorder, returnproducts, viewOrderedProducts} = require('../../helpers/orderHelpers')

module.exports = {
    checkout: (req,res) => {
        getCart(req.session.user._id).then(response => {
            try{
                if(response){
                    const user = req.session.user;
                    const items = response.items;
                    const total = response.Total;
                    res.render('user/checkout',{user, items, total});
                }
                else{
                    console.log('No checkout');
                }
            }
            catch(error){
                res.render('error', { error });
            }
        }).catch(error => {
            res.render('error', { error });
        })
    },

    placeOrder: (req, res) => {
        const user = req.session.user._id;
        orderPlace(req.body, user).then(response => {
            if(req.body.payment_option === 'COD'){
                res.json({status: 'codSUCCESS'})
            }
            else if(req.body.payment_option === 'onlinepayment'){
                res.json(response)
            } 
        })
    },
    codSuccess: (req,res) => {
        res.render('user/codSuccess');
    },

    verifyPayment:(req, res) => {
        const user = req.session.user._id
        verifypayment(req.body).then(() => {
            changePaymentStatus(req.body['order[receipt]'],user).then((response) => { 
                res.json({status: response.status})
            })
        }).catch((err)=>{
            res.json({status: false, errorMessage:"Error"})
        })
    },

    cancelOrder: (req, res) => {
        console.log('TEST CANCEL ORDER');
        cancelorder(req.params.id).then(response=> {
            if(response.status){
                res.json({ status: true, message: response.message });
            } else{
                res.json({ status: false, message: response.message });
            }
        }).catch(error => {
            // Error occurred during cancellation
            res.status(500).json({ message: 'Error cancelling order', error });
          });
    },

    returnProducts: (req, res) => {
        returnproducts(req.params.id).then(response=> {
            if(response.status){
                res.json({ status: true, message: response.message });
            } else{
                res.json({ status: false, message: response.message });
            }
        }).catch(error => {
            // Error occurred during cancellation
            res.status(500).json({ message: 'Error cancelling order', error });
          });
    },

    vieworderedProducts: (req, res) => {
        viewOrderedProducts(req.params.id).then(response => {

        })
    }
}