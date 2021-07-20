var express = require('express');
const { userSignupLocal, userSignin, userSignout } = require('../controllers/userControllers');
const { authenticateLocal, getToken, authenticateGoogle, authenticateGooglePage } = require('../middlewares/auth');
const { signupValidDataChecker, errorCatcher } = require('../middlewares/validInfoChecker');
var router = express.Router();



module.exports = router;
