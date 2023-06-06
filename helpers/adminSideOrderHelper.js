const Order = require('../models/order')

module.exports = {
    getOrderList: (itemsPerPage, currentPage) =>{
        return new Promise(async(resolve, reject) => {
            try {
                const skip = (currentPage - 1) * itemsPerPage;
                const totalOrders = await Order.countDocuments();
                const orders = await Order.find().skip(skip).limit(itemsPerPage);
                const totalPages = Math.ceil(totalOrders / itemsPerPage);
                resolve({currentPage: currentPage, orders: orders, totalPages: totalPages})
              } catch (error) {
                res.status(500).send('An error occurred');
              }
            /////////////////////////
            await Order.find().then((orders)=> {
                if(orders){
                    resolve({status: true, orders: orders});
                } else{
                    resolve({status: false})
                }
            })
        })
    }
}