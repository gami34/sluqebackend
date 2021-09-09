const expressAsyncHandler = require("express-async-handler");
const { check, validationResult } = require("express-validator"); //documentation for express-validator https://express-validator.github.io/docs/

exports.signupValidDataChecker = [
  check("email", "Email Field is required").not().isEmpty(),
  check("email", "Invalid email entered").isEmail(),
  check("role", "Username Field is required").not().isEmpty(),
  check("password", "Password Field is required").not().isEmpty(),
  check("password", "Password Field is required").not().isEmpty(),
  check("confirmPassword", "your Confirm password Field is required")
    .not()
    .isEmpty(),
  check("confirmPassword", "Passwords do not match").custom(
    (value, { req }) => {
      if (value != req.body.password) {
        throw new Error();
      } else {
        return value;
      }
    }
  ),
];

exports.validateEmailField = [
  check("email", "Email Field is required").not().isEmpty(),
  check("email", "Invalid email entered").isEmail(),
];

exports.validatePasswordFields = [
  check("password", "Password Field is required").not().isEmpty(),
  check("confirmPassword", "Password Field is required").not().isEmpty(),
  check("confirmPassword", "Passwords do not match").custom(
    (value, { req }) => {
      if (value != req.body.password) {
        throw new Error();
      } else {
        return value;
      }
    }
  ),
];


exports.validateRoleData = [
  check("name", "Name Field is Required").not().isEmpty(),
  check("description", "Description Field is required").not().isEmpty(),
];

exports.validateSystemResourceData = [
  check("name", "Name Field is Required").not().isEmpty(),
  check("description", "Description Field is required").not().isEmpty(),
];

exports.errorCatcher = expressAsyncHandler(async (req, res, next) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("an error occured with the key values")
    return res.status(422).json({ success: false, errors: errors.array() });
  } else {
    next();
  }
});
