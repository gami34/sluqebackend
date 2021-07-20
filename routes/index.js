var express = require('express');
const { isAuthenticatedJWT } = require('../middlewares/auth');
var router = express.Router();

/* GET home page. */
router.get('/',(req,res , next)=>{
  console.log("weolding ");
  console.log(req)
  next();
}, isAuthenticatedJWT, function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;