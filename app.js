var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var config = require("./config/config");
var session = require("express-session");
var passport = require("passport");

var indexRouter = require("./routes/index");
var authRouter = require("./routes/auth");
var usersRouter = require("./routes/users");
var roleRouter = require("./routes/role");
var resourceRouter = require("./routes/resources");
var permissionRouter = require("./routes/permission");
var dashboardRouter = require("./routes/dashboard");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// DB
mongoose
  .connect(config.LOCAL.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.error("Error connected to mongodb:", error.reason);
  });

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Authorization"
  );
  next();
});

//express session middleware and also sets the user cookie
app.use(
  session({
    secret: config.LOCAL.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
  })
);

// setup passport middleware
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/v1/api", indexRouter);
app.use("/v1/api/dashboard", dashboardRouter);
app.use("/v1/api/auth", authRouter);
app.use("/v1/api/users", usersRouter);
app.use("/v1/api/role", roleRouter);
app.use("/v1/api/resource", resourceRouter);
app.use("/v1/api/permission", permissionRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
