var mongoose = require("mongoose");
var { ObjectId } = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema(
  {
    // pseudo: { type: String, minlength: 5, maxlength: 15, unique: true },
    // sex: { type: String, default: "Male" },
    email: { type: String, index: true, unique: true },
    role: { type: ObjectId, ref: "Role" }, // ["vendor", "customer", "admin"]
    provider: { type: String },
    department: { type: String },
    cart: { type: Array, default: [] },
    googleId: { type: String, default: "" },
    agreement: { type: Boolean, default: false },
    email_validated: { type: Boolean, default: false }, // needs to send an OTP question
    lastOTP: { type: String },
    otpRequests: { type: Number, default: 0 },
    otp_created_at: { type: Date },

    // wishlist: [{ type: ObjectId, ref: "Product" }],
    //measurement parameters
    //acount info
  },
  {
    timestamps: true,
  }
);
userSchema.plugin(passportLocalMongoose);

exports.User = mongoose.model("User", userSchema);
