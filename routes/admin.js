const express = require('express');
const router = express.Router();
// const multer = require('multer')
const upload = require('../config/multer')
const {dashboard} = require('../controllers/admin/homeControllers')
const {productManagement, addProducts, addProductData, editProducts, editProductData, category, addCategory, deleteProduct} = require('../controllers/admin/productControllers')
const {userManagement, blockUser, unBlockUser, editUser} = require('../controllers/admin/userControllers')
const {orderManagement, changeOrderStatus} = require('../controllers/admin/orderControllers')
const {addCoupons, showCoupons, addcoupon, editCoupon, updatedCoupon, deleteCoupon} = require('../controllers/admin/couponControllers')
const {addBanner, listBanner, addBannerData, editBanner, updateBanner, deleteBanner} = require('../controllers/admin/bannerControllers')
const {salesreport} = require('../controllers/admin/salesControllers')
const {adminLogin,adminLoginData,adminLogout} = require('../controllers/admin/authControllers')
const {adminTrue, adminMiddleware, adminheaderMiddleware} = require('../util/middleware')

router.use(adminMiddleware)
// router.use(adminheaderMiddleware)

// DASHBOARD
router.get('/',adminTrue,dashboard)

//Auth
router.get('/adminLogin',adminLogin)
router.post('/adminLogin',adminLoginData)
router.get('/adminLogout',adminLogout)

//product Management
router.get('/productManagement',adminTrue,productManagement)
router.get('/addProducts',adminTrue,addProducts)
router.post('/addProducts', adminTrue, upload.array('productimages',4),addProductData)
router.get('/editProducts/:id',adminTrue,editProducts)
router.post('/editProducts/:id', adminTrue ,upload.array('productimages',4), editProductData)
router.post('/updateProduct')
router.get('/deleteProduct/:id', deleteProduct)
 
//Category Management
router.get('/category',adminTrue,category)
router.post('/addCategory',addCategory)

//User Management
router.get('/userManagement',adminTrue,userManagement)
router.get('/editUsers/:id', editUser)
router.post('/blockUser/:id', blockUser)
router.post('/unBlockUser/:id', unBlockUser)

// Order Management
router.get('/orderManagement',adminTrue, orderManagement)
router.post('/changeOrderStatus', adminTrue, changeOrderStatus )

//Banner Management
router.get('/addBanners',adminTrue, addBanner)
router.post('/addBanner',adminTrue, upload.array('bannerimages',4), addBannerData )
router.get('/listBanners',adminTrue, listBanner)
router.get('/editBanner/:id', adminTrue, editBanner);
router.post('/editBanner/:id',adminTrue,upload.array('bannerimages',4) ,updateBanner)
router.post('/deleteBanner/:id', adminTrue, deleteBanner);

// Coupons Management
router.get('/addCoupons',adminTrue, addcoupon)
router.post('/addCoupon', adminTrue, addCoupons)
router.get('/showCoupons',adminTrue, showCoupons)
router.get('/editCoupon/:id', adminTrue, editCoupon)
router.post('/editCoupon/:id', adminTrue, updatedCoupon)
router.post('/deleteCoupon/:id', adminTrue, deleteCoupon)

// Sales Report
router.get('/salesReport', adminTrue, salesreport)

module.exports = router;
 