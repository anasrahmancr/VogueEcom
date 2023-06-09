const userHelpers = require("../../helpers/userHelpers");
const {checkBlocked} = require('../../util/middleware')

exports.userLogin = (req, res) => {
  try{
    if (req.session.userLoggedIn) {
      res.redirect("/");
    } else {
      const errorMessage = req.session.errorMessage;
      req.session.errorMessage = null;
      res.render("user/login",{errorMessage});
    }
  } catch(error){
    
  }
  
}; 

exports.userLoginData = (req, res) => {
  userHelpers
    .loginData(req.body)
    .then((response) => {
      if (req.session.userLoggedIn) {
        res.redirect("/");
      } else {
        if (response.loginStatus) {
          req.session.userLoggedIn = true;
          req.session.user = response.user;
          checkBlocked
          res.redirect('/');
        } else {
          const errorMessage = response.errorMessage;
          res.render("user/login", { errorMessage });
        }
      }
    })
    .catch((error) => {
      res.redirect("/login");
    });
};

exports.userLogout = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};

exports.userSignup = (req, res) => {
  try{
    if (req.session.userLoggedIn) {
      res.redirect("/");
    } else {
      const errorMessage = req.session.message;
      req.session.message = null; 
      res.render("user/signup", { errorMessage });
    }
  } catch(error){

  }
};

exports.userSignupData = (req, res) => {
  try{
  if (req.session.userLoggedIn) {
    req.redirect("/");
  } else {
    
    (req.session.phone = req.body.userphone),
      userHelpers.signupData(req.body).then((response) => {
        if (response.status === false) {
          const errorMessage = response.message;
          res.render('user/signup',{errorMessage});
        } else {
          res.redirect("/otpverify");
        } 
      });
  }
  } catch(error){
    console.log(error.message);
  }
  
};

exports.otpVerification = (req, res) => {
  res.render("user/otpVerify"), { layout: false };
};

exports.otpData = (req, res) => {
  try{
    if (req.session.userLoggedIn) {
      res.redirect("/");
    } else {
      const userNumber = req.session.phone;
      userHelpers.otpVerify(userNumber, req.body.otp_pin).then((response) => {
        if (response.status) {
          res.redirect("/login");
        } else {
          res.redirect("/otpverify");
        }
      });
    }
  } catch(error){

  }
  
};
