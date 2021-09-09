var expressAsyncHandler = require("express-async-handler");
var { User } = require("../models/userModel");
var jwt = require("jsonwebtoken");
var passport = require("passport");
const { NotExtended } = require("http-errors");
const config = require("../config/config");
const { getTokenFunc, getTimedTokenFunc } = require("../middlewares/auth");
const { sendEmailOTP, emailSender } = require("./utils");

exports.userSignupLocal = expressAsyncHandler(async (req, res, next) => {
  User.register(
    new User({
      username: req.body.email,
      email: req.body.email,
      role: req.body.role,
      agreement: req.body.agreement,
      otp_created_at: new Date(),
    }),
    req.body.password,
    async (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "applcation/json");
        res.json({ success: false, message: err.message });
      } else {
        // send out an otp to the registering email address
        sendEmailOTP(req.body.email)
          .then((OTP) => {
            User.updateOne(
              { _id: user._id },
              { $set: { lastOTP: OTP } },
              async (err) => {
                if (err) {
                  res.setHeader("Content-Type", "applcation/json");
                  return res.json({
                    success: false,
                    status: "Registration not Successful",
                  });
                }
                let token = await getTimedTokenFunc({ _id: user?._id });

                await delete user.hash;
                await delete user.salt;
                res.statusCode = 200;
                res.setHeader("Content-Type", "applcation/json");
                res.setHeader("Authorization", "Bearer " + token);
                res.json({
                  success: true,
                  status: "Registration Successful",
                  user,
                  token: "Bearer " + token,
                });
              }
            );
          })
          .catch((error) => {
            res.setHeader("Content-Type", "applcation/json");
            res.json({ success: false, status: "Registration not Successful" });
          });
      }
    }
  );
});

exports.googleUserSignin = expressAsyncHandler(async (req, res) => {
  const {
    email,
    picture,
    firebase: { sign_in_provider },
    phoneNumber,
  } = req.user;
  User.findOne({ username: email })
    .then(async (user) => {
      if (user) {
        let token = await getTokenFunc({ _id: user?._id });
        res.statusCode = 200;
        res.setHeader("Content-Type", "applcation/json");
        res.setHeader("Authorization", "Bearer " + token);
        return res.json({ success: true, status: "Signin Successful", user });
      } else {
        User.register(
          new User({
            username: email,
            email: email,
            provider: sign_in_provider,
            googleid: user_id,
            agreement: true,
          }),
          "" + user_id + "" + user_id,
          async (err, user) => {
            if (err) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "applcation/json");
              return res.json({ success: false, err });
            } else {
              let token = await getTokenFunc({ _id: user?._id });
              res.statusCode = 200;
              res.setHeader("Content-Type", "applcation/json");
              res.setHeader("Authorization", "Bearer " + token);
              await delete user.hash;
              await delete user.salt;
              return res.json({
                success: true,
                status: "Signin Successful",
                user,
              });
            }
          }
        );
      }
    })
    .catch((err) => {
      res.statusCode = 500;
      res.setHeader("Content-Type", "applcation/json");
      return res.json({ success: false, status: err.message });
    });
});

exports.userSignin = expressAsyncHandler(async (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "applcation/json");
  res.setHeader("Authorization", "Bearer " + req.token);
  res.json({
    success: true,
    status: "SignedIn Successful",
    user: req.user,
    token: req.token,
  });
});

exports.authenticatedUser = expressAsyncHandler(async (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "applcation/json");
  res.json({ success: true, status: "SignedIn Successful", user: req.user });
});

exports.userRegistrationRequest = expressAsyncHandler(async (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err || user == null) {
      return res.json({
        success: false,
        message: " Internal server error",
      });
    }
    let prospect = new User({
      email: req.body.email,
    });
    prospect.save((err) => {
      if (err) {
        return res.json({
          success: false,
          message: "internal server error",
        });
      }

      return res.json({
        success: true,
        message: "Kindly proceed to the next stage",
      });
    });
  });
});

exports.onForgetPasswordRequest = expressAsyncHandler(async (req, res) => {
  // check if this is a registered user
  User.findOne({ email: req?.body?.email }, (err, user) => {
    if (err) {
      return res.json({
        success: false,
        message: "no user found for this account",
      });
    }

    //udpate the otp value on the database
    User.updateOne({ _id: user.id }, { $set: { lastOTP: OTP } }).exec((err) => {
      if (err) {
        return res.json({
          success: false,
          message: "Internal server error",
        });
      }

      // end an otp mail to this emaill address
      sendEmailOTP(user.email).then((OTP) => {
        // generate an Token
        let token = getTimedTokenFunc({ _id: user?._id }); // expires after 60 seconds

        res.statusCode = 200;
        res.setHeader("Content-Type", "applcation/json");
        return res.json({
          success: true,
          status: "request Successful",
          token,
        });
      });
    });
  });
});

