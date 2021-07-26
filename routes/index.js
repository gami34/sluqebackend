var express = require("express");
const { isAuthenticatedJWT, authenticateJWT } = require("../middlewares/auth");
var router = express.Router();

/* GET home page. */
router.get("/", authenticateJWT, isAuthenticatedJWT, function (req, res, next) {
  res.render("index", { title: "Sluqe Dashboard" });
});

module.exports = router;
