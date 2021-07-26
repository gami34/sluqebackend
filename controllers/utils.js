const expressAsyncHandler = require("express-async-handler");
const { auth, googleAuthProvider } = require("../config/firebase");
var otpGenerator = require("otp-generator");
const { transporter } = require("../config/nodeMailerTransplrt");

exports.trackerGoogle = expressAsyncHandler(async (req, res, next) => {
  console.log(req, res);
  next();
});

exports.sendFirebase = expressAsyncHandler(async (req, res) => {
  res.json({ auth, googleAuthProvider });
});

exports.genOTP = expressAsyncHandler(async () => {
  return otpGenerator.generate(6, {
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
});

exports.sendEmailOTP = (emailAddress) => {
  // generate a random 6 digits OTP
  return new Promise(async (resolved, rejected) => {
    // OTP
    try {
      // gen OTP
      var OTP = await this.genOTP();
      console.log("OTP Value", OTP);
      //save the OTP to database tied to theis user

      // send a mail to client
      let message =
        "<b>Hi,\n kindly find your OTP for authentication </b>\n\nOTP Auth: " +
        OTP;
      this.emailSender(
        emailAddress,
        "Sluqe OTP Authentication, Brandcery",
        message
      );
      resolved(OTP);
    } catch (error) {
      console.log(error);
      rejected();
    }
  });
};

exports.emailSender = expressAsyncHandler(
  async (email, subjectHeader, mesageText) => {
    const mailOptions = {
      from: "g.mmeremnwanne@brandcery.com", //Adding sender's email
      to: email, //Getting recipient's email by query string
      subject: subjectHeader,
      html: mesageText, //Email content in HTML
    };
    return transporter
      .sendMail(mailOptions)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
);
