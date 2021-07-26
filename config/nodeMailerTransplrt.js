const nodemailer = require("nodemailer");
const config = require("./config");

exports.transporter = nodemailer.createTransport({
  secure: true,
  host: config.NODEMAILER.HOST,
  port: config.NODEMAILER.PORT,
  auth: {
    user: config.NODEMAILER.USERNAME,
    pass: config.NODEMAILER.PASSWORD,
  },
});
