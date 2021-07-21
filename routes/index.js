var express = require('express');
const { isAuthenticatedJWT } = require('../middlewares/auth');
var router = express.Router();

/* GET home page. */
router.get('/', isAuthenticatedJWT, function (req, res, next) {
  res.render('index', { title: 'Sluqe Dashboard' });
});

module.exports = router;