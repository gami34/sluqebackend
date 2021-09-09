var expressAsyncHandler = require("express-async-handler");
var passport = require("passport");
var jwt = require("jsonwebtoken");
var config = require("../config/config");
const fbServiceAccountKey = require("../config/fbServiceAccountKey");
var { admin } = require("../config/firebase");
const { User } = require("../models/userModel");

let tokenExpirationTime = 14 * 24 + 60 * 60; // 14 days expiration period for all tokens
let validityPeriod = 60; // 10 minutes expiration period for this tokens variable

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
  console.log(req.headers);
  passport.authenticate("jwt", { session: false })(req, res, next);
});

exports.resendAuthenticationToken = expressAsyncHandler(
  async (req, res, next) => {
    console.log(req.body);

    // customer should send the emaill address
    User.findOne({ email: req.body.email })
      .then((user) => {
        // this user exist
        // check if it is  valid request

        // check if account is already validated
        if (user?.email_validated == true) {
          return res.json({
            success: true,
            message: "customer is already validated",
          });
        }

        // check if customer has excedded the 3 maz otp requests
        if (
          user.otpRequests <= 2 &&
          new Date() - user.otp_created_at <= 24 * 60 * 60 * 1000 // within the last 24 hours
        ) {
          User.updateOne(
            { _id: user._id },
            { $inc: { otpRequests: 1 } } // increment the request by 1 for this user
          ).exec((err) => {
            if (err) {
              res.json({
                success: false,
                message: "Internal server error",
              });
            }

            // 200 response
            req.user = user;
            next(); // move to the next middleware to handle the request
          });
          // generate an OTP value
          // send this user an otp value
        } else {
          // alse account for days that the user ask for a request the following day
          res.json({
            success: false,
            message: "maximum requests exceeded for the day",
          });
        }
      })
      .catch((err) => {
        res.json({
          success: false,
          message: "no account found",
        });
      });
    // check the db for email address

    // update the info with value received

    // push to next
    // passport.authenticate("jwt", { session: false })(req, res, next);
  }
);

exports.isAuthenticatedJWT = expressAsyncHandler(async (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.send("you are not authenticated");
  }
});
