var expressAsyncHandler = require("express-async-handler");
var { User } = require('../models/userModel')
var jwt = require("jsonwebtoken");
var passport = require("passport");
const { NotExtended } = require("http-errors");
const config = require("../config/config");
const { getTokenFunc } = require("../middlewares/auth");

let tokenExpirationTime

exports.userSignupLocal = expressAsyncHandler(async (req, res, next) => {
    User.register(new User({
        username: req.body.email,
        sex: req.body.displayName,
        email: req.body.email,
        role: req.body.role,
        agreement:req.body.agreement
    }), req.body.password, async (err, user) => {
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'applcation/json');
            res.json({ success: false, message : err.message })
        } else {
            
            let token = await getTokenFunc({_id : user?._id})
            res.statusCode = 200;
            res.setHeader('Content-Type', 'applcation/json');
            res.setHeader('Authorization', 'Bearer ' + token);
            res.json({ success: true, status: 'Registration Successful', user, token  })

        }
    })
})
exports.googleUserSignin = expressAsyncHandler(async (req, res ) => {

    const { user_id, name, email, picture, firebase: { sign_in_provider }, phoneNumber } = req.user;
    User.findOne({username: email}).then(async (user) => {
        if(user){
            let token = await getTokenFunc({_id : user?._id})
            res.statusCode = 200;
            res.setHeader('Content-Type', 'applcation/json');
            res.setHeader('Authorization', 'Bearer ' + token);
            return res.json({ success: true, status: 'Signin Successful', user })
        } else {
            User.register(new User({
                username: email,
                email: email,
                provider: sign_in_provider,
                googleid: user_id,
                agreement: true
            }), "" +user_id + ""+ user_id, async (err, user) => {
                if (err) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'applcation/json');
                    return res.json({ success: false, err })
                } else {
                    
                    let token = await getTokenFunc({_id : user?._id})
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'applcation/json');
                    res.setHeader('Authorization', 'Bearer ' + token);
                    return res.json({ success: true, status: 'Signin Successful', user })
        
                }
            })
        }
    }).catch(err => {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'applcation/json');
        return res.json({ success: false, err })
    })
})

exports.userSignin = expressAsyncHandler(async (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'applcation/json');
    res.setHeader('Authorization', 'Bearer ' + req.token);
    res.json({ success: true, status: 'SignedIn Successful', user: req.user, token: req.token })
})


exports.authenticatedUser = expressAsyncHandler(async (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'applcation/json');
    res.json({ success: true, status: 'SignedIn Successful', user: req.user })
})

exports.userSignout = expressAsyncHandler(async (req, res, next) => {
    if (req.session) {
        req.session.destroy();
        req.logOut()
        res.clearCookie('session-id')
        res.json({ success: true })
    } else {
        var err = new Error('Your are not logged in!')
        err.status = 403;
        res.json({ err })
    }
})