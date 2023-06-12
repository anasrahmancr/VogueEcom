const express = require('express');
const router = express.Router();
const{homePage, aboutPage, blog, contact} = require('../controllers/user/homeControllers')
const userAuths = require('../controllers/user/authControllers')
const {cartData, addToCart, changeQuantity, removeFromCart, cartTotal, getActiveCoupon} = require('../controllers/user/cartControllers')
const {addWishlist, wishlist, removeFromWishlist} = require('../controllers/user/wishlistControllers')
const {mens,womens,kids,shopView, productDetails, testShop} = require('../controllers/user/productControllers')
const {userLogin, userheaderMiddleware, categoriesMiddleware} = require('../util/middleware')
const {checkout, placeOrder, verifyPayment, codSuccess, cancelOrder, returnProducts, vieworderedProducts} = require('../controllers/user/orderControllers')
const {myOrders, userAccount, userAccountDetails} = require('../controllers/user/userControllers');
const {headCartCount, headWishlistCount} = require('../controllers/user/userHeaderControllers')


router.use(userheaderMiddleware);
router.use(categoriesMiddleware);


// Home Page
router.get('/',homePage);

// Navbar
router.get('/headerCartCount/:id', headCartCount);
router.get('/headerWishlistCount/:id', headWishlistCount);

router.get('/about',aboutPage)
router.get('/blog',blog)
router.get('/contact',contact)

// User Account
router.get('/userAccount',userLogin, userAccount)
router.get('/myOrders', userLogin, myOrders)
router.get('/userAccountDetails', userLogin, userAccountDetails)


// Authentication

router.get('/login',userAuths.userLogin)
router.post('/loginData', userAuths.userLoginData)
router.get('/logout',userAuths.userLogout)

router.get('/signup',userAuths.userSignup)
router.post('/signup',userAuths.userSignupData)

router.get('/otpVerify',userAuths.otpVerification)
router.post('/otpverify',userAuths.otpData)

// Shop  Men women kids 

router.get('/women',womens);
router.get('/menProducts',mens)
router.get('/kid',kids)
router.get('/shop',shopView)
router.get('/testShop',testShop)

// Product Details Page

router.get('/productDetails/:id', productDetails)

// Cart Related

router.post('/addtoCart/:id', addToCart)
router.post('/removeFromCart/:id', removeFromCart)
router.get('/userCart',userLogin, cartData)
router.post('/changeQuantity',userLogin, changeQuantity)
router.post('/cartTotal/:id', userLogin, cartTotal)

// Coupon 

router.post('/couponData',userLogin, getActiveCoupon)

// Order Related

router.get('/checkout',userLogin,checkout)
router.post('/placeOrder',userLogin, placeOrder)
router.post('/verifypayment',userLogin, verifyPayment)
router.get('/codSuccess',userLogin, codSuccess)

router.post('/cancelOrder/:id', userLogin, cancelOrder)
router.post('/returnProducts/:id', userLogin, returnProducts)
router.get('/viewOrderedProducts/:id', userLogin, vieworderedProducts)


// Wishlist

router.post('/addToWishlist/:id',userLogin,addWishlist)
router.get('/wishlist', userLogin, wishlist)
router.post('/removeFromWishlist/:id',userLogin, removeFromWishlist)

module.exports = router;
