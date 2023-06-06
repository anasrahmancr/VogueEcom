const categories = require('../models/category')
// admin Layout
function adminMiddleware (req, res, next){
  res.locals.admin = true;
  next();
}

//userLogin
 function userLogin(req,res,next){
    if(req.session.userLoggedIn){
        next();
    }
    else{
        res.redirect('/login')
    }

    
}

// headerMiddleware
const userheaderMiddleware = (req, res, next) => {
  res.locals.user = req.session.user;
  next()
}

const adminheaderMiddleware = (req, res, next) => {
  res.locals.admin = req.session.admin;
  next()
}

// adminTrue 
  function adminTrue(req,res,next){
    if(req.session.adminLoggedIn){
        next(); 
    }
    else{
        res.render('admin/login')
    } 
  };

  // checkBlocked
  function checkBlocked(req, res, next) {
    // Assuming you have the user object available in req.user
    if (req.session.user.isBlocked) {
      
      console.log('user blockeddddddddddddddddd');
      return res.status(403).json({ error: 'Access denied. Your account is blocked.' });
    }
    // If the user is not blocked, proceed to the next middleware/route handler
    next();
  };

  function categoriesMiddleware(req, res, next) {
    categories.find().then((category) => {
      res.locals.categories = category;
      next();
    }).catch((error) => {
      next(error);
    });
  }
  

module.exports = {userLogin, userheaderMiddleware, adminTrue, checkBlocked, adminMiddleware, adminheaderMiddleware, 
  categoriesMiddleware};