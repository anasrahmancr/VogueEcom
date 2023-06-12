const { myorders, userDetails } = require("../../helpers/userHelpers");

module.exports = {
  myOrders: (req, res) => {
    try {
      const user = req.session.user._id;
      myorders(user).then((response) => {
        if (response.status) {
          res.render("user/ordersList", { orders: response.orders });
        } else {
          console.log("errror");
        }
      });
    } catch (error) {}
  },

  userAccount: (req, res) => {
    res.render("user/userAccount");
  },

  userAccountDetails:(req, res) => {
    try{
      console.log('tssttt');
      console.log(req.session.user._id,"idddddddddddddddddd");
    userDetails(req.session.user._id).then(response => {
        res.render('user/userAccDetails')
    })
      } catch(error){
        console.log(error.message);
      }
    }
};
