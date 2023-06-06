const orders = require('../models/order')

module.exports = {
    dashboardDatas: () => {
        return new Promise(async(resolve, reject) => {
            try{
                const aggregateData = await orders.aggregate([
                    {
                      $group: {
                        _id: null,
                        totalAmount: { $sum: "$totalAmount" },
                        orderCount: { $sum: 1 }
                      }
                    }
                  ]).exec();
                  const totalAmount = aggregateData.length > 0 ? aggregateData[0].totalAmount : 0;
                  const orderCount = aggregateData.length > 0 ? aggregateData[0].orderCount : 0;
            resolve({totalAmount: totalAmount, orderCount: orderCount})
        } catch(error){
            console.log(error)
        }
        })
    }
}