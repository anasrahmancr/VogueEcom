const order = require('../models/order')

module.exports = {
    salesReport: () => {
        return new Promise(async(resolve, reject) => {
            try{
                const salesreport = await order.find();
            if(!salesreport){
                resolve({status: false, message: 'No datas found'})
            } else{
                resolve({status: true, salesreport: salesreport})
            }
            } catch(error){
                console.log(error);
            }
            
        })
    }
}