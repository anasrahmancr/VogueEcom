const { cart, getCart, removefromCart} = require('../../helpers/productHelpers')
const {changeproQuantity, addCartTotal, getactivecoupon} = require('../../helpers/userHelpers')

module.exports = {
    cartData: (req,res) => {
        getCart(req.session.user._id).then((response) =>{
            if(response.status){
                const cartItems = response.userCart;
                const userId = req.session.user._id;
                const couponData = response.couponData;
                res.render('user/cart',{cartItems, userId, couponData})
            }
            else{
                res.render('user/cartEmpty');
            }
        })  
    },

    addToCart: (req,res) => {
        const prodId = req.params.id;
        const userId = req.session.user._id;
        const quantity = req.body.quantity;

            cart(prodId, userId, quantity).then((response)=> {
               if(response.status){
                res.status(200).json({ message: "Product added to cart" })
               }
            })
            .catch((error) => {
                res.status(500).json({ error: "An error occurred while adding the product to cart" });
              });
    },

    changeQuantity: (req, res) => {
        const userId = req.session.user._id;
        changeproQuantity(req.body, userId).then((response)=> {
            if(response){
                let quantity = response.quantity;
                let subTotal = response.subTotal;
                let total = response.total;
                res.json({ quantity: quantity, subTotal : subTotal, total: total });
            }else{
                res.json({message:'Error' });
            }
        })
    },

    removeFromCart: (req,res) => {
        const prodId = req.params.id;
        const user = req.session.user._id;
        removefromCart(prodId, user).then((response)=>{
            if(response.status){
                const status = response.status;
                const message = response.message;
                const updatedCart = response.updatedCart;
                res.json({status:status, message: message, updatedCart: updatedCart})
            }
            else{
                res.json({status:false, message: 'No actions Occured'})
            }
        })
    },

    cartTotal: (req,res)=>{
        const total = parseInt(req.params.id);
        addCartTotal(total, req.session.user._id).then(response => {
            try{
                if(response){
                    res.json({status: true})
                }
                else{
                    res.json({status: false})
                }
            }
            catch(error){
            }
        })
    },

    getActiveCoupon:(req, res) => {
        getactivecoupon(req.body).then(response => {
            if(response.status){
                res.json({status: response.status,cartSubtotal: response.cartSubtotal,
                     discountedAmount: response.discountedAmount, message: response.message })
            }
            else{
                res.json({message: response.message, status: response.status})
            }
        })
    }
}