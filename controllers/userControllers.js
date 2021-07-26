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
      sex: req.body.displayName,
      email: req.body.email,
      role: req.body.role,
      agreement: req.body.agreement,
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
    user_id,
    name,
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
      return res.json({ success: false, err });
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

// this code base flow need to be improved upon
exports.validateUserEmail = expressAsyncHandler(async (req, res) => {
  // find this usr by ID based on the authebticated user by token
  User.findOne({ _id: req.user.id })
    .then((user) => {
      // if the opt received matches the otp expected:
      if (req.body.otp == user.lastOTP) {
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
            User.findOne({ _id: req.user.id }, (err, validatedUser) => {
              if (err) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "applcation/json");
                return res.json({ success: false, status: "No User found " });
              }

              //genetate a valid token
              let token = getTokenFunc({ _id: validatedUser.id });
              // send customer a welcome mail
              emailSender(
                validatedUser.email,
                "Welcome to Sluqe's Fashion App, Brandcery",
                "Hello Dear,\nWelcome to the Sluqe's Fashion Application"
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
