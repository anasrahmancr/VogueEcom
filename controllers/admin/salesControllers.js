const {salesReport} = require('../../helpers/salesReportHelper')

module.exports = {
    salesreport: (req, res) => {
        salesReport().then(response => {
            if(response.status){
                const salesreports = response.salesreport;
                res.render('admin/salesReport', {orders: salesreports})
            } else{
                res.redirect('/admin')
            }
        })
        
    }
}