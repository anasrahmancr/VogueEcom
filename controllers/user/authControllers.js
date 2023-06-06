const userHelpers = require("../../helpers/userHelpers");
const {checkBlocked} = require('../../util/middleware')

exports.userLogin = (req, res) => {
  if (req.session.userLoggedIn) {
    res.redirect("/");
  } else {
    const errorMessage = req.session.errorMessage;
    req.session.errorMessage = null;
    res.render("user/login",{errorMessage});
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
          console.log(errorMessage,"ERRRRor MESSSage");
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
  if (req.session.userLoggedIn) {
    res.redirect("/");
  } else {
    const errorMessage = req.session.message;
    req.session.message = null; 
    res.render("user/signup", { errorMessage });
  }
};

exports.userSignupData = (req, res) => {
  if (req.session.userLoggedIn) {
    req.redirect("/");
  } else {
    
    (req.session.phone = req.body.userphone),
      userHelpers.signupData(req.body).then((response) => {
        if (response.status === false) {
          const errorMessage = response.message;
          res.render('user/signup',{errorMessage});
        } else {
          res.redirect("/");
        }
      });
  }
};

exports.otpVerification = (req, res) => {
  res.render("user/otpVerify"), { layout: false };
};

exports.otpData = (req, res) => {
  if (req.session.userLoggedIn) {
    res.redirect("/");
  } else {
    const userNumber = req.session.phone;
    
    /*  let otp1 = req.body.digit1;
      let otp2 = req.body.digit2;
      let otp3 = req.body.digit3;
      let otp4 = req.body.digit4;
      const otpCode = otp1 + otp2 + otp3 + otp4; */
    userHelpers.otpVerify(userNumber, req.body.otp_pin).then((response) => {
      if (response.status) {
        req.session.userLoggedIn = true;
        req.session.user = response.userData;
        res.redirect("/login");
      } else {
        res.redirect("/otpverify");
      }
    });
  }
};
