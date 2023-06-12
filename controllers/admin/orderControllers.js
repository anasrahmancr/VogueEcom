const {getOrderList, viewDetailsOrder} = require('../../helpers/adminSideOrderHelper')

module.exports = {
    orderManagement: (req,res) => {
        const itemsPerPage = 9;
        const currentPage = parseInt(req.query.page) || 1;
        getOrderList(itemsPerPage, currentPage).then(response => {
            if(response){
                res.render('admin/ordersList',{currentPage: response.currentPage, orders: response.orders, totalPages: response.totalPages})
            } else{
                console.log("Some Error Occured");
            }
        })
        
    },

    viewOrderDetails: (req, res) => {
        try{
            viewDetailsOrder(req.params.id).then(orderDetails => {
                res.render('admin/viewOrders',{orderDetails})
            })
        } catch(error){
            console.log(error.message);
        }
        
    },
 
    changeOrderStatus: (req, res)=> {
        
    }
}
