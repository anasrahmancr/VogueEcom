const adminHelpers = require("../../helpers/adminHelpers");
const {dashboardDatas} = require('../../helpers/dashboardHelpers')

module.exports = {
  adminLogin: (req, res) => {
    try{
      const errorMessage = req.session.adminerrorMessage || null;
    req.session.adminerrorMessage = null;
    console.log(errorMessage,"err message ");
    res.render("admin/login",{errorMessage});
    } catch(error){
      console.log(error.message);
    }

  },

  adminLoginData: (req, res) => {
   
    if (req.session.adminLoggedIn) {
      res.redirect("/admin");
    } else {
        adminHelpers.adminLoginDatas(req.body).then((response) => {
          if (response.status) { 
            req.session.adminLoggedIn = true;
            req.session.admin = response.adminLogin.adminName;
            const admin = req.session.admin;            
            // dashboardDatas().then((response)=>{
            //   res.render("admin/dashboard",{admin: admin, totalAmount: response.totalAmount, orderCount: response.orderCount}); 
            // })
            res.redirect('/admin')
          } else{
            const errorMessage = response.message;
            res.render("admin/login", { errorMessage });
          }

        })
       .catch ((error) => {
        // res.render("admin/login", { messages: error.message });
      });
    }
  },

  adminLogout: (req, res) => {
    try{
      req.session.destroy();
    res.render("admin/login");
    } catch(err){
      console.log(err.message);
    }
    
  },
};
