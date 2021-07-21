var express = require('express');
const { userSignupLocal, userSignin, userSignout, googleUserSignin, authenticatedUser } = require('../controllers/userControllers');
const { authenticateLocal, getToken, authenticateGooglePage, authenticateGoogle, isAuthenticatedGoogleFirebase, authenticateJWT } = require('../middlewares/auth');
const { signupValidDataChecker, errorCatcher } = require('../middlewares/validInfoChecker');
var router = express.Router();

router.post("/signup", signupValidDataChecker, errorCatcher, userSignupLocal); // working 
router.post("/signin", authenticateLocal, getToken, userSignin);
router.post("/authenticatetoken", authenticateJWT, authenticatedUser);


router.get("/google", authenticateGooglePage);
router.get("/googleredirect", authenticateGoogle, (req, res) => {
    res.json({sucessful: true})
} );
router.post("/googlefire", isAuthenticatedGoogleFirebase, googleUserSignin);
router.get('/signout', userSignout)

module.exports = router;
