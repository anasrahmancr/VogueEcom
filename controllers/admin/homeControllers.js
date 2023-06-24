const {getSalesDetails, getYearlySalesDetails, adminAllOrders, getOrdersByDate,
  getCategorySales, fetchallProducts, getAllUsers} = require("../../helpers/dashboardHelpers");
module.exports = {

  salesgraph: async (req, res) => {
    try {
      const salesByMonth = await getSalesDetails();
      const salesByYear = await getYearlySalesDetails();
      const orders = await adminAllOrders();
      const ordersByDate = await getOrdersByDate();
      const categorySales = await getCategorySales();
      const allProducts = await fetchallProducts();
      const allUsers = await getAllUsers();
      const currentMonth = new Date().getMonth() + 1;
      const currentMonthSales = await salesByMonth.find(
        (sales) => sales._id === currentMonth
      );
    
      res.render("admin/dashboard", {
        salesByMonth,
        salesByYear,
        orders,
        ordersByDate,
        categorySales,
        allProducts,
        allUsers,
        currentMonthSales,
      });
    } catch (error) {
      console.log(error.message);
    }
  },
};