exports.onCompleteForgetPassword = expressAsyncHandler(async (req, res) => {
  // Hack: remove the old customer information from the record and then create a new record using the passport algortithm
  User.findOneAndRemove({ _id: req.user.id }, async (err) => {
    if (err) {
      return res.json({
        success: false,
        status: "internal server error",
      });
    }

    await delete req.user.hash;
    await delete req.user.salt;

    User.register(
      new User({
        ...req.user,
      }),
      req.body.password, // this is the new password that will be get hashed by passport for us
      (err, user) => {
        if (err) {
          return res.json({
            success: false,
            status: "internal server error",
          });
        }

        return res.json({
          success: true,
          status: " password change was successful",
        });

        //send user a mail that the process has been completed
        emailSender(
          req.user.email,
          "Success Password change",
          "<b>Hello Dear,<br/>Kindly be informed that your password change process has been completed/b>"
        );
      }
    );
  });

  // update the new password with the new password using passport
  // send customer  a mail that the process has been completed
});

exports.resendOTP = expressAsyncHandler(async (req, res) => {
  if (!req.user?.email_validated) {
    // get the user info
    let user = req.user;

    // resend an OTP to the customer's email address
    sendEmailOTP(user?.email).then((OTP) => {
      // update the OTP value
      User.updateOne(
        { _id: user.id },
        { $set: { lastOTP: OTP } },
        async (err) => {
          if (err) {
            res.statusCode = 501;
            return res.json({
              success: false,
              status: "OTP request not Successful",
            });
          }

          // updated user values should be returned instead
          User.findOne({ _id: user._id }, async (err, updateduserValue) => {
            if (err) {
              res.json({
                success: false,
                message: "internal server error",
              });
            }

            // else send 200 response
            // remove the hash and salt value
            await delete user.hash;
            await delete user.salt;

            let token = await getTimedTokenFunc({ _id: user?._id });

            res.statusCode = 200;
            res.setHeader("Content-Type", "applcation/json");
            return res.json({
              success: true,
              status: "Registration Successful",
              user: updateduserValue,
              token: "Bearer " + token,
            });
          });
        }
      );
    });
  } else {
    res.statusCode = 403;
    res.setHeader("Content-Type", "applcation/json");
    res.json({
      success: false,
      status: "invalid OTP request",
    });
  }

  // regenerate an Token to the customer
});

// this code base flow need to be improved upon
exports.validateUserEmail = expressAsyncHandler(async (req, res) => {
  // find this usr by ID based on the authebticated user by token

  User.findOne({ _id: req.user.id })
    .then((user) => {
      // if the otp received matches the otp expected:
      if (req.body.otp == user.lastOTP && !user?.email_validated) {
        // update the value of the email as validated
        User.updateOne(
          { _id: req.user.id },
          { $set: { email_validated: true } },
          (err) => {
            if (err) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "applcation/json");
              return res.json({ success: false, status: "No User found " });
            }

            // get the updated user and send to the front end
            User.findOne({ _id: req.user.id }, async (err, validatedUser) => {
              if (err) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "applcation/json");
                return res.json({ success: false, status: "No User found " });
              }

              //genetate a valid token
              let token = getTokenFunc({ _id: validatedUser.id });
              // send customer a welcome mail
              await emailSender(
                validatedUser.email,
                "Welcome to Sluqe's Fashion App, Brandcery",
                "<b>Hello Dear,<br/>Welcome to the Sluqe's Fashion Application</b>"
              );

              //send customer the valid Token
              delete validatedUser.hash;
              delete validatedUser.salt;
              res.statusCode = 200;
              res.setHeader("Content-Type", "applcation/json");

              // send the updated user info to the frontend
              return res.json({
                success: true,
                status: "SignedIn Successful",
                user: validatedUser,
                token: "Bearer " + token,
              });
            });
          }
        );
      } else {
        res.statusCode = 500;
        res.setHeader("Content-Type", "applcation/json");
        return res.json({
          success: false,
          status: "No User found ",
        });
      }
    })
    .catch((err) => {
      res.statusCode = 500;
      res.setHeader("Content-Type", "applcation/json");
      res.json({ success: false, status: "No User found " });
    });
});

exports.userSignout = expressAsyncHandler(async (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    req.logOut();
    res.clearCookie("session-id");
    res.json({ success: true });
  } else {
    var err = new Error("Your are not logged in!");
    err.status = 403;
    res.json({ err });
  }
});
