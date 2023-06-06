const {dashboardDatas} = require('../../helpers/dashboardHelpers')

module.exports = {
  dashboard: (req, res) => {
    dashboardDatas().then((response)=>{
      res.render("admin/dashboard",{totalAmount: response.totalAmount, orderCount: response.orderCount}); 
    })
    
  }

};
 