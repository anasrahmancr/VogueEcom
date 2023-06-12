const Order = require('../models/order')

module.exports = {
    getOrderList: (itemsPerPage, currentPage) =>{
        return new Promise(async(resolve, reject) => {
            try {
                const skip = (currentPage - 1) * itemsPerPage;
                const totalOrders = await Order.countDocuments();
                const orders = await Order.find().sort({ createdAt: -1 }).skip(skip).limit(itemsPerPage);
                const totalPages = Math.ceil(totalOrders / itemsPerPage);
                resolve({currentPage: currentPage, orders: orders, totalPages: totalPages})
              } catch (error) {
                res.status(500).send('An error occurred');
              }
        })
    }, 

    viewDetailsOrder: (orderId) => {
        return new Promise(async(resolve, reject) => {
            try {
                const orderDetails = await Order.findOne({_id: orderId}).populate('products.prodId');
                // const productsOrdered = orderDetails.products;
                console.log(orderDetails,"ordered detaisl product");
                resolve(orderDetails)
              } catch (error) {
                console.log(error.message,"err messsage");
              }
        })
    },
}