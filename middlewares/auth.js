var expressAsyncHandler = require("express-async-handler");
var passport = require("passport");
var jwt = require("jsonwebtoken");
var config = require("../config/config");
const fbServiceAccountKey = require("../config/fbServiceAccountKey");
var { admin } = require("../config/firebase");

let tokenExpirationTime = 14 * 24 + 60 * 60; // 14 days expiration period for all tokens
let validityPeriod = 10 * 60; // 10 minutes expiration period for this tokens variable

exports.isAuthenticatedGoogleFirebase = async (req, res, next) => {
  try {
    const firebaseUser = await admin.auth().verifyIdToken(req?.headers?.token);
    req.user = firebaseUser;
    next();
  } catch (error) {
    res.status(404).json({
      error: "Invald or expired token",
    });
  }
};
exports.authenticateLocal = expressAsyncHandler(async (req, res, next) => {
  passport.authenticate("local", { session: false })(req, res, next);
});
exports.authenticateGooglePage = expressAsyncHandler(async (req, res, next) => {
  passport.authenticate("google", { scope: ["profile"] })(req, res, next);
});
exports.authenticateGoogle = expressAsyncHandler(async (req, res, next) => {
  passport.authenticate("google")(req, res, next);
});
exports.authenticateFirebaseGoogle = expressAsyncHandler(
  async (req, res, next) => {
    try {
      const firebaseUser = await admin.auth().verifyIdToken(req.headers.token);
      console.log(firebaseUser);
      req.user = firebaseUser;
      next();
    } catch (error) {
      res.status(404).json({
        error: "Invald or expired token",
      });
    }
  }
);

exports.getToken = expressAsyncHandler(async (req, res, next) => {
  req.token = jwt.sign({ _id: req.user._id }, config.LOCAL.SECRET, {
    expiresIn: tokenExpirationTime,
  });
  next();
});

exports.getTokenFunc = (user) => {
  return jwt.sign(user, config.LOCAL.SECRET, {
    expiresIn: tokenExpirationTime,
  });
};

exports.getTimedTokenFunc = (user) => {
  return jwt.sign(user, config.LOCAL.SECRET, { expiresIn: validityPeriod });
};

exports.authenticateJWT = expressAsyncHandler(async (req, res, next) => {
  passport.authenticate("jwt", { session: false })(req, res, next);
});

exports.isAuthenticatedJWT = expressAsyncHandler(async (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.send("you are not authenticated");
  }
});
