const expressAsyncHandler = require("express-async-handler");
const {auth, googleAuthProvider} = require("../config/firebase")


exports.trackerGoogle = expressAsyncHandler(async (req, res, next) => {
    console.log(req, res);
    next();
})


exports.sendFirebase = expressAsyncHandler(async (req, res) => {
    res.json({ auth, googleAuthProvider })
})