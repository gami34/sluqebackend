var express = require("express");
const {
  userSignupLocal,
  userSignin,
  userSignout,
  googleUserSignin,
  authenticatedUser,
  validateUserEmail,
  resendOTP,
  userRegistrationRequest,
  onForgetPasswordRequest,
  onCompleteForgetPassword,
} = require("../controllers/userControllers");
const {
  authenticateLocal,
  getToken,
  authenticateGooglePage,
  authenticateGoogle,
  isAuthenticatedGoogleFirebase,
  authenticateJWT,
  resendAuthenticationToken,
} = require("../middlewares/auth");
const {
  signupValidDataChecker,
  errorCatcher,
  validateEmailField,
  validatePasswordFields,
} = require("../middlewares/validInfoChecker");
var router = express.Router();

router.post("/signup", signupValidDataChecker, errorCatcher, userSignupLocal); // working
router.post("/signin", authenticateLocal, getToken, userSignin);
router.post("/authenticatetoken", authenticateJWT, authenticatedUser);
router.post("/validateuseremail", authenticateJWT, validateUserEmail);
router.post(
  "/registrationrequest",
  validateEmailField,
  errorCatcher,
  userRegistrationRequest
);
router.post("/resendotp", resendAuthenticationToken, resendOTP);
router.post(
  "/forgetpassword",
  validateEmailField,
  errorCatcher,
  onForgetPasswordRequest
);
router.post(
  "/completeforgetpassword",
  authenticateJWT,
  validatePasswordFields,
  errorCatcher,
  onCompleteForgetPassword
);

router.get("/google", authenticateGooglePage);
router.get("/googleredirect", authenticateGoogle, (req, res) => {
  res.json({ sucessful: true });
});
router.post("/googlefire", isAuthenticatedGoogleFirebase, googleUserSignin);
router.get("/signout", userSignout);

module.exports = router;
