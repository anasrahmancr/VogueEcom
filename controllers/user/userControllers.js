const { myorders, userAccount } = require("../../helpers/userHelpers");

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
    userAccount(req.session.user._id).then((response) => {});
    res.render("user/userAccount");
  },
};
